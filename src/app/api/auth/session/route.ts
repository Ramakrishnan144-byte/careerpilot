export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getCurrentUser, getFullUserProfile } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ user: null });
    }

    const fullUser = await getFullUserProfile(session.userId);
    if (!fullUser) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        id: fullUser.id,
        name: fullUser.name,
        email: fullUser.email,
        role: fullUser.role,
        avatar: fullUser.avatar,
        studentProfile: fullUser.studentProfile,
        recruiterProfile: fullUser.recruiterProfile,
      },
    });
  } catch (err: any) {
    console.error('Session retrieval error:', err);
    return NextResponse.json({ user: null });
  }
}
