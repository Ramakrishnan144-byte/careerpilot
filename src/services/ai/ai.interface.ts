export interface ResumeMatchResult {
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
  suggestedKeywords: string[];
  strengths: string[];
  areasForImprovement: string[];
  summary: string;
}

export interface InterviewQuestionItem {
  id: string;
  question: string;
  category: 'TECHNICAL' | 'HR' | 'BEHAVIORAL' | 'SITUATIONAL' | 'ROLE_SPECIFIC';
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  expectedKeyPoints: string[];
}

export interface InterviewEvaluationResult {
  relevanceScore: number; // 0-100
  clarityScore: number; // 0-100
  technicalScore: number; // 0-100
  communicationScore: number; // 0-100
  totalScore: number; // 0-100
  feedback: string;
  strengths: string[];
  suggestions: string[];
}

export interface RecommendedProjectItem {
  title: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  skillsUsed: string[];
  description: string;
  expectedOutcome: string;
  suggestedTechStack: string;
  resumeValue: string;
  learningOutcomes: string[];
}

export interface OpportunityExplanationResult {
  summary: string;
  strongMatches: string[];
  missingSkills: string[];
  eligibilityNotes: string[];
  recommendedActions: string[];
}

export interface AIProvider {
  name: string;
  matchResumeToJob(resumeText: string, jobDescription: string, requiredSkills: string[]): Promise<ResumeMatchResult>;
  generateInterviewQuestions(jobRole: string, category: string, difficulty: string, company?: string): Promise<InterviewQuestionItem[]>;
  evaluateInterviewAnswer(question: string, category: string, studentAnswer: string, jobRole: string): Promise<InterviewEvaluationResult>;
  recommendProjects(skills: string[], targetRole?: string): Promise<RecommendedProjectItem[]>;
  explainOpportunityMatch(studentData: any, opportunityData: any): Promise<OpportunityExplanationResult>;
}
