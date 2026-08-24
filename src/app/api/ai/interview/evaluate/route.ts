export const dynamic = 'force-dynamic';
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
    const { sessionId, question, category, studentAnswer, jobRole } = body;

    if (!question || !studentAnswer) {
      return NextResponse.json({ error: 'Question and answer are required' }, { status: 400 });
    }

    const evaluation = await InterviewPracticeService.evaluateAnswer(
      question,
      category || 'TECHNICAL',
      studentAnswer,
      jobRole || 'Software Development Engineer'
    );

    if (sessionId) {
      await db.interviewQuestion.create({
        data: {
          sessionId,
          question,
          category: category || 'TECHNICAL',
          studentAnswer,
          relevanceScore: evaluation.relevanceScore,
          clarityScore: evaluation.clarityScore,
          technicalScore: evaluation.technicalScore,
          communicationScore: evaluation.communicationScore,
          totalScore: evaluation.totalScore,
          feedback: evaluation.feedback,
          suggestions: evaluation.suggestions.join('; '),
        },
      });

      // Update session overall score
      const allQuestions = await db.interviewQuestion.findMany({
        where: { sessionId },
      });

      const avgScore =
        allQuestions.reduce((acc, q) => acc + (q.totalScore || 75), 0) / (allQuestions.length || 1);

      await db.interviewSession.update({
        where: { id: sessionId },
        data: {
          overallScore: Math.round(avgScore),
          status: allQuestions.length >= 3 ? 'COMPLETED' : 'IN_PROGRESS',
        },
      });
    }

    return NextResponse.json({ evaluation });
  } catch (err: any) {
    console.error('Error evaluating interview answer:', err);
    return NextResponse.json({ error: 'Failed to evaluate answer' }, { status: 500 });
  }
}
