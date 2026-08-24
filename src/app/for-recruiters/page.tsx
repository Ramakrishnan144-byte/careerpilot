import React from 'react';
import Link from 'next/link';
import { Briefcase, CheckCircle2, Users, Sparkles, Filter, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function ForRecruitersPage() {
  const recruiterFeatures = [
    {
      title: '💼 Custom Opportunity & Policy Builder',
      desc: 'Define roles, required vs preferred tech stacks, CGPA thresholds, backlog rules, compensation packages, and interview round sequences.',
    },
    {
      title: '🎯 Pre-Ranked Candidate Talent Pool',
      desc: 'View applicants automatically sorted by computed Priority Score, skill match percentage, and academic verification status.',
    },
    {
      title: '⚡ Streamlined Pipeline Transitions',
      desc: 'Advance candidate stages (Assessment, Technical Interview, Shortlisted, Selected) with single-click actions and automatic student notifications.',
    },
    {
      title: '🔍 Detailed Student Credentials',
      desc: 'Review student verified skills, GitHub repos, live deployments, certifications, and previous internships in one structured view.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <div className="text-center max-w-3xl mx-auto">
        <Badge variant="success" size="md" className="mb-3">
          For Campus Hiring Teams & Employers
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Discover & Hire Top Engineering Talent
        </h1>
        <p className="text-base text-slate-600 mt-4 leading-relaxed">
          Streamline university hiring with deterministic eligibility screening, transparent AI candidate matching, and collaborative recruitment workflows.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/login">
            <Button size="lg" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Test Drive as David Miller (Google Recruiter)
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recruiterFeatures.map((feat) => (
          <Card key={feat.title} className="p-6">
            <h3 className="font-bold text-lg text-slate-900 mb-2">{feat.title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{feat.desc}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
