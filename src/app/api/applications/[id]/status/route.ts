import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { NotificationService } from '@/services/notification.service';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const applicationId = params.id;
    const session = await getCurrentUser();
    if (!session || (session.role !== 'RECRUITER' && session.role !== 'PLACEMENT_OFFICER' && session.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized to modify application status' }, { status: 403 });
    }

    const body = await request.json();
    const { status, comment, interviewDate, assessmentDate } = body;

    const existingApp = await db.application.findUnique({
      where: { id: applicationId },
      include: {
        opportunity: { include: { company: true } },
        studentProfile: { include: { user: true } },
      },
    });

    if (!existingApp) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    const updated = await db.application.update({
      where: { id: applicationId },
      data: {
        status: status || existingApp.status,
        interviewDate: interviewDate ? new Date(interviewDate) : existingApp.interviewDate,
        assessmentDate: assessmentDate ? new Date(assessmentDate) : existingApp.assessmentDate,
        recruiterFeedback: comment || existingApp.recruiterFeedback,
        statusHistory: {
          create: {
            fromStatus: existingApp.status,
            toStatus: status || existingApp.status,
            comment: comment || `Status updated to ${status}`,
            changedBy: session.name,
          },
        },
      },
      include: {
        opportunity: { include: { company: true } },
        statusHistory: { orderBy: { createdAt: 'desc' } },
      },
    });

    // Notify the student of status update
    await NotificationService.createNotification({
      userId: existingApp.studentProfile.userId,
      title: `📣 Application Update: ${existingApp.opportunity.company.name}`,
      message: `Your application status for ${existingApp.opportunity.title} is now: ${status}.`,
      category: status === 'INTERVIEW' ? 'INTERVIEW' : 'APPLICATION',
      level: status === 'SELECTED' || status === 'INTERVIEW' ? 'URGENT' : 'INFO',
      actionUrl: '/student/applications',
    });

    return NextResponse.json({ application: updated });
  } catch (err: any) {
    console.error('Error updating application status:', err);
    return NextResponse.json({ error: 'Failed to update application status' }, { status: 500 });
  }
}
