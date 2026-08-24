import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { OpportunityScoringService } from '@/services/scoring.service';
import { EligibilityService } from '@/services/eligibility.service';
import { SkillGapService } from '@/services/skill-gap.service';
import { AIFactory } from '@/services/ai/ai.factory';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const oppId = params.id;
    const opportunity = await db.opportunity.findUnique({
      where: { id: oppId },
      include: {
        company: true,
        skills: { include: { skill: true } },
        eligibilityRules: true,
      },
    });

    if (!opportunity) {
      return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 });
    }

    const session = await getCurrentUser();
    let studentProfile = null;
    let scoreBreakdown = null;
    let eligibility = null;
    let skillGapAnalysis = null;
    let aiExplanation = null;
    let application = null;

    if (session?.userId) {
      studentProfile = await db.studentProfile.findUnique({
        where: { userId: session.userId },
        include: {
          department: true,
          skills: { include: { skill: true } },
          projects: true,
          internships: true,
        },
      });

      if (studentProfile) {
        application = await db.application.findUnique({
          where: {
            studentProfileId_opportunityId: {
              studentProfileId: studentProfile.id,
              opportunityId: oppId,
            },
          },
        });

        const studentSkills = studentProfile.skills.map((s) => s.skill.name);
        const oppSkills = opportunity.skills.map((s) => ({
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

        eligibility = EligibilityService.evaluate(
          {
            cgpa: studentProfile.cgpa,
            backlogs: studentProfile.backlogs,
            departmentCode: studentProfile.department?.code || studentProfile.departmentName,
            graduationYear: studentProfile.graduationYear,
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

        skillGapAnalysis = SkillGapService.analyze(studentSkills, oppSkills);

        const ai = AIFactory.getProvider();
        aiExplanation = await ai.explainOpportunityMatch(
          {
            cgpa: studentProfile.cgpa,
            skills: studentSkills,
            department: studentProfile.departmentName,
          },
          {
            title: opportunity.title,
            company: opportunity.company,
            minCgpa: opportunity.minCgpa,
            skills: oppSkills,
          }
        );
      }
    }

    return NextResponse.json({
      opportunity,
      application,
      scoreBreakdown,
      eligibility,
      skillGapAnalysis,
      aiExplanation,
    });
  } catch (err: any) {
    console.error('Error fetching opportunity detail:', err);
    return NextResponse.json({ error: 'Failed to fetch opportunity detail' }, { status: 500 });
  }
}
