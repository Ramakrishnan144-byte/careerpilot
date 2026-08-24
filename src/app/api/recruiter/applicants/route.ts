import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getCurrentUser();
    if (!session || (session.role !== 'RECRUITER' && session.role !== 'ADMIN' && session.role !== 'PLACEMENT_OFFICER')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const opportunityId = searchParams.get('opportunityId');
    const statusFilter = searchParams.get('status');

    const whereClause: any = {};

    if (session.role === 'RECRUITER' && session.companyId) {
      whereClause.opportunity = { companyId: session.companyId };
    }

    if (opportunityId) {
      whereClause.opportunityId = opportunityId;
    }

    if (statusFilter && statusFilter !== 'ALL') {
      whereClause.status = statusFilter;
    }

    const applications = await db.application.findMany({
      where: whereClause,
      include: {
        studentProfile: {
          include: {
            user: true,
            department: true,
            skills: { include: { skill: true } },
            projects: true,
            certifications: true,
            internships: true,
          },
        },
        opportunity: {
          include: { company: true },
        },
        statusHistory: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { priorityScore: 'desc' },
    });

    return NextResponse.json({ applications });
  } catch (err: any) {
    console.error('Error fetching applicants:', err);
    return NextResponse.json({ error: 'Failed to fetch applicants' }, { status: 500 });
  }
}
