import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getCurrentUser();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const student = await db.studentProfile.findUnique({
      where: { userId: session.userId },
      include: {
        skills: {
          include: { skill: true },
        },
      },
    });

    const allSkills = await db.skill.findMany({
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({
      studentSkills: student?.skills || [],
      availableSkills: allSkills,
    });
  } catch (err: any) {
    console.error('Error fetching skills:', err);
    return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getCurrentUser();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const student = await db.studentProfile.findUnique({
      where: { userId: session.userId },
    });
    if (!student) {
      return NextResponse.json({ error: 'Student profile not found' }, { status: 404 });
    }

    const body = await request.json();
    const { skillName, category, proficiency, yearsOfExperience } = body;

    if (!skillName) {
      return NextResponse.json({ error: 'Skill name is required' }, { status: 400 });
    }

    // Find or create skill
    let skill = await db.skill.findUnique({
      where: { name: skillName.trim() },
    });

    if (!skill) {
      skill = await db.skill.create({
        data: {
          name: skillName.trim(),
          category: category || 'Technical',
        },
      });
    }

    // Upsert student skill
    const studentSkill = await db.studentSkill.upsert({
      where: {
        studentProfileId_skillId: {
          studentProfileId: student.id,
          skillId: skill.id,
        },
      },
      update: {
        proficiency: proficiency || 'INTERMEDIATE',
        yearsOfExperience: yearsOfExperience ? parseFloat(yearsOfExperience) : 1.0,
      },
      create: {
        studentProfileId: student.id,
        skillId: skill.id,
        proficiency: proficiency || 'INTERMEDIATE',
        yearsOfExperience: yearsOfExperience ? parseFloat(yearsOfExperience) : 1.0,
        isVerified: true,
      },
      include: { skill: true },
    });

    return NextResponse.json({ studentSkill });
  } catch (err: any) {
    console.error('Error adding skill:', err);
    return NextResponse.json({ error: 'Failed to add skill' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getCurrentUser();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const studentSkillId = searchParams.get('id');

    if (!studentSkillId) {
      return NextResponse.json({ error: 'Skill ID required' }, { status: 400 });
    }

    await db.studentSkill.delete({
      where: { id: studentSkillId },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Error removing skill:', err);
    return NextResponse.json({ error: 'Failed to remove skill' }, { status: 500 });
  }
}
