import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getCurrentUser();
    if (!session || !session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const studentProfile = await db.studentProfile.findUnique({
      where: { userId: session.userId },
      include: {
        department: true,
        skills: { include: { skill: true } },
        projects: true,
        certifications: true,
        internships: true,
      },
    });

    if (!studentProfile) {
      return NextResponse.json({ error: 'Student profile not found' }, { status: 404 });
    }

    return NextResponse.json({ profile: studentProfile });
  } catch (err: any) {
    console.error('Error fetching student profile:', err);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getCurrentUser();
    if (!session || !session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      phone,
      college,
      departmentId,
      degree,
      graduationYear,
      currentYear,
      currentSemester,
      cgpa,
      backlogs,
      bio,
      linkedInUrl,
      githubUrl,
      portfolioUrl,
      locationPreference,
      workModePreference,
      targetJobRole,
      preferredIndustries,
      expectedSalaryMin,
      expectedSalaryMax,
      isDiscoverable,
      profileVisibility,
    } = body;

    // Calculate completion score
    let completion = 50;
    if (cgpa) completion += 10;
    if (bio && bio.length > 20) completion += 10;
    if (linkedInUrl) completion += 10;
    if (githubUrl) completion += 10;
    if (targetJobRole) completion += 10;
    completion = Math.min(100, completion);

    const updated = await db.studentProfile.update({
      where: { userId: session.userId },
      data: {
        phone,
        college,
        departmentId,
        degree,
        graduationYear: graduationYear ? parseInt(graduationYear, 10) : undefined,
        currentYear: currentYear ? parseInt(currentYear, 10) : undefined,
        currentSemester: currentSemester ? parseInt(currentSemester, 10) : undefined,
        cgpa: cgpa !== undefined ? parseFloat(cgpa) : undefined,
        backlogs: backlogs !== undefined ? parseInt(backlogs, 10) : undefined,
        bio,
        linkedInUrl,
        githubUrl,
        portfolioUrl,
        locationPreference,
        workModePreference,
        targetJobRole,
        preferredIndustries,
        expectedSalaryMin: expectedSalaryMin ? parseFloat(expectedSalaryMin) : undefined,
        expectedSalaryMax: expectedSalaryMax ? parseFloat(expectedSalaryMax) : undefined,
        isDiscoverable: isDiscoverable !== undefined ? Boolean(isDiscoverable) : undefined,
        profileVisibility,
        profileCompletion: completion,
      },
      include: {
        department: true,
        skills: { include: { skill: true } },
      },
    });

    return NextResponse.json({ profile: updated });
  } catch (err: any) {
    console.error('Error updating student profile:', err);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
