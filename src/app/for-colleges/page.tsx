import React from 'react';
import Link from 'next/link';
import { Building2, CheckCircle2, BarChart3, Users, ShieldAlert, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function ForCollegesPage() {
  const collegeFeatures = [
    {
      title: '🏛️ Placement Cell Command Center',
      desc: 'Centralized institutional control over company campus drives, application rosters, shortlists, and student offers.',
    },
    {
      title: '📈 Department-Wise Analytics & Charts',
      desc: 'Visual placement tracking across CSE, IT, ECE, AI/DS, ME, and MBA with offer conversion rates and average CTC analytics.',
    },
    {
      title: '🔒 Automated Eligibility Enforcement',
      desc: 'Never worry about disqualified candidates slipping through. Strict server-side verification of CGPA and backlog restrictions.',
    },
    {
      title: '📢 Campus Broadcast Notifications',
      desc: 'Instant platform alerts sent to all students or specific departments for drive deadlines and assessment announcements.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <div className="text-center max-w-3xl mx-auto">
        <Badge variant="purple" size="md" className="mb-3">
          For Universities & Placement Cells (TPO)
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Modern Institutional Placement Intelligence
        </h1>
        <p className="text-base text-slate-600 mt-4 leading-relaxed">
          Empower Training & Placement Officers (TPOs) and university deans with automated campus drive management, real-time analytics, and transparent hiring metrics.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/login">
            <Button size="lg" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Test Drive as Dr. Robert Vance (Placement Dean)
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {collegeFeatures.map((feat) => (
          <Card key={feat.title} className="p-6">
            <h3 className="font-bold text-lg text-slate-900 mb-2">{feat.title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{feat.desc}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
