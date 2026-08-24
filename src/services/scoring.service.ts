import { EligibilityService, StudentEligibilityInput, OpportunityEligibilityCriteria } from './eligibility.service';

export interface ScoringStudentInput extends StudentEligibilityInput {
  resumeText?: string | null;
  targetJobRole?: string | null;
  locationPreference?: string | null;
  workModePreference?: string | null;
  projectsCount?: number;
  internshipsCount?: number;
}

export interface ScoringOpportunityInput extends OpportunityEligibilityCriteria {
  id: string;
  title: string;
  jobRole: string;
  location: string;
  workMode: string;
  skills: Array<{ name: string; isRequired?: boolean; importance?: string } | string>;
  description?: string;
}

export interface ScoreBreakdown {
  skillMatchScore: number; // 0 - 100
  eligibilityScore: number; // 0 - 100
  resumeMatchScore: number; // 0 - 100
  locationMatchScore: number; // 0 - 100
  experienceMatchScore: number; // 0 - 100
  overallPriorityScore: number; // 0 - 100
  tier: 'EXCELLENT' | 'STRONG' | 'GOOD' | 'CONSIDER';
  tierLabel: string;
  stars: number; // 1 to 5
  matchedSkills: string[];
  missingRequiredSkills: string[];
  missingPreferredSkills: string[];
  recommendationReason: string;
  actionableInsights: string[];
}

export class OpportunityScoringService {
  // Configurable weights summing to 1.0
  public static readonly WEIGHTS = {
    SKILL_MATCH: 0.35,
    ELIGIBILITY: 0.25,
    RESUME_MATCH: 0.20,
    LOCATION_WORKMODE: 0.10,
    EXPERIENCE_PROJECTS: 0.10,
  };

