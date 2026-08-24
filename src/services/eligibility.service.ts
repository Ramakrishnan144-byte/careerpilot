export type EligibilityStatus = 'ELIGIBLE' | 'VERIFY_REQUIRED' | 'NOT_ELIGIBLE';

export interface RuleCheckResult {
  ruleName: string;
  expected: string;
  actual: string;
  isSatisfied: boolean;
  isWarning?: boolean;
  message: string;
}

export interface EligibilityEvaluation {
  status: EligibilityStatus;
  percentage: number; // 0 - 100
  isEligible: boolean;
  reasons: string[];
  ruleChecks: RuleCheckResult[];
}

export interface StudentEligibilityInput {
  cgpa: number;
  backlogs: number;
  historyOfBacklogs?: number;
  departmentCode?: string | null;
  graduationYear: number;
  currentYear?: number;
  experienceYears?: number;
  skills: string[];
}

export interface OpportunityEligibilityCriteria {
  minCgpa: number;
  maxBacklogsAllowed: number;
  allowedDepartments?: string; // Comma separated, e.g. "CSE,IT,AI_DS,ECE" or "ALL"
  allowedGraduationYears?: string; // Comma separated, e.g. "2025,2026" or "ALL"
  minExperienceYears?: number;
  requiredSkills?: string[];
}

