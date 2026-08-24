import { describe, it, expect } from 'vitest';
import { EligibilityService } from '../src/services/eligibility.service';

describe('EligibilityService', () => {
  const baseStudent = {
    cgpa: 8.5,
    backlogs: 0,
    departmentCode: 'CSE',
    graduationYear: 2026,
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
  };

  const baseCriteria = {
    minCgpa: 7.5,
    maxBacklogsAllowed: 0,
    allowedDepartments: 'CSE,IT,AI_DS,ECE',
    allowedGraduationYears: '2025,2026',
    requiredSkills: ['React', 'TypeScript'],
  };

  it('should evaluate an eligible candidate as ELIGIBLE with 100% score', () => {
    const result = EligibilityService.evaluate(baseStudent, baseCriteria);
    expect(result.isEligible).toBe(true);
    expect(result.status).toBe('ELIGIBLE');
    expect(result.percentage).toBe(100);
    expect(result.ruleChecks.every((r) => r.isSatisfied)).toBe(true);
  });

  it('should flag student as NOT_ELIGIBLE if CGPA is below cutoff and not close', () => {
    const result = EligibilityService.evaluate(
      { ...baseStudent, cgpa: 6.5 },
      { ...baseCriteria, minCgpa: 8.0 }
    );
    expect(result.isEligible).toBe(false);
    expect(result.status).toBe('NOT_ELIGIBLE');
    expect(result.reasons.some((r) => r.includes('CGPA'))).toBe(true);
  });

  it('should flag student as VERIFY_REQUIRED if CGPA is slightly below cutoff (<0.3 diff)', () => {
    const result = EligibilityService.evaluate(
      { ...baseStudent, cgpa: 7.8 },
      { ...baseCriteria, minCgpa: 8.0 }
    );
    expect(result.isEligible).toBe(true);
    expect(result.status).toBe('VERIFY_REQUIRED');
  });

  it('should flag student as NOT_ELIGIBLE if student has more backlogs than allowed', () => {
    const result = EligibilityService.evaluate(
      { ...baseStudent, backlogs: 2 },
      { ...baseCriteria, maxBacklogsAllowed: 0 }
    );
    expect(result.isEligible).toBe(false);
    expect(result.status).toBe('NOT_ELIGIBLE');
    expect(result.reasons.some((r) => r.includes('backlog'))).toBe(true);
  });

  it('should flag student as NOT_ELIGIBLE if department is not allowed', () => {
    const result = EligibilityService.evaluate(
      { ...baseStudent, departmentCode: 'CIVIL' },
      { ...baseCriteria, allowedDepartments: 'CSE,IT' }
    );
    expect(result.isEligible).toBe(false);
    expect(result.status).toBe('NOT_ELIGIBLE');
  });

  it('should allow ALL departments when allowedDepartments is ALL', () => {
    const result = EligibilityService.evaluate(
      { ...baseStudent, departmentCode: 'ME' },
      { ...baseCriteria, allowedDepartments: 'ALL' }
    );
    expect(result.isEligible).toBe(true);
  });
});
