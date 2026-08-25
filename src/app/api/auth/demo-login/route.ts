export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { signToken, AUTH_COOKIE_NAME, getAuthCookieOptions } from '@/lib/auth';

const DEMO_EMAIL_MAP: Record<string, string> = {
  STUDENT_ALEX: 'alex.student@careerpilot.edu',
  STUDENT_SARAH: 'sarah.data@careerpilot.edu',
  STUDENT_PRIYA: 'priya.ece@careerpilot.edu',
  RECRUITER_GOOGLE: 'talent@google.demo',
  RECRUITER_TCS: 'hiring@tcs.demo',
  ADMIN: 'placement.dean@careerpilot.edu',
};

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { roleType } = body;

    const targetEmail = roleType ? DEMO_EMAIL_MAP[roleType] : null;

    if (!targetEmail) {
      return NextResponse.json(
        { error: `Invalid roleType '${roleType}'. Valid options: ${Object.keys(DEMO_EMAIL_MAP).join(', ')}` },
        { status: 400 }
      );
    }

    // Check if database URL is configured
    if (!process.env.DATABASE_URL) {
      console.error('[AUTH_ERROR] DATABASE_URL environment variable is missing.');
      return NextResponse.json(
        { error: 'Database connection is not configured. Please set DATABASE_URL in Vercel environment variables.' },
        { status: 500 }
      );
    }

    let user;
    try {
      user = await db.user.findUnique({
        where: { email: targetEmail },
        include: {
          studentProfile: true,
          recruiterProfile: true,
        },
      });
    } catch (dbErr: any) {
      console.error('[DEMO_LOGIN_DB_ERROR]', dbErr);
      if (dbErr?.code === 'P1001' || dbErr?.message?.includes("Can't reach database server")) {
        return NextResponse.json(
          { error: 'Cannot connect to PostgreSQL database. Please verify your DATABASE_URL credentials and network access.' },
          { status: 503 }
        );
      }
      if (dbErr?.code === 'P2021' || dbErr?.message?.includes('does not exist')) {
        return NextResponse.json(
          { error: 'Database tables are not initialized. Please run "npx prisma db push" on your database.' },
          { status: 500 }
        );
      }
      return NextResponse.json(
        { error: 'Database query failed. Please check server logs and database connectivity.' },
        { status: 500 }
      );
    }

    if (!user) {
      console.warn(`[DEMO_LOGIN_MISSING_USER] Demo user ${targetEmail} not found in database.`);
      return NextResponse.json(
        {
          error: `Demo account (${targetEmail}) was not found. Please run database seeding ("npm run prisma:seed") to populate demo records.`,
        },
        { status: 404 }
      );
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

    response.cookies.set(AUTH_COOKIE_NAME, token, getAuthCookieOptions());

    return response;
  } catch (err: any) {
    console.error('[DEMO_LOGIN_UNHANDLED_ERROR]', err);
    return NextResponse.json(
      { error: err?.message || 'An unexpected error occurred during demo login.' },
      { status: 500 }
    );
  }
}
