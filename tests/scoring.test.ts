import { describe, it, expect } from 'vitest';
import { OpportunityScoringService } from '../src/services/scoring.service';

describe('OpportunityScoringService', () => {
  const student = {
    cgpa: 8.85,
    backlogs: 0,
    departmentCode: 'CSE',
    graduationYear: 2026,
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker'],
    resumeText: 'Full stack engineer with React, TypeScript, Node.js, and PostgreSQL experience.',
    locationPreference: 'Bangalore, Remote',
    workModePreference: 'HYBRID',
    projectsCount: 2,
    internshipsCount: 1,
  };

  const opportunity = {
    id: 'opp-1',
    title: 'Senior Frontend Developer',
    jobRole: 'Frontend Developer',
    location: 'Bangalore, India',
    workMode: 'HYBRID',
    minCgpa: 7.5,
    maxBacklogsAllowed: 0,
    allowedDepartments: 'CSE,IT,AI_DS,ECE',
    allowedGraduationYears: '2025,2026',
    skills: [
      { name: 'React', isRequired: true, importance: 'HIGH' },
      { name: 'TypeScript', isRequired: true, importance: 'HIGH' },
      { name: 'Node.js', isRequired: false, importance: 'MEDIUM' },
    ],
  };

  it('should calculate high priority score for a well-matched candidate', () => {
    const score = OpportunityScoringService.calculatePriorityScore(student, opportunity);
    expect(score.overallPriorityScore).toBeGreaterThanOrEqual(80);
    expect(score.tier).toBe('EXCELLENT');
    expect(score.stars).toBe(5);
    expect(score.skillMatchScore).toBe(100);
    expect(score.matchedSkills).toContain('React');
    expect(score.matchedSkills).toContain('TypeScript');
    expect(score.missingRequiredSkills.length).toBe(0);
  });

  it('should decrease priority score when key required skills are missing', () => {
    const noviceStudent = {
      ...student,
      skills: ['Python', 'SQL'],
      resumeText: 'Data enthusiast with Python and basic SQL.',
    };

    const score = OpportunityScoringService.calculatePriorityScore(noviceStudent, opportunity);
    expect(score.skillMatchScore).toBeLessThan(50);
    expect(score.missingRequiredSkills).toContain('React');
    expect(score.missingRequiredSkills).toContain('TypeScript');
    expect(score.overallPriorityScore).toBeLessThan(80);
  });
});
