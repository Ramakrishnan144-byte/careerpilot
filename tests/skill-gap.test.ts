import { describe, it, expect } from 'vitest';
import { SkillGapService } from '../src/services/skill-gap.service';

describe('SkillGapService', () => {
  it('should identify missing skills and provide actionable learning resources', () => {
    const studentSkills = ['React', 'JavaScript', 'HTML5/CSS3'];
    const oppSkills = [
      { name: 'React', isRequired: true, importance: 'HIGH' },
      { name: 'TypeScript', isRequired: true, importance: 'HIGH' },
      { name: 'Node.js', isRequired: false, importance: 'MEDIUM' },
    ];

    const result = SkillGapService.analyze(studentSkills, oppSkills);
    expect(result.matchedCount).toBe(1);
    expect(result.missingCount).toBe(2);
    expect(result.matchedSkills).toContain('React');

    const tsGap = result.gaps.find((g) => g.skillName === 'TypeScript');
    expect(tsGap).toBeDefined();
    expect(tsGap?.isMandatory).toBe(true);
    expect(tsGap?.recommendedCourses.length).toBeGreaterThan(0);
    expect(tsGap?.recommendedProjects.length).toBeGreaterThan(0);
  });

  it('should return 100% readiness when all skills match', () => {
    const studentSkills = ['React', 'TypeScript', 'Node.js'];
    const oppSkills = ['React', 'TypeScript', 'Node.js'];

    const result = SkillGapService.analyze(studentSkills, oppSkills);
    expect(result.readinessPercentage).toBe(100);
    expect(result.missingCount).toBe(0);
    expect(result.gaps.length).toBe(0);
  });
});
