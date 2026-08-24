import { AIProvider } from './ai.interface';
import { DeterministicMockAIProvider } from './mock-ai.provider';
import { GeminiAIProvider } from './gemini-ai.provider';

export class AIFactory {
  private static instance: AIProvider;

  public static getProvider(): AIProvider {
    if (!this.instance) {
      const apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;
      if (apiKey) {
        this.instance = new GeminiAIProvider(apiKey);
      } else {
        this.instance = new DeterministicMockAIProvider();
      }
    }
    return this.instance;
  }
}
