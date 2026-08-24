export interface CareerScoreBreakdown {
  totalScore: number; // 0 - 100
  ratingTier: 'BEGINNER' | 'DEVELOPING' | 'JOB_READY' | 'TOP_TALENT';
  ratingLabel: string;
  categoryScores: {
    skills: { score: number; max: number; percentage: number; label: string };
    projects: { score: number; max: number; percentage: number; label: string };
    resume: { score: number; max: number; percentage: number; label: string };
    certifications: { score: number; max: number; percentage: number; label: string };
    internships: { score: number; max: number; percentage: number; label: string };
    interviewPrep: { score: number; max: number; percentage: number; label: string };
    profileCompleteness: { score: number; max: number; percentage: number; label: string };
  };
  actionPlan: Array<{
    category: string;
    pointsGain: number;
    action: string;
    completed: boolean;
  }>;
}

export interface StudentScoreData {
  skillsCount: number;
  advancedSkillsCount: number;
  projects: Array<{ title: string; githubUrl?: string | null; liveUrl?: string | null; difficulty?: string | null }>;
  hasResume: boolean;
  resumeLength?: number;
  certificationsCount: number;
  internshipsCount: number;
  interviewsCompletedCount: number;
  averageInterviewScore?: number;
  profileCompletionPercentage: number;
}

export class CareerScoreService {
  public static calculate(data: StudentScoreData): CareerScoreBreakdown {
    // 1. Skills (Max 20)
    let skillsScore = Math.min(14, data.skillsCount * 2.5);
    skillsScore += Math.min(6, data.advancedSkillsCount * 2.0);
    skillsScore = Math.min(20, Math.round(skillsScore));

    // 2. Projects (Max 20)
    let projectsScore = 0;
    for (const proj of data.projects) {
      let pPoints = proj.difficulty === 'ADVANCED' ? 8 : proj.difficulty === 'INTERMEDIATE' ? 6 : 4;
      if (proj.githubUrl) pPoints += 2;
      if (proj.liveUrl) pPoints += 2;
      projectsScore += pPoints;
    }
    projectsScore = Math.min(20, Math.round(projectsScore));

    // 3. Resume (Max 15)
    let resumeScore = 0;
    if (data.hasResume) {
      resumeScore = 10;
      if (data.resumeLength && data.resumeLength > 500) {
        resumeScore += 5;
      }
    }
    resumeScore = Math.min(15, resumeScore);

    // 4. Certifications (Max 10)
    const certsScore = Math.min(10, data.certificationsCount * 5);

    // 5. Internships (Max 15)
    const internshipsScore = Math.min(15, data.internshipsCount * 8 + (data.internshipsCount > 0 ? 7 : 0));

    // 6. Interview Prep (Max 10)
    let interviewPrepScore = Math.min(5, data.interviewsCompletedCount * 2.5);
    if (data.averageInterviewScore && data.averageInterviewScore >= 75) {
      interviewPrepScore += Math.min(5, (data.averageInterviewScore / 100) * 5);
    }
    interviewPrepScore = Math.min(10, Math.round(interviewPrepScore));

    // 7. Profile Completeness (Max 10)
    const profileCompletenessScore = Math.min(10, Math.round((data.profileCompletionPercentage / 100) * 10));

    // Total Score
    const totalScore = Math.min(
      100,
      skillsScore +
        projectsScore +
        resumeScore +
        certsScore +
        internshipsScore +
        interviewPrepScore +
        profileCompletenessScore
    );

    // Rating Tier
    let ratingTier: 'BEGINNER' | 'DEVELOPING' | 'JOB_READY' | 'TOP_TALENT' = 'DEVELOPING';
    let ratingLabel = 'Developing Readiness';

    if (totalScore >= 85) {
      ratingTier = 'TOP_TALENT';
      ratingLabel = 'Top Talent — Exceptional Placement Readiness';
    } else if (totalScore >= 70) {
      ratingTier = 'JOB_READY';
      ratingLabel = 'Job Ready — Highly Competitive Profile';
    } else if (totalScore >= 50) {
      ratingTier = 'DEVELOPING';
      ratingLabel = 'Developing — Approaching Industry Standard';
    } else {
      ratingTier = 'BEGINNER';
      ratingLabel = 'Foundational — Action Required to Elevate';
    }

    // Action Plan for Improvement
    const actionPlan: Array<{ category: string; pointsGain: number; action: string; completed: boolean }> = [];

    if (skillsScore < 20) {
      actionPlan.push({
        category: 'Skills',
        pointsGain: 20 - skillsScore,
        action: `Add and verify ${Math.max(1, 6 - data.skillsCount)} more technical skills to achieve 20/20 in Skills.`,
        completed: false,
      });
    }

    if (projectsScore < 20) {
      actionPlan.push({
        category: 'Projects',
        pointsGain: 20 - projectsScore,
        action: 'Publish a full-stack or systems project with GitHub and live demo links to earn full project points.',
        completed: false,
      });
    }

    if (resumeScore < 15) {
      actionPlan.push({
        category: 'Resume',
        pointsGain: 15 - resumeScore,
        action: 'Upload an updated PDF resume and run the AI ATS Analyzer to optimize keyword density.',
        completed: false,
      });
    }

    if (certsScore < 10) {
      actionPlan.push({
        category: 'Certifications',
        pointsGain: 10 - certsScore,
        action: 'Add a recognized industry cloud or domain certification (AWS, Google Cloud, Meta).',
        completed: false,
      });
    }

    if (internshipsScore < 15) {
      actionPlan.push({
        category: 'Experience',
        pointsGain: 15 - internshipsScore,
        action: 'Add previous internship, research assistantship, or open-source contributor experience.',
        completed: false,
      });
    }

    if (interviewPrepScore < 10) {
      actionPlan.push({
        category: 'Interview Prep',
        pointsGain: 10 - interviewPrepScore,
        action: 'Complete 2 AI Mock Interview sessions with a target score of 80% or above.',
        completed: false,
      });
    }

    if (profileCompletenessScore < 10) {
      actionPlan.push({
        category: 'Profile',
        pointsGain: 10 - profileCompletenessScore,
        action: 'Fill in LinkedIn, GitHub portfolio URLs and work preferences to reach 100% profile completion.',
        completed: false,
      });
    }

    return {
      totalScore,
      ratingTier,
      ratingLabel,
      categoryScores: {
        skills: { score: skillsScore, max: 20, percentage: Math.round((skillsScore / 20) * 100), label: 'Skills & Proficiency' },
        projects: { score: projectsScore, max: 20, percentage: Math.round((projectsScore / 20) * 100), label: 'Projects & Demos' },
        resume: { score: resumeScore, max: 15, percentage: Math.round((resumeScore / 15) * 100), label: 'Resume ATS Quality' },
        certifications: { score: certsScore, max: 10, percentage: Math.round((certsScore / 10) * 100), label: 'Certifications' },
        internships: { score: internshipsScore, max: 15, percentage: Math.round((internshipsScore / 15) * 100), label: 'Internships & Experience' },
        interviewPrep: { score: interviewPrepScore, max: 10, percentage: Math.round((interviewPrepScore / 10) * 100), label: 'Mock Interview Practice' },
        profileCompleteness: { score: profileCompletenessScore, max: 10, percentage: Math.round((profileCompletenessScore / 10) * 100), label: 'Profile Completeness' },
      },
      actionPlan,
    };
  }
}
