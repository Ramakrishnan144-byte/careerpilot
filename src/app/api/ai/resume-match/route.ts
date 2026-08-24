import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { ResumeAnalysisService } from '@/services/resume.service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { resumeText, jobDescription, opportunityId } = body;

    let targetJD = jobDescription;
    let requiredSkills: string[] = [];

    if (opportunityId) {
      const opp = await db.opportunity.findUnique({
        where: { id: opportunityId },
        include: {
          skills: { include: { skill: true } },
          company: true,
        },
      });

      if (opp) {
        targetJD = targetJD || `${opp.title} at ${opp.company.name}. ${opp.description} ${opp.responsibilities || ''}`;
        requiredSkills = opp.skills.map((s) => s.skill.name);
      }
    }

    if (!resumeText) {
      return NextResponse.json({ error: 'Resume text is required for analysis' }, { status: 400 });
    }

    if (requiredSkills.length === 0) {
      requiredSkills = ResumeAnalysisService.extractSkillsFromText(targetJD || '');
      if (requiredSkills.length === 0) {
        requiredSkills = ['TypeScript', 'React', 'Node.js', 'System Design', 'PostgreSQL'];
      }
    }

    const result = await ResumeAnalysisService.analyzeResumeAgainstJob(
      resumeText,
      targetJD || 'Software Development Engineer role',
      requiredSkills
    );

    return NextResponse.json({ result });
  } catch (err: any) {
    console.error('Resume matching error:', err);
    return NextResponse.json({ error: 'Failed to analyze resume' }, { status: 500 });
  }
}
