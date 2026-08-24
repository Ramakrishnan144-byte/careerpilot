import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { NotificationService } from '@/services/notification.service';

export async function POST(request: Request) {
  try {
    const session = await getCurrentUser();
    if (!session || (session.role !== 'PLACEMENT_OFFICER' && session.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { title, message, category, level, targetRole } = body;

    if (!title || !message) {
      return NextResponse.json({ error: 'Title and message are required' }, { status: 400 });
    }

    const result = await NotificationService.broadcastNotification(
      title,
      message,
      category || 'PLACEMENT_ALERT',
      level || 'INFO',
      targetRole
    );

    return NextResponse.json({
      success: true,
      recipientsCount: result.count,
    });
  } catch (err: any) {
    console.error('Broadcast notification error:', err);
    return NextResponse.json({ error: 'Failed to broadcast notification' }, { status: 500 });
  }
}
