import { AIFactory } from './ai/ai.factory';
import { InterviewQuestionItem, InterviewEvaluationResult } from './ai/ai.interface';

export class InterviewPracticeService {
  public static async generateQuestions(
    jobRole: string,
    category: string = 'TECHNICAL',
    difficulty: string = 'MEDIUM',
    company?: string
  ): Promise<InterviewQuestionItem[]> {
    const ai = AIFactory.getProvider();
    return ai.generateInterviewQuestions(jobRole, category, difficulty, company);
  }

  public static async evaluateAnswer(
    question: string,
    category: string,
    studentAnswer: string,
    jobRole: string
  ): Promise<InterviewEvaluationResult> {
    const ai = AIFactory.getProvider();
    return ai.evaluateInterviewAnswer(question, category, studentAnswer, jobRole);
  }
}
