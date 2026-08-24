import { GoogleGenAI } from '@google/genai';
import {
  AIProvider,
  ResumeMatchResult,
  InterviewQuestionItem,
  InterviewEvaluationResult,
  RecommendedProjectItem,
  OpportunityExplanationResult,
} from './ai.interface';
import { DeterministicMockAIProvider } from './mock-ai.provider';

export class GeminiAIProvider implements AIProvider {
  name = 'Google Gemini 2.5 Flash';
  private ai: GoogleGenAI | null = null;
  private fallback: DeterministicMockAIProvider;

  constructor(apiKey?: string) {
    this.fallback = new DeterministicMockAIProvider();
    const key = apiKey || process.env.GEMINI_API_KEY || process.env.AI_API_KEY;
    if (key) {
      this.ai = new GoogleGenAI({ apiKey: key });
    }
  }

  async matchResumeToJob(
    resumeText: string,
    jobDescription: string,
    requiredSkills: string[]
  ): Promise<ResumeMatchResult> {
    if (!this.ai) {
      return this.fallback.matchResumeToJob(resumeText, jobDescription, requiredSkills);
    }

    try {
      const prompt = `You are a professional ATS resume evaluation engine.
Analyze the following student resume against the job description and required skills.
Return ONLY valid JSON matching this schema:
{
  "matchPercentage": number (0-100),
  "matchedSkills": string[],
  "missingSkills": string[],
  "suggestedKeywords": string[],
  "strengths": string[],
  "areasForImprovement": string[],
  "summary": string
}

Required Skills: ${JSON.stringify(requiredSkills)}
Job Description:
${jobDescription.slice(0, 2000)}

Resume Content:
${resumeText.slice(0, 3000)}`;

      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return {
        matchPercentage: parsed.matchPercentage || 75,
        matchedSkills: parsed.matchedSkills || [],
        missingSkills: parsed.missingSkills || [],
        suggestedKeywords: parsed.suggestedKeywords || [],
        strengths: parsed.strengths || [],
        areasForImprovement: parsed.areasForImprovement || [],
        summary: parsed.summary || 'Resume analyzed successfully.',
      };
    } catch (err) {
      console.warn('Gemini API call failed, using deterministic fallback:', err);
      return this.fallback.matchResumeToJob(resumeText, jobDescription, requiredSkills);
    }
  }

  async generateInterviewQuestions(
    jobRole: string,
    category: string,
    difficulty: string,
    company?: string
  ): Promise<InterviewQuestionItem[]> {
    if (!this.ai) {
      return this.fallback.generateInterviewQuestions(jobRole, category, difficulty, company);
    }

    try {
      const prompt = `You are an expert technical hiring manager at ${company || 'a top tech company'}.
Generate 4 highly realistic ${category} interview questions for the position of "${jobRole}" at ${difficulty} difficulty.
Return ONLY valid JSON array with objects matching:
[
  {
    "id": string,
    "question": string,
    "category": "${category}",
    "difficulty": "${difficulty}",
    "expectedKeyPoints": string[]
  }
]`;

      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = JSON.parse(response.text || '[]');
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((item, index) => ({
          ...item,
          id: item.id || `gemini-q-${index + 1}`,
        }));
      }
      return this.fallback.generateInterviewQuestions(jobRole, category, difficulty, company);
    } catch (err) {
      console.warn('Gemini generate questions failed, using fallback:', err);
      return this.fallback.generateInterviewQuestions(jobRole, category, difficulty, company);
    }
  }

  async evaluateInterviewAnswer(
    question: string,
    category: string,
    studentAnswer: string,
    jobRole: string
  ): Promise<InterviewEvaluationResult> {
    if (!this.ai) {
      return this.fallback.evaluateInterviewAnswer(question, category, studentAnswer, jobRole);
    }

    try {
      const prompt = `You are an expert interviewer evaluating a student's answer for a ${jobRole} position.
Question: "${question}" (${category})
Student's Answer: "${studentAnswer}"

Evaluate fairly without hallucinating or judging psychological attributes.
Return ONLY valid JSON:
{
  "relevanceScore": number (0-100),
  "clarityScore": number (0-100),
  "technicalScore": number (0-100),
  "communicationScore": number (0-100),
  "totalScore": number (0-100),
  "feedback": string,
  "strengths": string[],
  "suggestions": string[]
}`;

      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return {
        relevanceScore: parsed.relevanceScore || 75,
        clarityScore: parsed.clarityScore || 75,
        technicalScore: parsed.technicalScore || 75,
        communicationScore: parsed.communicationScore || 75,
        totalScore: parsed.totalScore || 75,
        feedback: parsed.feedback || 'Good structured response.',
        strengths: parsed.strengths || [],
        suggestions: parsed.suggestions || [],
      };
    } catch (err) {
      console.warn('Gemini evaluation failed, using fallback:', err);
      return this.fallback.evaluateInterviewAnswer(question, category, studentAnswer, jobRole);
    }
  }

  async recommendProjects(skills: string[], targetRole?: string): Promise<RecommendedProjectItem[]> {
    if (!this.ai) {
      return this.fallback.recommendProjects(skills, targetRole);
    }

    try {
      const prompt = `Recommend 4 impressive, resume-worthy capstone/portfolio projects for a student aiming for "${targetRole || 'Software Development Engineer'}" with skills: ${skills.join(', ')}.
Return ONLY valid JSON array:
[
  {
    "title": string,
    "difficulty": "BEGINNER" | "INTERMEDIATE" | "ADVANCED",
    "skillsUsed": string[],
    "description": string,
    "expectedOutcome": string,
    "suggestedTechStack": string,
    "resumeValue": string,
    "learningOutcomes": string[]
  }
]`;

      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = JSON.parse(response.text || '[]');
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
      return this.fallback.recommendProjects(skills, targetRole);
    } catch (err) {
      return this.fallback.recommendProjects(skills, targetRole);
    }
  }

  async explainOpportunityMatch(
    studentData: any,
    opportunityData: any
  ): Promise<OpportunityExplanationResult> {
    if (!this.ai) {
      return this.fallback.explainOpportunityMatch(studentData, opportunityData);
    }

    try {
      const prompt = `Explain transparently why this job opportunity matches the student.
Student: ${JSON.stringify(studentData)}
Opportunity: ${JSON.stringify(opportunityData)}

Return ONLY valid JSON:
{
  "summary": string,
  "strongMatches": string[],
  "missingSkills": string[],
  "eligibilityNotes": string[],
  "recommendedActions": string[]
}`;

      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      return JSON.parse(response.text || '{}');
    } catch (err) {
      return this.fallback.explainOpportunityMatch(studentData, opportunityData);
    }
  }
}
