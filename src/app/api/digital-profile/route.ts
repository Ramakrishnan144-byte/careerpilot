export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import QRCode from 'qrcode';

export async function GET() {
  try {
    const session = await getCurrentUser();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const student = await db.studentProfile.findUnique({
      where: { userId: session.userId },
      include: {
        user: true,
        department: true,
        skills: { include: { skill: true } },
        projects: true,
        certifications: true,
        internships: true,
      },
    });

    if (!student) {
      return NextResponse.json({ error: 'Student profile not found' }, { status: 404 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const publicUrl = `${appUrl}/p/${student.publicProfileSlug}`;

    const qrCodeDataUrl = await QRCode.toDataURL(publicUrl, {
      width: 320,
      margin: 2,
      color: {
        dark: '#0284c7',
        light: '#ffffff',
      },
    });

    return NextResponse.json({
      profile: student,
      publicUrl,
      qrCodeDataUrl,
    });
  } catch (err: any) {
    console.error('Digital profile error:', err);
    return NextResponse.json({ error: 'Failed to fetch digital profile' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getCurrentUser();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { profileVisibility, isDiscoverable, customSlug } = body;

    const updateData: any = {};
    if (profileVisibility) updateData.profileVisibility = profileVisibility;
    if (isDiscoverable !== undefined) updateData.isDiscoverable = Boolean(isDiscoverable);
    if (customSlug) updateData.publicProfileSlug = customSlug;

    const updated = await db.studentProfile.update({
      where: { userId: session.userId },
      data: updateData,
    });

    return NextResponse.json({ profile: updated });
  } catch (err: any) {
    console.error('Update digital profile error:', err);
    return NextResponse.json({ error: 'Failed to update visibility settings' }, { status: 500 });
  }
}
