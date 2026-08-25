export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyPassword, signToken, AUTH_COOKIE_NAME, getAuthCookieOptions } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    let user;
    try {
      user = await db.user.findUnique({
        where: { email: normalizedEmail },
        include: {
          studentProfile: true,
          recruiterProfile: true,
        },
      });
    } catch (dbErr: any) {
      console.error('[LOGIN_DB_ERROR]', dbErr);
      if (dbErr?.code === 'P1001' || dbErr?.message?.includes("Can't reach database server")) {
        return NextResponse.json(
          { error: 'Cannot connect to database. Please verify DATABASE_URL in environment settings.' },
          { status: 503 }
        );
      }
      return NextResponse.json(
        { error: 'Database error occurred during login. Please try again.' },
        { status: 500 }
      );
    }

    if (!user) {
      console.warn(`[LOGIN_FAILED] User not found: ${normalizedEmail}`);
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    const isMatch = await verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      console.warn(`[LOGIN_FAILED] Password mismatch for: ${normalizedEmail}`);
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
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

    const response = NextResponse.json({
      success: true,
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
    console.error('[LOGIN_UNHANDLED_ERROR]', err);
    return NextResponse.json({ error: 'Authentication failed. Please check your credentials and try again.' }, { status: 500 });
  }
}
