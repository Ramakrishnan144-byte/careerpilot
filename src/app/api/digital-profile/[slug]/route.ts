import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import QRCode from 'qrcode';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;

    const student = await db.studentProfile.findUnique({
      where: { publicProfileSlug: slug },
      include: {
        user: {
          select: {
            name: true,
            avatar: true,
            email: true,
            isVerified: true,
          },
        },
        department: true,
        skills: { include: { skill: true } },
        projects: true,
        certifications: true,
        internships: true,
      },
    });

    if (!student) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    if (student.profileVisibility === 'PRIVATE') {
      return NextResponse.json({ error: 'This profile is set to private by the student' }, { status: 403 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const publicUrl = `${appUrl}/p/${student.publicProfileSlug}`;

    const qrCodeDataUrl = await QRCode.toDataURL(publicUrl, {
      width: 250,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    });

    return NextResponse.json({
      profile: student,
      qrCodeDataUrl,
      publicUrl,
    });
  } catch (err: any) {
    console.error('Error fetching public student profile:', err);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}
