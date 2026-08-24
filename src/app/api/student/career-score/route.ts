import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { CareerScoreService } from '@/services/career-score.service';

export async function GET() {
  try {
    const session = await getCurrentUser();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const student = await db.studentProfile.findUnique({
      where: { userId: session.userId },
      include: {
        skills: { include: { skill: true } },
        projects: true,
        certifications: true,
        internships: true,
        interviewSessions: true,
      },
    });

    if (!student) {
      return NextResponse.json({ error: 'Student profile not found' }, { status: 404 });
    }

    const completedInterviews = student.interviewSessions.filter((s) => s.status === 'COMPLETED');
    const avgInterviewScore =
      completedInterviews.length > 0
        ? completedInterviews.reduce((acc, s) => acc + (s.overallScore || 70), 0) / completedInterviews.length
        : undefined;

    const advancedSkills = student.skills.filter(
      (s) => s.proficiency === 'ADVANCED' || s.proficiency === 'EXPERT'
    ).length;

    const calculation = CareerScoreService.calculate({
      skillsCount: student.skills.length,
      advancedSkillsCount: advancedSkills,
      projects: student.projects,
      hasResume: Boolean(student.resumeUrl || student.resumeText),
      resumeLength: student.resumeText?.length || (student.resumeUrl ? 800 : 0),
      certificationsCount: student.certifications.length,
      internshipsCount: student.internships.length,
      interviewsCompletedCount: completedInterviews.length,
      averageInterviewScore: avgInterviewScore,
      profileCompletionPercentage: student.profileCompletion || 80,
    });

    // Persist score in student profile
    await db.studentProfile.update({
      where: { id: student.id },
      data: { careerReadinessScore: calculation.totalScore },
    });

    return NextResponse.json({ careerScore: calculation });
  } catch (err: any) {
    console.error('Error computing career score:', err);
    return NextResponse.json({ error: 'Failed to compute career score' }, { status: 500 });
  }
}
