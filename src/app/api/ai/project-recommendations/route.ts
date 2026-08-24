import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { ProjectRecommendationService } from '@/services/project-recommender.service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const difficultyFilter = searchParams.get('difficulty'); // BEGINNER, INTERMEDIATE, ADVANCED

    const session = await getCurrentUser();
    let skills: string[] = ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker'];
    let targetRole = 'Software Development Engineer';

    if (session?.userId) {
      const student = await db.studentProfile.findUnique({
        where: { userId: session.userId },
        include: { skills: { include: { skill: true } } },
      });

      if (student) {
        if (student.skills.length > 0) {
          skills = student.skills.map((s) => s.skill.name);
        }
        if (student.targetJobRole) {
          targetRole = student.targetJobRole;
        }
      }
    }

    let projects = await ProjectRecommendationService.getRecommendations(skills, targetRole);

    if (difficultyFilter && difficultyFilter !== 'ALL') {
      projects = projects.filter((p) => p.difficulty === difficultyFilter);
    }

    return NextResponse.json({ projects, skillsUsed: skills, targetRole });
  } catch (err: any) {
    console.error('Error fetching project recommendations:', err);
    return NextResponse.json({ error: 'Failed to get recommendations' }, { status: 500 });
  }
}
