export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { NotificationService } from '@/services/notification.service';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const listingId = params.id;
    const session = await getCurrentUser();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const student = await db.studentProfile.findUnique({
      where: { userId: session.userId },
      include: { user: true },
    });

    if (!student) {
      return NextResponse.json({ error: 'Student profile required' }, { status: 400 });
    }

    const listing = await db.teamMatchListing.findUnique({
      where: { id: listingId },
      include: { creator: { include: { user: true } }, members: true },
    });

    if (!listing) {
      return NextResponse.json({ error: 'Team listing not found' }, { status: 404 });
    }

    const alreadyMember = listing.members.some((m) => m.studentProfileId === student.id);
    if (alreadyMember) {
      return NextResponse.json({ error: 'You are already a member of this team' }, { status: 400 });
    }

    const body = await request.json();
    const role = body.role || 'Contributor';

    const member = await db.teamMatchMember.create({
      data: {
        listingId,
        studentProfileId: student.id,
        role,
        status: 'CONFIRMED',
      },
    });

    // Notify project creator
    await NotificationService.createNotification({
      userId: listing.creator.userId,
      title: `🤝 New Teammate: ${student.user.name}`,
      message: `${student.user.name} joined your project "${listing.title}" as ${role}.`,
      category: 'APPLICATION',
      level: 'INFO',
      actionUrl: '/student/team-finder',
    });

    return NextResponse.json({ success: true, member });
  } catch (err: any) {
    console.error('Error joining team:', err);
    return NextResponse.json({ error: 'Failed to join team' }, { status: 500 });
  }
}