export class EligibilityService {
  public static evaluate(
    student: StudentEligibilityInput,
    criteria: OpportunityEligibilityCriteria
  ): EligibilityEvaluation {
    const ruleChecks: RuleCheckResult[] = [];
    const reasons: string[] = [];
    let criticalFails = 0;
    let warnings = 0;
    let totalRules = 0;
    let passedRules = 0;

    // 1. CGPA Check
    totalRules++;
    const minCgpa = criteria.minCgpa ?? 7.0;
    const cgpaPassed = student.cgpa >= minCgpa;
    if (cgpaPassed) {
      passedRules++;
      ruleChecks.push({
        ruleName: 'Minimum CGPA',
        expected: `>= ${minCgpa}`,
        actual: `${student.cgpa}`,
        isSatisfied: true,
        message: `CGPA requirement satisfied (${student.cgpa} >= ${minCgpa}).`,
      });
    } else {
      // If student is very close (within 0.3), treat as warning/verify required
      const isClose = minCgpa - student.cgpa <= 0.3;
      if (isClose) {
        warnings++;
        passedRules += 0.5;
        ruleChecks.push({
          ruleName: 'Minimum CGPA',
          expected: `>= ${minCgpa}`,
          actual: `${student.cgpa}`,
          isSatisfied: false,
          isWarning: true,
          message: `CGPA (${student.cgpa}) is slightly below cutoff (${minCgpa}). Requires TPO verification.`,
        });
        reasons.push(`CGPA (${student.cgpa}) is close to cutoff (${minCgpa}).`);
      } else {
        criticalFails++;
        ruleChecks.push({
          ruleName: 'Minimum CGPA',
          expected: `>= ${minCgpa}`,
          actual: `${student.cgpa}`,
          isSatisfied: false,
          message: `CGPA (${student.cgpa}) is below required minimum of ${minCgpa}.`,
        });
        reasons.push(`CGPA is ${student.cgpa}, but minimum required is ${minCgpa}.`);
      }
    }

    // 2. Active Backlogs Check
    totalRules++;
    const maxBacklogs = criteria.maxBacklogsAllowed ?? 0;
    const backlogsPassed = student.backlogs <= maxBacklogs;
    if (backlogsPassed) {
      passedRules++;
      ruleChecks.push({
        ruleName: 'Active Backlogs',
        expected: `<= ${maxBacklogs}`,
        actual: `${student.backlogs}`,
        isSatisfied: true,
        message: `Backlog policy satisfied (Active: ${student.backlogs}, Max Allowed: ${maxBacklogs}).`,
      });
    } else {
      criticalFails++;
      ruleChecks.push({
        ruleName: 'Active Backlogs',
        expected: `<= ${maxBacklogs}`,
        actual: `${student.backlogs}`,
        isSatisfied: false,
        message: `Student has ${student.backlogs} active backlogs; maximum permitted is ${maxBacklogs}.`,
      });
      reasons.push(`Has ${student.backlogs} active backlog(s); limit is ${maxBacklogs}.`);
    }

    // 3. Department / Branch Check
    totalRules++;
    const allowedDepts = (criteria.allowedDepartments || 'ALL')
      .split(',')
      .map((d) => d.trim().toUpperCase());
    
    const dept = (student.departmentCode || '').toUpperCase();
    const deptAllowed = allowedDepts.includes('ALL') || allowedDepts.includes(dept);

    if (deptAllowed) {
      passedRules++;
      ruleChecks.push({
        ruleName: 'Department / Branch',
        expected: criteria.allowedDepartments || 'All Departments',
        actual: student.departmentCode || 'General',
        isSatisfied: true,
        message: `Department (${student.departmentCode || 'All'}) is eligible for this opportunity.`,
      });
    } else {
      criticalFails++;
      ruleChecks.push({
        ruleName: 'Department / Branch',
        expected: criteria.allowedDepartments || 'Specific Branches',
        actual: student.departmentCode || 'Unknown',
        isSatisfied: false,
        message: `Department ${student.departmentCode} is not listed in allowed branches (${criteria.allowedDepartments}).`,
      });
      reasons.push(`Department ${student.departmentCode} not in accepted branches.`);
    }

    // 4. Graduation Year Check
    totalRules++;
    const allowedYears = (criteria.allowedGraduationYears || 'ALL')
      .split(',')
      .map((y) => y.trim());
    const yearAllowed = allowedYears.includes('ALL') || allowedYears.includes(String(student.graduationYear));

    if (yearAllowed) {
      passedRules++;
      ruleChecks.push({
        ruleName: 'Graduation Year',
        expected: criteria.allowedGraduationYears || 'All Batches',
        actual: `${student.graduationYear}`,
        isSatisfied: true,
        message: `Graduation batch (${student.graduationYear}) is eligible.`,
      });
    } else {
      criticalFails++;
      ruleChecks.push({
        ruleName: 'Graduation Year',
        expected: criteria.allowedGraduationYears || 'Specific Batches',
        actual: `${student.graduationYear}`,
        isSatisfied: false,
        message: `Graduation year (${student.graduationYear}) does not match drive batch (${criteria.allowedGraduationYears}).`,
      });
      reasons.push(`Graduation batch ${student.graduationYear} not eligible.`);
    }

    // 5. Mandatory Skill Check (if required skills specified)
    if (criteria.requiredSkills && criteria.requiredSkills.length > 0) {
      totalRules++;
      const studentSkillSet = new Set(student.skills.map((s) => s.toLowerCase().trim()));
      const missingRequired = criteria.requiredSkills.filter(
        (s) => !studentSkillSet.has(s.toLowerCase().trim())
      );

      if (missingRequired.length === 0) {
        passedRules++;
        ruleChecks.push({
          ruleName: 'Mandatory Technical Skills',
          expected: criteria.requiredSkills.join(', '),
          actual: 'All Present',
          isSatisfied: true,
          message: `All ${criteria.requiredSkills.length} mandatory skills are listed in profile.`,
        });
      } else {
        const missingCount = missingRequired.length;
        if (missingCount <= 1 && criteria.requiredSkills.length > 2) {
          warnings++;
          passedRules += 0.6;
          ruleChecks.push({
            ruleName: 'Mandatory Technical Skills',
            expected: criteria.requiredSkills.join(', '),
            actual: `Missing: ${missingRequired.join(', ')}`,
            isSatisfied: false,
            isWarning: true,
            message: `Missing ${missingRequired.join(', ')}. Recommend building a project or completing assessment.`,
          });
          reasons.push(`Missing mandatory skill: ${missingRequired.join(', ')}.`);
        } else {
          criticalFails++;
          ruleChecks.push({
            ruleName: 'Mandatory Technical Skills',
            expected: criteria.requiredSkills.join(', '),
            actual: `Missing: ${missingRequired.join(', ')}`,
            isSatisfied: false,
            message: `Missing required core skills: ${missingRequired.join(', ')}.`,
          });
          reasons.push(`Missing required skills: ${missingRequired.join(', ')}.`);
        }
      }
    }

    // Determine final status
    let status: EligibilityStatus = 'ELIGIBLE';
    let isEligible = true;

    if (criticalFails > 0) {
      status = 'NOT_ELIGIBLE';
      isEligible = false;
    } else if (warnings > 0) {
      status = 'VERIFY_REQUIRED';
      isEligible = true;
    }

    const percentage = Math.round((passedRules / totalRules) * 100);

    return {
      status,
      percentage: Math.min(100, Math.max(0, percentage)),
      isEligible,
      reasons: reasons.length > 0 ? reasons : ['All academic and policy eligibility criteria fully satisfied.'],
      ruleChecks,
    };
  }
}
