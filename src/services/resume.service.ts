import { AIFactory } from './ai/ai.factory';
import { ResumeMatchResult } from './ai/ai.interface';

export class ResumeAnalysisService {
  public static async analyzeResumeAgainstJob(
    resumeText: string,
    jobDescription: string,
    requiredSkills: string[]
  ): Promise<ResumeMatchResult> {
    const aiProvider = AIFactory.getProvider();
    return aiProvider.matchResumeToJob(resumeText, jobDescription, requiredSkills);
  }

  public static extractSkillsFromText(text: string): string[] {
    const commonSkills = [
      'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Python', 'Java', 'C++',
      'SQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure',
      'Git', 'CI/CD', 'Linux', 'REST API', 'GraphQL', 'Machine Learning', 'Deep Learning',
      'System Design', 'Data Structures', 'Algorithms', 'Tailwind CSS', 'HTML5', 'CSS3',
      'Express.js', 'FastAPI', 'Spring Boot', 'Kafka', 'Microservices'
    ];

    const textLower = text.toLowerCase();
    return commonSkills.filter((s) => textLower.includes(s.toLowerCase()));
  }
}
