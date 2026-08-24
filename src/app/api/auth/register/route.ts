import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, signToken, AUTH_COOKIE_NAME } from '@/lib/auth';
import { slugify } from '@/lib/utils';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, role, departmentCode, college, graduationYear, companyName, designation } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required.' }, { status: 400 });
    }

    const existingUser = await db.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 400 });
    }

    const userRole = role === 'RECRUITER' ? 'RECRUITER' : 'STUDENT';
    const passwordHash = await hashPassword(password);

    const newUser = await db.user.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        passwordHash,
        role: userRole,
        isVerified: true,
      },
    });

    let studentProfileId: string | undefined;
    let recruiterProfileId: string | undefined;
    let companyId: string | undefined;

    if (userRole === 'STUDENT') {
      let dept = null;
      if (departmentCode) {
        dept = await db.department.findUnique({ where: { code: departmentCode } });
      }

      const slugBase = slugify(name);
      const uniqueSlug = `${slugBase}-${Date.now().toString().slice(-4)}`;

      const studentProfile = await prismaStudentCreate(newUser.id, {
        college: college || 'Institute of Technology',
        departmentId: dept?.id,
        departmentName: dept?.name || 'Engineering',
        graduationYear: graduationYear ? parseInt(graduationYear, 10) : 2026,
        publicProfileSlug: uniqueSlug,
      });
      studentProfileId = studentProfile.id;
    } else if (userRole === 'RECRUITER') {
      let company = await db.company.findFirst({
        where: { name: { contains: companyName || 'Demo Enterprise' } },
      });

      if (!company) {
        company = await db.company.create({
          data: {
            name: companyName || 'Demo Enterprise Inc.',
            slug: slugify(companyName || 'Demo Enterprise') + `-${Date.now().toString().slice(-4)}`,
            isDemoData: true,
          },
        });
      }
      companyId = company.id;

      const recruiterProfile = await db.recruiterProfile.create({
        data: {
          userId: newUser.id,
          companyId: company.id,
          designation: designation || 'Talent Acquisition Partner',
        },
      });
      recruiterProfileId = recruiterProfile.id;
    }

    const token = signToken({
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      studentProfileId,
      recruiterProfileId,
      companyId,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        studentProfileId,
        recruiterProfileId,
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
    console.error('Registration error:', err);
    return NextResponse.json({ error: 'Registration failed.' }, { status: 500 });
  }
}

async function prismaStudentCreate(userId: string, data: any) {
  return db.studentProfile.create({
    data: {
      userId,
      ...data,
    },
  });
}