  public static calculatePriorityScore(
    student: ScoringStudentInput,
    opportunity: ScoringOpportunityInput
  ): ScoreBreakdown {
    // 1. Skill Match Calculation
    const studentSkillsLower = new Set(student.skills.map((s) => s.toLowerCase().trim()));
    const oppSkills = opportunity.skills.map((s) => {
      if (typeof s === 'string') return { name: s, isRequired: true, importance: 'HIGH' };
      return { name: s.name, isRequired: s.isRequired ?? true, importance: s.importance || 'HIGH' };
    });

    const matchedSkills: string[] = [];
    const missingRequiredSkills: string[] = [];
    const missingPreferredSkills: string[] = [];

    let totalSkillWeight = 0;
    let earnedSkillWeight = 0;

    for (const sk of oppSkills) {
      const weight = sk.isRequired ? 2.0 : 1.0;
      totalSkillWeight += weight;

      if (studentSkillsLower.has(sk.name.toLowerCase().trim())) {
        matchedSkills.push(sk.name);
        earnedSkillWeight += weight;
      } else {
        if (sk.isRequired) {
          missingRequiredSkills.push(sk.name);
        } else {
          missingPreferredSkills.push(sk.name);
        }
      }
    }

    const rawSkillMatch = totalSkillWeight > 0 ? (earnedSkillWeight / totalSkillWeight) * 100 : 85;
    const skillMatchScore = Math.round(Math.min(100, Math.max(0, rawSkillMatch)));

    // 2. Eligibility Calculation
    const eligibilityResult = EligibilityService.evaluate(student, opportunity);
    const eligibilityScore = eligibilityResult.percentage;

    // 3. Resume / Keyword Alignment
    let resumeMatchScore = 70; // baseline
    if (student.resumeText && student.resumeText.length > 50) {
      const resumeLower = student.resumeText.toLowerCase();
      let matchedInResume = 0;
      for (const sk of oppSkills) {
        if (resumeLower.includes(sk.name.toLowerCase())) {
          matchedInResume++;
        }
      }
      const resumeRatio = oppSkills.length > 0 ? matchedInResume / oppSkills.length : 0.7;
      resumeMatchScore = Math.round(resumeRatio * 80 + 20);
    } else {
      // Proxy resume score using skills match if resume text is not provided
      resumeMatchScore = Math.round(skillMatchScore * 0.9);
    }
    resumeMatchScore = Math.min(100, Math.max(25, resumeMatchScore));

    // 4. Location & Work Mode Alignment
    let locationScore = 60;
    const studentLoc = (student.locationPreference || '').toLowerCase();
    const oppLoc = (opportunity.location || '').toLowerCase();
    const studentMode = (student.workModePreference || '').toUpperCase();
    const oppMode = (opportunity.workMode || '').toUpperCase();

    if (oppMode === 'REMOTE' || studentMode === 'REMOTE') {
      locationScore = 95;
    } else if (studentMode === oppMode) {
      locationScore += 20;
    }

    if (studentLoc && oppLoc && (studentLoc.includes(oppLoc) || oppLoc.includes(studentLoc) || studentLoc.includes('any') || studentLoc.includes('remote'))) {
      locationScore = Math.min(100, locationScore + 20);
    }
    const locationMatchScore = Math.min(100, Math.max(40, locationScore));

    // 5. Experience & Projects Score
    const projCount = student.projectsCount ?? 2;
    const internCount = student.internshipsCount ?? 1;
    let expScore = Math.min(100, projCount * 25 + internCount * 30 + 20);
    const experienceMatchScore = Math.min(100, Math.max(30, expScore));

    // Overall Weighted Calculation
    const overall =
      skillMatchScore * this.WEIGHTS.SKILL_MATCH +
      eligibilityScore * this.WEIGHTS.ELIGIBILITY +
      resumeMatchScore * this.WEIGHTS.RESUME_MATCH +
      locationMatchScore * this.WEIGHTS.LOCATION_WORKMODE +
      experienceMatchScore * this.WEIGHTS.EXPERIENCE_PROJECTS;

    const overallPriorityScore = Math.round(Math.min(100, Math.max(0, overall)));

    // Tier & Stars classification
    let tier: 'EXCELLENT' | 'STRONG' | 'GOOD' | 'CONSIDER' = 'CONSIDER';
    let tierLabel = 'Potential Match';
    let stars = 2;

    if (overallPriorityScore >= 85) {
      tier = 'EXCELLENT';
      tierLabel = 'Top Match — Highly Recommended';
      stars = 5;
    } else if (overallPriorityScore >= 72) {
      tier = 'STRONG';
      tierLabel = 'Strong Match — Favorable Alignment';
      stars = 4;
    } else if (overallPriorityScore >= 58) {
      tier = 'GOOD';
      tierLabel = 'Good Match — Skill Preparation Advised';
      stars = 3;
    } else {
      tier = 'CONSIDER';
      tierLabel = 'Moderate Match — Address Gaps First';
      stars = 2;
    }

    // Generate actionable insights
    const actionableInsights: string[] = [];
    if (missingRequiredSkills.length > 0) {
      actionableInsights.push(`Prioritize mastering mandatory skills: ${missingRequiredSkills.join(', ')}.`);
    }
    if (missingPreferredSkills.length > 0) {
      actionableInsights.push(`Adding preferred skills (${missingPreferredSkills.slice(0, 2).join(', ')}) will boost your ranking above 90%.`);
    }
    if (eligibilityResult.status === 'VERIFY_REQUIRED') {
      actionableInsights.push('Contact Placement Cell to verify slight CGPA / course requirement exceptions.');
    }
    if (student.cgpa >= 8.5) {
      actionableInsights.push('High CGPA gives you an edge in initial screening rounds.');
    }

    const recommendationReason =
      matchedSkills.length >= 3
        ? `You match ${matchedSkills.length} key skills (${matchedSkills.slice(0, 3).join(', ')}) and satisfy core eligibility standards for ${opportunity.title}.`
        : `This role offers great career trajectory for ${student.targetJobRole || 'Software Engineers'}, though bridging ${missingRequiredSkills.length} key skill gaps is recommended.`;

    return {
      skillMatchScore,
      eligibilityScore,
      resumeMatchScore,
      locationMatchScore,
      experienceMatchScore,
      overallPriorityScore,
      tier,
      tierLabel,
      stars,
      matchedSkills,
      missingRequiredSkills,
      missingPreferredSkills,
      recommendationReason,
      actionableInsights,
    };
  }
}
