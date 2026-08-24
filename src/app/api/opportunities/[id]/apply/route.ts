export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { OpportunityScoringService } from '@/services/scoring.service';
import { EligibilityService } from '@/services/eligibility.service';
import { NotificationService } from '@/services/notification.service';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const oppId = params.id;
    const session = await getCurrentUser();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Please log in to apply' }, { status: 401 });
    }

    const student = await db.studentProfile.findUnique({
      where: { userId: session.userId },
      include: {
        department: true,
        skills: { include: { skill: true } },
        projects: true,
        internships: true,
      },
    });

    if (!student) {
      return NextResponse.json({ error: 'Student profile required' }, { status: 400 });
    }

    const opportunity = await db.opportunity.findUnique({
      where: { id: oppId },
      include: {
        company: true,
        skills: { include: { skill: true } },
      },
    });

    if (!opportunity) {
      return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 });
    }

    // Check if already applied
    const existing = await db.application.findUnique({
      where: {
        studentProfileId_opportunityId: {
          studentProfileId: student.id,
          opportunityId: oppId,
        },
      },
    });

    if (existing) {
      return NextResponse.json({ error: 'You have already applied to this opportunity' }, { status: 400 });
    }

    const studentSkills = student.skills.map((s) => s.skill.name);
    const oppSkills = opportunity.skills.map((s) => ({
      name: s.skill.name,
      isRequired: s.isRequired,
      importance: s.importance,
    }));

    const score = OpportunityScoringService.calculatePriorityScore(
      {
        cgpa: student.cgpa,
        backlogs: student.backlogs,
        departmentCode: student.department?.code || student.departmentName,
        graduationYear: student.graduationYear,
        skills: studentSkills,
        resumeText: student.resumeText,
        locationPreference: student.locationPreference,
        workModePreference: student.workModePreference,
        projectsCount: student.projects.length,
        internshipsCount: student.internships.length,
      },
      {
        id: opportunity.id,
        title: opportunity.title,
        jobRole: opportunity.jobRole,
        location: opportunity.location,
        workMode: opportunity.workMode,
        minCgpa: opportunity.minCgpa,
        maxBacklogsAllowed: opportunity.maxBacklogsAllowed,
        allowedDepartments: opportunity.allowedDepartments,
        allowedGraduationYears: opportunity.allowedGraduationYears,
        skills: oppSkills,
      }
    );

    const eligibility = EligibilityService.evaluate(
      {
        cgpa: student.cgpa,
        backlogs: student.backlogs,
        departmentCode: student.department?.code || student.departmentName,
        graduationYear: student.graduationYear,
        skills: studentSkills,
      },
      {
        minCgpa: opportunity.minCgpa,
        maxBacklogsAllowed: opportunity.maxBacklogsAllowed,
        allowedDepartments: opportunity.allowedDepartments,
        allowedGraduationYears: opportunity.allowedGraduationYears,
        requiredSkills: opportunity.skills.filter((s) => s.isRequired).map((s) => s.skill.name),
      }
    );

    // Create Application
    const application = await db.application.create({
      data: {
        studentProfileId: student.id,
        opportunityId: opportunity.id,
        status: 'APPLIED',
        priorityScore: score.overallPriorityScore,
        skillMatchPercentage: score.skillMatchScore,
        eligibilityStatus: eligibility.status,
        notes: 'Applied via CareerPilot Portal.',
        statusHistory: {
          create: {
            fromStatus: null,
            toStatus: 'APPLIED',
            comment: 'Application submitted successfully',
          },
        },
      },
      include: {
        opportunity: { include: { company: true } },
      },
    });

    // Create In-App Notification
    await NotificationService.createNotification({
      userId: session.userId,
      title: `✅ Application Submitted: ${opportunity.company.name}`,
      message: `Your application for ${opportunity.title} was submitted with a ${score.overallPriorityScore}% match score.`,
      category: 'APPLICATION',
      level: 'INFO',
      actionUrl: '/student/applications',
    });

    return NextResponse.json({
      success: true,
      application,
      score,
      eligibility,
    });
  } catch (err: any) {
    console.error('Application submission error:', err);
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
  }
}
