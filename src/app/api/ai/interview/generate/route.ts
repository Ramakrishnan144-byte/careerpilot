import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { InterviewPracticeService } from '@/services/interview.service';

export async function POST(request: Request) {
  try {
    const session = await getCurrentUser();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { jobRole, category, difficulty, companyName } = body;

    const questions = await InterviewPracticeService.generateQuestions(
      jobRole || 'Software Development Engineer',
      category || 'TECHNICAL',
      difficulty || 'MEDIUM',
      companyName
    );

    const student = await db.studentProfile.findUnique({
      where: { userId: session.userId },
    });

    let sessionRecord = null;
    if (student) {
      sessionRecord = await db.interviewSession.create({
        data: {
          studentProfileId: student.id,
          companyName: companyName || null,
          jobRole: jobRole || 'Software Engineer',
          category: category || 'TECHNICAL',
          difficulty: difficulty || 'MEDIUM',
          status: 'IN_PROGRESS',
        },
      });
    }

    return NextResponse.json({
      sessionId: sessionRecord?.id,
      questions,
    });
  } catch (err: any) {
    console.error('Error generating interview questions:', err);
    return NextResponse.json({ error: 'Failed to generate questions' }, { status: 500 });
  }
}
