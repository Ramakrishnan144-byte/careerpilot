import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { DeadlineService, ProcessedDeadline } from '@/services/deadline.service';

export async function GET() {
  try {
    const session = await getCurrentUser();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const student = await db.studentProfile.findUnique({
      where: { userId: session.userId },
      include: {
        applications: {
          include: { opportunity: { include: { company: true } } },
        },
        certifications: true,
      },
    });

    const activeOpportunities = await db.opportunity.findMany({
      where: { status: 'ACTIVE' },
      include: { company: true },
      take: 10,
    });

    const deadlines: ProcessedDeadline[] = [];

    // 1. Application specific deadlines
    if (student) {
      for (const app of student.applications) {
        if (app.interviewDate) {
          deadlines.push(
            DeadlineService.processDeadline(
              `app-interview-${app.id}`,
              `${app.opportunity.company.name} Technical Interview`,
              'INTERVIEW',
              app.interviewDate,
              '/student/applications'
            )
          );
        }
        if (app.assessmentDate) {
          deadlines.push(
            DeadlineService.processDeadline(
              `app-assess-${app.id}`,
              `${app.opportunity.company.name} Online Assessment`,
              'ASSESSMENT',
              app.assessmentDate,
              '/student/applications'
            )
          );
        }
      }

      // 2. Certification expirations
      for (const cert of student.certifications) {
        if (cert.expiryDate) {
          deadlines.push(
            DeadlineService.processDeadline(
              `cert-exp-${cert.id}`,
              `${cert.name} Expiration`,
              'CERTIFICATE',
              cert.expiryDate,
              '/student/profile'
            )
          );
        }
      }
    }

    // 3. Open opportunity application deadlines
    for (const opp of activeOpportunities) {
      deadlines.push(
        DeadlineService.processDeadline(
          `opp-dl-${opp.id}`,
          `${opp.company.name} — ${opp.title} Application Deadline`,
          'OPPORTUNITY',
          opp.applicationDeadline,
          `/student/opportunities`
        )
      );
    }

    const sortedDeadlines = DeadlineService.sortByUrgency(deadlines);

    return NextResponse.json({ deadlines: sortedDeadlines });
  } catch (err: any) {
    console.error('Error fetching deadlines:', err);
    return NextResponse.json({ error: 'Failed to fetch deadlines' }, { status: 500 });
  }
}
