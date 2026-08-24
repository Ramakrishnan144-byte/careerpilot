import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { signToken, AUTH_COOKIE_NAME } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { roleType } = body; // 'STUDENT_ALEX', 'STUDENT_SARAH', 'STUDENT_PRIYA', 'RECRUITER_GOOGLE', 'RECRUITER_TCS', 'ADMIN'

    let targetEmail = 'alex.student@careerpilot.edu';
    if (roleType === 'STUDENT_SARAH') targetEmail = 'sarah.data@careerpilot.edu';
    if (roleType === 'STUDENT_PRIYA') targetEmail = 'priya.ece@careerpilot.edu';
    if (roleType === 'RECRUITER_GOOGLE') targetEmail = 'talent@google.demo';
    if (roleType === 'RECRUITER_TCS') targetEmail = 'hiring@tcs.demo';
    if (roleType === 'ADMIN') targetEmail = 'placement.dean@careerpilot.edu';

    const user = await db.user.findUnique({
      where: { email: targetEmail },
      include: {
        studentProfile: true,
        recruiterProfile: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Demo account not found. Run db seed.' }, { status: 404 });
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      studentProfileId: user.studentProfile?.id,
      recruiterProfileId: user.recruiterProfile?.id,
      companyId: user.recruiterProfile?.companyId,
    });

    let redirectUrl = '/student/dashboard';
    if (user.role === 'RECRUITER') redirectUrl = '/recruiter/dashboard';
    if (user.role === 'PLACEMENT_OFFICER' || user.role === 'ADMIN') redirectUrl = '/admin/dashboard';

    const response = NextResponse.json({
      success: true,
      redirectUrl,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        studentProfileId: user.studentProfile?.id,
        recruiterProfileId: user.recruiterProfile?.id,
      },
    });

    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err: any) {
    console.error('Demo login error:', err);
    return NextResponse.json({ error: 'Demo login failed.' }, { status: 500 });
  }
}
