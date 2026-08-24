export interface RoadmapPhaseTemplate {
  phase: string;
  title: string;
  description: string;
  order: number;
}

export class PersonalRoadmapService {
  public static readonly DEFAULT_PHASES: RoadmapPhaseTemplate[] = [
    {
      phase: 'CURRENT_PROFILE',
      title: 'Current Profile & Baseline Audit',
      description: 'Audit current CGPA, skills, backlog status, and define target career aspirations (SDE / Data / Cloud).',
      order: 1,
    },
    {
      phase: 'SKILL_GAPS',
      title: 'Skill Gap & Tech Stack Mapping',
      description: 'Identify delta between target company requirements and current competencies.',
      order: 2,
    },
    {
      phase: 'LEARNING',
      title: 'Core Concepts & Framework Mastery',
      description: 'Complete hands-on tutorials for missing high-priority frameworks, DSA, and System Design fundamentals.',
      order: 3,
    },
    {
      phase: 'PROJECTS',
      title: 'High-Impact Portfolio Projects',
      description: 'Develop 2-3 production-grade capstone applications with GitHub repositories and live deployments.',
      order: 4,
    },
    {
      phase: 'CERTIFICATIONS',
      title: 'Industry Certifications & Verification',
      description: 'Attain recognized credentials (e.g. AWS Certified Developer, GCP Cloud Engineer, HackerRank Gold).',
      order: 5,
    },
    {
      phase: 'INTERNSHIP',
      title: 'Internship / Open Source Contribution',
      description: 'Gain practical work experience or contribute meaningful PRs to active open-source projects.',
      order: 6,
    },
    {
      phase: 'RESUME_OPTIMIZATION',
      title: 'ATS Resume Optimization',
      description: 'Structure resume with quantifiable impact bullet points and run AI resume ATS matching against target JDs.',
      order: 7,
    },
    {
      phase: 'INTERVIEW_PREP',
      title: 'AI Mock Interviews & Coding Practice',
      description: 'Practice technical problem solving, STAR behavioral scenarios, and company-specific selection rounds.',
      order: 8,
    },
    {
      phase: 'PLACEMENT',
      title: 'Campus Applications & Placement Offers',
      description: 'Submit targeted applications, track recruitment pipeline stages, and secure dream placement offer.',
      order: 9,
    },
  ];

  public static generateInitialRoadmap(targetRole: string, targetCompany?: string) {
    return {
      targetRole: targetRole || 'Software Development Engineer',
      targetCompany: targetCompany || 'Top Tech Companies',
      milestones: this.DEFAULT_PHASES.map((p, idx) => ({
        ...p,
        status: idx === 0 ? 'COMPLETED' : idx === 1 ? 'IN_PROGRESS' : 'NOT_STARTED',
      })),
    };
  }

  public static calculateProgress(milestones: Array<{ status: string }>): number {
    if (!milestones || milestones.length === 0) return 0;
    const completed = milestones.filter((m) => m.status === 'COMPLETED').length;
    const inProgress = milestones.filter((m) => m.status === 'IN_PROGRESS').length;
    const score = (completed + inProgress * 0.5) / milestones.length;
    return Math.round(score * 100);
  }
}
