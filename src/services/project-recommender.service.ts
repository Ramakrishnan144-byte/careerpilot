import { AIFactory } from './ai/ai.factory';
import { RecommendedProjectItem } from './ai/ai.interface';

export class ProjectRecommendationService {
  public static async getRecommendations(
    skills: string[],
    targetRole?: string
  ): Promise<RecommendedProjectItem[]> {
    const ai = AIFactory.getProvider();
    return ai.recommendProjects(skills, targetRole);
  }
}
