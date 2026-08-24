import { describe, it, expect } from 'vitest';
import { CareerScoreService } from '../src/services/career-score.service';

describe('CareerScoreService', () => {
  it('should compute score with category breakdown and action plan', () => {
    const studentData = {
      skillsCount: 8,
      advancedSkillsCount: 4,
      projects: [
        { title: 'Project 1', githubUrl: 'https://github.com/demo/p1', liveUrl: 'https://p1.dev', difficulty: 'ADVANCED' },
        { title: 'Project 2', githubUrl: 'https://github.com/demo/p2', difficulty: 'INTERMEDIATE' },
      ],
      hasResume: true,
      resumeLength: 1200,
      certificationsCount: 2,
      internshipsCount: 1,
      interviewsCompletedCount: 3,
      averageInterviewScore: 85,
      profileCompletionPercentage: 95,
    };

    const breakdown = CareerScoreService.calculate(studentData);
    expect(breakdown.totalScore).toBeGreaterThanOrEqual(75);
    expect(breakdown.ratingTier).toBe('TOP_TALENT');
    expect(breakdown.categoryScores.skills.score).toBeLessThanOrEqual(20);
    expect(breakdown.categoryScores.projects.score).toBeLessThanOrEqual(20);
    expect(breakdown.categoryScores.resume.score).toBeLessThanOrEqual(15);
    expect(breakdown.categoryScores.certifications.score).toBe(10);
    expect(breakdown.categoryScores.internships.score).toBe(15);
  });
});
