import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getCurrentUser();
    if (!session || session.role !== 'RECRUITER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const recruiter = await db.recruiterProfile.findUnique({
      where: { userId: session.userId },
      include: {
        company: {
          include: {
            opportunities: {
              include: { applications: true },
            },
          },
        },
      },
    });

    if (!recruiter) {
      return NextResponse.json({ error: 'Recruiter profile not found' }, { status: 404 });
    }

    return NextResponse.json({ recruiter, company: recruiter.company });
  } catch (err: any) {
    console.error('Error fetching recruiter company:', err);
    return NextResponse.json({ error: 'Failed to fetch company' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getCurrentUser();
    if (!session || session.role !== 'RECRUITER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const recruiter = await db.recruiterProfile.findUnique({
      where: { userId: session.userId },
    });

    if (!recruiter) {
      return NextResponse.json({ error: 'Recruiter profile not found' }, { status: 404 });
    }

    const body = await request.json();
    const { name, website, location, industry, description, logo } = body;

    const updatedCompany = await db.company.update({
      where: { id: recruiter.companyId },
      data: {
        name,
        website,
        location,
        industry,
        description,
        logo,
      },
    });

    return NextResponse.json({ company: updatedCompany });
  } catch (err: any) {
    console.error('Error updating company:', err);
    return NextResponse.json({ error: 'Failed to update company' }, { status: 500 });
  }
}
