import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { StorageService } from '@/services/storage.service';
import { ResumeAnalysisService } from '@/services/resume.service';

export async function POST(request: Request) {
  try {
    const session = await getCurrentUser();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { fileName, resumeText, fileContentBase64 } = body;

    if (!resumeText && !fileContentBase64) {
      return NextResponse.json({ error: 'Resume text or file is required' }, { status: 400 });
    }

    const uploadRes = await StorageService.uploadResume(
      fileName || 'student_resume.pdf',
      fileContentBase64 || resumeText || ''
    );

    const extractedSkills = ResumeAnalysisService.extractSkillsFromText(resumeText || '');

    const updatedProfile = await db.studentProfile.update({
      where: { userId: session.userId },
      data: {
        resumeUrl: uploadRes.url,
        resumeFileName: fileName || 'student_resume.pdf',
        resumeText: resumeText || undefined,
      },
    });

    return NextResponse.json({
      success: true,
      resumeUrl: uploadRes.url,
      extractedSkills,
      profile: updatedProfile,
    });
  } catch (err: any) {
    console.error('Resume upload error:', err);
    return NextResponse.json({ error: 'Failed to upload resume' }, { status: 500 });
  }
}
