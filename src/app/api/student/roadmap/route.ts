import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { PersonalRoadmapService } from '@/services/roadmap.service';

export async function GET() {
  try {
    const session = await getCurrentUser();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const student = await db.studentProfile.findUnique({
      where: { userId: session.userId },
      include: {
        careerRoadmaps: {
          include: {
            milestones: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    let roadmap = student.careerRoadmaps[0];

    // If student doesn't have a roadmap yet, create one
    if (!roadmap) {
      const initial = PersonalRoadmapService.generateInitialRoadmap(
        student.targetJobRole || 'Software Development Engineer',
        'Top Tech & Cloud Leaders'
      );

      roadmap = await db.careerRoadmap.create({
        data: {
          studentProfileId: student.id,
          targetRole: initial.targetRole,
          targetCompany: initial.targetCompany,
          totalMilestones: initial.milestones.length,
          completedMilestones: 1,
          milestones: {
            create: initial.milestones.map((m) => ({
              phase: m.phase,
              title: m.title,
              description: m.description,
              status: m.status,
              order: m.order,
            })),
          },
        },
        include: {
          milestones: {
            orderBy: { order: 'asc' },
          },
        },
      });
    }

    const progressPercentage = PersonalRoadmapService.calculateProgress(roadmap.milestones);

    return NextResponse.json({
      roadmap,
      progressPercentage,
    });
  } catch (err: any) {
    console.error('Error fetching roadmap:', err);
    return NextResponse.json({ error: 'Failed to fetch roadmap' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getCurrentUser();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { milestoneId, status } = body;

    if (!milestoneId || !status) {
      return NextResponse.json({ error: 'Milestone ID and status required' }, { status: 400 });
    }

    const updated = await db.roadmapMilestone.update({
      where: { id: milestoneId },
      data: { status },
      include: { roadmap: { include: { milestones: true } } },
    });

    const completedCount = updated.roadmap.milestones.filter((m) => m.status === 'COMPLETED').length;
    await db.careerRoadmap.update({
      where: { id: updated.roadmapId },
      data: { completedMilestones: completedCount },
    });

    const progressPercentage = PersonalRoadmapService.calculateProgress(updated.roadmap.milestones);

    return NextResponse.json({
      milestone: updated,
      progressPercentage,
    });
  } catch (err: any) {
    console.error('Error updating milestone:', err);
    return NextResponse.json({ error: 'Failed to update milestone' }, { status: 500 });
  }
}
