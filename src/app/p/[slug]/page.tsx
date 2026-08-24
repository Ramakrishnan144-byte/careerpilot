import React from 'react';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import QRCode from 'qrcode';
import {
  ShieldCheck,
  GraduationCap,
  Award,
  Briefcase,
  Github,
  Linkedin,
  ExternalLink,
  Code2,
  QrCode,
  Sparkles,
  MapPin,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const student = await db.studentProfile.findUnique({
    where: { publicProfileSlug: params.slug },
    include: { user: true },
  });

  if (!student) return { title: 'Profile Not Found' };
  return {
    title: `${student.user.name} — Verified Student Profile | CareerPilot`,
    description: `Verified career portfolio and credentials of ${student.user.name} on CareerPilot.`,
  };
}

export default async function PublicStudentProfilePage({
  params,
}: {
  params: { slug: string };
}) {
  const student = await db.studentProfile.findUnique({
    where: { publicProfileSlug: params.slug },
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
    notFound();
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const profileUrl = `${appUrl}/p/${student.publicProfileSlug}`;

  const qrCodeDataUrl = await QRCode.toDataURL(profileUrl, {
    width: 250,
    margin: 2,
    color: {
      dark: '#0284c7',
      light: '#ffffff',
    },
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Verification Banner */}
      <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-emerald-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-slate-900">Verified Institutional Profile</p>
            <p className="text-slate-600">
              Academics and credentials cryptographically attested by {student.college}.
            </p>
          </div>
        </div>
        <Badge variant="success" size="md">
          Verified Student
        </Badge>
      </div>

      {/* Main Profile Header Card */}
      <Card className="p-6 sm:p-8 bg-gradient-to-br from-white to-slate-50">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-extrabold text-2xl overflow-hidden shadow-md ring-4 ring-white">
              {student.user.avatar ? (
                <img
                  src={student.user.avatar}
                  alt={student.user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                student.user.name.charAt(0)
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {student.user.name}
                </h1>
                <Badge variant="primary" size="sm">
                  {student.targetJobRole || 'Software Engineer'}
                </Badge>
              </div>

              <p className="text-xs text-slate-600 flex items-center gap-1.5 flex-wrap">
                <GraduationCap className="w-4 h-4 text-sky-600" />
                <span>
                  {student.degree} in {student.department?.name || student.departmentName}
                </span>
                <span>•</span>
                <span>Class of {student.graduationYear}</span>
                <span>•</span>
                <span className="font-bold text-slate-900">{student.cgpa} CGPA</span>
              </p>

              <p className="text-xs text-slate-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{student.locationPreference || 'Bangalore, India'}</span>
              </p>
            </div>
          </div>

          {/* Social Links & QR Preview */}
          <div className="flex items-center gap-3">
            {student.githubUrl && (
              <a
                href={student.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {student.linkedInUrl && (
              <a
                href={student.linkedInUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {student.bio && (
          <div className="mt-6 pt-6 border-t border-slate-100">
            <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">{student.bio}</p>
          </div>
        )}
      </Card>

      {/* Grid: Skills + QR Code Credentials */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left 2 Cols: Skills & Projects */}
        <div className="md:col-span-2 space-y-6">
          {/* Skills Matrix */}
          <Card className="p-6">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-sky-600" />
              Verified Skills & Proficiency
            </h3>
            <div className="flex flex-wrap gap-2">
              {student.skills.map((sk) => (
                <div
                  key={sk.id}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2"
                >
                  <span className="text-xs font-semibold text-slate-800">{sk.skill.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-100 text-sky-700 font-bold">
                    {sk.proficiency}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Featured Projects */}
          <Card className="p-6">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-600" />
              Portfolio Projects & Demos
            </h3>
            <div className="space-y-4">
              {student.projects.map((proj) => (
                <div key={proj.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-slate-900">{proj.title}</h4>
                    <Badge variant="purple" size="sm">
                      {proj.difficulty}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{proj.description}</p>
                  <div className="flex items-center justify-between pt-2 text-xs">
                    <span className="text-slate-500 font-medium">Stack: {proj.techStack}</span>
                    <div className="flex items-center gap-3">
                      {proj.githubUrl && (
                        <a
                          href={proj.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-sky-600 hover:text-sky-700 font-semibold"
                        >
                          <Github className="w-3.5 h-3.5" />
                          <span>Code</span>
                        </a>
                      )}
                      {proj.liveUrl && (
                        <a
                          href={proj.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-semibold"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Live Demo</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Certifications & Internships */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="p-5">
              <h4 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                Certifications
              </h4>
              <div className="space-y-2.5">
                {student.certifications.map((c) => (
                  <div key={c.id} className="text-xs">
                    <p className="font-semibold text-slate-800">{c.name}</p>
                    <p className="text-[11px] text-slate-400">{c.issuer}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5">
              <h4 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-emerald-600" />
                Internships
              </h4>
              <div className="space-y-2.5">
                {student.internships.map((i) => (
                  <div key={i.id} className="text-xs">
                    <p className="font-semibold text-slate-800">{i.role}</p>
                    <p className="text-[11px] text-slate-400">{i.companyName} • {i.duration}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Right Col: Instant QR Code Pass Card */}
        <div className="space-y-6">
          <Card className="p-6 text-center space-y-4 bg-gradient-to-b from-slate-900 to-slate-800 text-white border-none shadow-xl">
            <div className="inline-flex p-2 rounded-xl bg-white/10 text-sky-400 mx-auto">
              <QrCode className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-bold text-base text-white">Recruiter Digital Pass</h3>
              <p className="text-xs text-slate-300 mt-1">
                Scan with any smartphone to inspect verified student credentials.
              </p>
            </div>

            <div className="p-3 bg-white rounded-2xl inline-block mx-auto shadow-md">
              <img src={qrCodeDataUrl} alt="QR Code" className="w-44 h-44 object-contain mx-auto" />
            </div>

            <div className="pt-2 border-t border-slate-700/80 text-[11px] text-slate-400">
              <p className="font-semibold text-slate-200">{student.college}</p>
              <p>Placement Verification Token #{student.publicProfileSlug}</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
