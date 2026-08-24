export interface StudentPeerCandidate {
  id: string;
  name: string;
  avatar?: string | null;
  departmentName?: string | null;
  degree?: string;
  graduationYear?: number;
  skills: string[];
  targetJobRole?: string | null;
  bio?: string | null;
  githubUrl?: string | null;
  publicProfileSlug: string;
}

export interface ComplementaryMatchResult {
  candidate: StudentPeerCandidate;
  overlapSkills: string[];
  complementarySkills: string[];
  compatibilityScore: number; // 0 - 100
  suggestedProjectTheme: string;
  collaborationRationale: string;
}

export class TeamMatchingService {
  public static findComplementaryPeers(
    currentStudentSkills: string[],
    candidates: StudentPeerCandidate[]
  ): ComplementaryMatchResult[] {
    const mySkillsLower = new Set(currentStudentSkills.map((s) => s.toLowerCase().trim()));

    const results: ComplementaryMatchResult[] = [];

    for (const candidate of candidates) {
      const overlapSkills: string[] = [];
      const complementarySkills: string[] = [];

      for (const sk of candidate.skills) {
        if (mySkillsLower.has(sk.toLowerCase().trim())) {
          overlapSkills.push(sk);
        } else {
          complementarySkills.push(sk);
        }
      }

      // Ideal team compatibility has some shared foundation (1-2 skills) + strong complementary breadth (2-4 unique skills)
      let score = 50;
      if (overlapSkills.length >= 1) score += 20;
      if (complementarySkills.length >= 2) score += 25;
      score = Math.min(98, score);

      let theme = 'Full Stack AI SaaS Application';
      if (complementarySkills.some((s) => s.toLowerCase().includes('hardware') || s.toLowerCase().includes('arduino') || s.toLowerCase().includes('iot'))) {
        theme = 'Smart IoT Edge Sensor & Monitoring Platform';
      } else if (complementarySkills.some((s) => s.toLowerCase().includes('machine learning') || s.toLowerCase().includes('python'))) {
        theme = 'Generative AI Analytics & Intelligence Engine';
      } else if (complementarySkills.some((s) => s.toLowerCase().includes('ui') || s.toLowerCase().includes('design') || s.toLowerCase().includes('figma'))) {
        theme = 'Next-Gen Interactive Collaborative Web Experience';
      }

      results.push({
        candidate,
        overlapSkills,
        complementarySkills,
        compatibilityScore: score,
        suggestedProjectTheme: theme,
        collaborationRationale: `Combines your background with their expertise in ${complementarySkills.slice(0, 3).join(', ') || 'specialized tools'} for balanced engineering coverage.`,
      });
    }

    return results.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
  }
}
