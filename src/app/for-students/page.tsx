import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Award,
  Layers,
  FileCheck,
  MessageSquare,
  Clock,
  Users,
  QrCode,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function ForStudentsPage() {
  const studentFeatures = [
    {
      title: '🎯 Transparent Priority Match (0-100%)',
      desc: 'No vague AI black boxes. See exact breakdown: Skill Match (35%), Eligibility (25%), Resume ATS (20%), Location (10%), and Experience (10%).',
    },
    {
      title: '📊 Deterministic Eligibility Enforcer',
      desc: 'Instant rule feedback before you apply. Verifies minimum CGPA cutoff, backlog limits, allowed departments, and graduation years with clear green/red/yellow status.',
    },
    {
      title: '🧠 Skill Gap Analyzer & Resource Hub',
      desc: 'Identifies missing skills for your dream role (e.g. SDE at Google). Recommends free & verified tutorials, projects, and learning priority.',
    },
    {
      title: '🗺️ Personal Career Roadmap',
      desc: 'Interactive 9-step progression pipeline guiding you from baseline profile audit to final placement offer with milestone check-offs.',
    },
    {
      title: '🤖 AI Resume & ATS Optimizer',
      desc: 'Upload your PDF or paste resume text to test ATS compatibility against real job descriptions. Get missing keyword alerts and formatting advice.',
    },
    {
      title: '🎤 AI Mock Interview Simulator',
      desc: 'Practice technical, system design, HR, and behavioral interview questions tailored to specific companies with instant 4-criteria feedback.',
    },
    {
      title: '🏆 Student Career Readiness Score',
      desc: 'Holistic 0-100 readiness index evaluating skills, projects, certifications, internships, and mock scores with actionable steps to reach 100.',
    },
    {
      title: '🔔 Smart Deadlines & Urgency Tracker',
      desc: 'Color-coded countdown alerts (Urgent, Reminder, Info) for drive deadlines, online assessments, and interview rounds.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <div className="text-center max-w-3xl mx-auto">
        <Badge variant="primary" size="md" className="mb-3">
          For University Students
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Supercharge Your Campus Placement Journey
        </h1>
        <p className="text-base text-slate-600 mt-4 leading-relaxed">
          CareerPilot gives you the intelligent tools, transparency, and preparation you need to land dream job and internship offers.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/login">
            <Button size="lg" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Test Drive as Alex Rivera (Student)
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {studentFeatures.map((feat) => (
          <Card key={feat.title} className="p-6">
            <h3 className="font-bold text-lg text-slate-900 mb-2">{feat.title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{feat.desc}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
