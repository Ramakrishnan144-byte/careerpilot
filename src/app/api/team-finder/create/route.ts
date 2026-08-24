export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

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
      return NextResponse.json({ error: 'Student profile required' }, { status: 400 });
    }

    const body = await request.json();
    const { title, description, neededRoles, techStack } = body;

    if (!title || !description || !neededRoles) {
      return NextResponse.json({ error: 'Title, description, and needed roles are required' }, { status: 400 });
    }

    const listing = await db.teamMatchListing.create({
      data: {
        creatorId: student.id,
        title,
        description,
        neededRoles,
        techStack,
        status: 'OPEN',
        members: {
          create: {
            studentProfileId: student.id,
            role: 'Project Lead',
            status: 'CONFIRMED',
          },
        },
      },
      include: {
        creator: { include: { user: true } },
        members: { include: { studentProfile: { include: { user: true } } } },
      },
    });

    return NextResponse.json({ listing });
  } catch (err: any) {
    console.error('Error creating team listing:', err);
    return NextResponse.json({ error: 'Failed to create team listing' }, { status: 500 });
  }
}
