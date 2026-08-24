import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { TeamMatchingService } from '@/services/team-matching.service';

export async function GET() {
  try {
    const session = await getCurrentUser();
    let currentStudentSkills: string[] = ['React', 'TypeScript', 'Node.js', 'PostgreSQL'];
    let currentStudentId = '';

    if (session?.userId) {
      const student = await db.studentProfile.findUnique({
        where: { userId: session.userId },
        include: { skills: { include: { skill: true } } },
      });
      if (student) {
        currentStudentId = student.id;
        if (student.skills.length > 0) {
          currentStudentSkills = student.skills.map((s) => s.skill.name);
        }
      }
    }

    // Fetch team listings
    const listings = await db.teamMatchListing.findMany({
      where: { status: 'OPEN' },
      include: {
        creator: {
          include: { user: true, skills: { include: { skill: true } } },
        },
        members: {
          include: { studentProfile: { include: { user: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Fetch discoverable student candidates for peer recommendations
    const otherStudents = await db.studentProfile.findMany({
      where: {
        isDiscoverable: true,
        id: currentStudentId ? { not: currentStudentId } : undefined,
      },
      include: {
        user: true,
        skills: { include: { skill: true } },
        department: true,
      },
      take: 12,
    });

    const candidates = otherStudents.map((s) => ({
      id: s.id,
      name: s.user.name,
      avatar: s.user.avatar,
      departmentName: s.department?.name || s.departmentName,
      degree: s.degree,
      graduationYear: s.graduationYear,
      skills: s.skills.map((sk) => sk.skill.name),
      targetJobRole: s.targetJobRole,
      bio: s.bio,
      githubUrl: s.githubUrl,
      publicProfileSlug: s.publicProfileSlug,
    }));

    const peerMatches = TeamMatchingService.findComplementaryPeers(currentStudentSkills, candidates);

    return NextResponse.json({
      listings,
      peerMatches,
    });
  } catch (err: any) {
    console.error('Team finder error:', err);
    return NextResponse.json({ error: 'Failed to fetch team finder data' }, { status: 500 });
  }
}
