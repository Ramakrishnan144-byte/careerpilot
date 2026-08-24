import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getCurrentUser();
    if (!session || (session.role !== 'RECRUITER' && session.role !== 'ADMIN' && session.role !== 'PLACEMENT_OFFICER')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const whereClause: any = {};
    if (session.role === 'RECRUITER' && session.companyId) {
      whereClause.companyId = session.companyId;
    }

    const opportunities = await db.opportunity.findMany({
      where: whereClause,
      include: {
        company: true,
        skills: { include: { skill: true } },
        applications: {
          include: {
            studentProfile: { include: { user: true, department: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ opportunities });
  } catch (err: any) {
    console.error('Error fetching recruiter opportunities:', err);
    return NextResponse.json({ error: 'Failed to fetch opportunities' }, { status: 500 });
  }
}

export async function POST(request: Request) {
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
    const {
      title,
      jobRole,
      jobType,
      workMode,
      location,
      description,
      responsibilities,
      salaryPackage,
      minCgpa,
      maxBacklogsAllowed,
      allowedGraduationYears,
      allowedDepartments,
      applicationDeadline,
      selectionProcess,
      skillNames, // Array of string names
    } = body;

    if (!title || !salaryPackage || !applicationDeadline) {
      return NextResponse.json({ error: 'Title, salary, and application deadline are required' }, { status: 400 });
    }

    const opp = await db.opportunity.create({
      data: {
        companyId: recruiter.companyId,
        title,
        jobRole: jobRole || 'Software Engineer',
        jobType: jobType || 'FULL_TIME',
        workMode: workMode || 'HYBRID',
        location: location || 'Bangalore, India',
        description: description || 'Exciting engineering role.',
        responsibilities,
        salaryPackage,
        minCgpa: minCgpa ? parseFloat(minCgpa) : 7.0,
        maxBacklogsAllowed: maxBacklogsAllowed !== undefined ? parseInt(maxBacklogsAllowed, 10) : 0,
        allowedGraduationYears: allowedGraduationYears || '2025,2026',
        allowedDepartments: allowedDepartments || 'CSE,IT,AI_DS,ECE',
        applicationDeadline: new Date(applicationDeadline),
        selectionProcess: selectionProcess || 'Online Assessment -> Technical Rounds -> HR',
        status: 'ACTIVE',
        isDemoData: false,
      },
    });

    // Add skills
    if (Array.isArray(skillNames)) {
      for (const sName of skillNames) {
        let skill = await db.skill.findUnique({ where: { name: sName.trim() } });
        if (!skill) {
          skill = await db.skill.create({
            data: { name: sName.trim(), category: 'Technical' },
          });
        }
        await db.opportunitySkill.create({
          data: {
            opportunityId: opp.id,
            skillId: skill.id,
            isRequired: true,
            importance: 'HIGH',
          },
        });
      }
    }

    return NextResponse.json({ opportunity: opp });
  } catch (err: any) {
    console.error('Error creating opportunity:', err);
    return NextResponse.json({ error: 'Failed to create opportunity' }, { status: 500 });
  }
}
