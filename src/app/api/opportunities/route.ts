import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { OpportunityScoringService } from '@/services/scoring.service';
import { EligibilityService } from '@/services/eligibility.service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('q') || '';
    const department = searchParams.get('department') || '';
    const workMode = searchParams.get('workMode') || '';
    const jobType = searchParams.get('jobType') || '';
    const eligibleOnly = searchParams.get('eligibleOnly') === 'true';
    const sortBy = searchParams.get('sortBy') || 'priority'; // 'priority', 'deadline', 'salary', 'newest'

    const session = await getCurrentUser();
    let studentProfile = null;
    if (session?.userId) {
      studentProfile = await db.studentProfile.findUnique({
        where: { userId: session.userId },
        include: {
          department: true,
          skills: { include: { skill: true } },
          projects: true,
          internships: true,
          applications: true,
        },
      });
    }

    const whereClause: any = {
      status: 'ACTIVE',
    };

    if (workMode && workMode !== 'ALL') {
      whereClause.workMode = workMode;
    }
    if (jobType && jobType !== 'ALL') {
      whereClause.jobType = jobType;
    }
    if (search) {
      whereClause.OR = [
        { title: { contains: search } },
        { jobRole: { contains: search } },
        { description: { contains: search } },
        { company: { name: { contains: search } } },
      ];
    }

    const rawOpportunities = await db.opportunity.findMany({
      where: whereClause,
      include: {
        company: true,
        skills: {
          include: { skill: true },
        },
        applications: studentProfile ? { where: { studentProfileId: studentProfile.id } } : false,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Score each opportunity if student profile is available
    const scoredList = rawOpportunities.map((opp) => {
      let scoreBreakdown = null;
      let eligibility = null;
      const isApplied = studentProfile ? opp.applications?.length > 0 : false;
      const appliedStatus = isApplied ? opp.applications[0]?.status : null;

      if (studentProfile) {
        const studentSkills = studentProfile.skills.map((s) => s.skill.name);
        const oppSkills = opp.skills.map((s) => ({
          name: s.skill.name,
          isRequired: s.isRequired,
          importance: s.importance,
        }));

        scoreBreakdown = OpportunityScoringService.calculatePriorityScore(
          {
            cgpa: studentProfile.cgpa,
            backlogs: studentProfile.backlogs,
            departmentCode: studentProfile.department?.code || studentProfile.departmentName,
            graduationYear: studentProfile.graduationYear,
            skills: studentSkills,
            resumeText: studentProfile.resumeText,
            locationPreference: studentProfile.locationPreference,
            workModePreference: studentProfile.workModePreference,
            projectsCount: studentProfile.projects.length,
            internshipsCount: studentProfile.internships.length,
          },
          {
            id: opp.id,
            title: opp.title,
            jobRole: opp.jobRole,
            location: opp.location,
            workMode: opp.workMode,
            minCgpa: opp.minCgpa,
            maxBacklogsAllowed: opp.maxBacklogsAllowed,
            allowedDepartments: opp.allowedDepartments,
            allowedGraduationYears: opp.allowedGraduationYears,
            skills: oppSkills,
          }
        );

        eligibility = EligibilityService.evaluate(
          {
            cgpa: studentProfile.cgpa,
            backlogs: studentProfile.backlogs,
            departmentCode: studentProfile.department?.code || studentProfile.departmentName,
            graduationYear: studentProfile.graduationYear,
            skills: studentSkills,
          },
          {
            minCgpa: opp.minCgpa,
            maxBacklogsAllowed: opp.maxBacklogsAllowed,
            allowedDepartments: opp.allowedDepartments,
            allowedGraduationYears: opp.allowedGraduationYears,
            requiredSkills: opp.skills.filter((s) => s.isRequired).map((s) => s.skill.name),
          }
        );
      }

      return {
        ...opp,
        isApplied,
        appliedStatus,
        scoreBreakdown,
        eligibility,
        priorityScore: scoreBreakdown?.overallPriorityScore || 75,
      };
    });

    let filtered = scoredList;
    if (eligibleOnly && studentProfile) {
      filtered = filtered.filter((o) => o.eligibility?.isEligible);
    }
    if (department && department !== 'ALL') {
      filtered = filtered.filter(
        (o) => o.allowedDepartments === 'ALL' || o.allowedDepartments.includes(department)
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      if (sortBy === 'priority') {
        return (b.priorityScore || 0) - (a.priorityScore || 0);
      } else if (sortBy === 'deadline') {
        return new Date(a.applicationDeadline).getTime() - new Date(b.applicationDeadline).getTime();
      } else if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });

    return NextResponse.json({ opportunities: filtered });
  } catch (err: any) {
    console.error('Error fetching opportunities:', err);
    return NextResponse.json({ error: 'Failed to fetch opportunities' }, { status: 500 });
  }
}
