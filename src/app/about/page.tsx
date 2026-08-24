import React from 'react';
import { Compass, ShieldCheck, Cpu, Code2, Users2, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3">
        <Badge variant="primary" size="md">About CareerPilot</Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Next-Generation Campus Career Intelligence
        </h1>
        <p className="text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
          CareerPilot was architected to bridge the gap between academic learning and modern industry recruitment through deterministic standards and intelligent AI assistance.
        </p>
      </div>

      <div className="space-y-6 text-sm text-slate-600 leading-relaxed">
        <Card className="p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-sky-600" />
            Our Philosophy: Determinism Meets Transparent AI
          </h3>
          <p>
            Unlike black-box AI platforms that make opaque judgements about candidate eligibility, CareerPilot follows a strict separation of concerns:
          </p>
          <ul className="list-disc list-inside mt-3 space-y-1.5 text-slate-700">
            <li><strong>Deterministic Eligibility:</strong> Academic criteria (CGPA, allowed departments, backlog limits, graduation batches) are calculated using strict mathematical business rules.</li>
            <li><strong>Transparent Priority Scoring:</strong> Multi-factor weighted models clearly explain why an opportunity is recommended and how the score was derived.</li>
            <li><strong>Constructive AI Assistance:</strong> AI is utilized where it excels — ATS resume semantic analysis, role-specific mock interview Q&A simulation, and personalized project recommendations.</li>
          </ul>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            Production-Grade & Decoupled Architecture
          </h3>
          <p>
            Built using modern full-stack technologies (Next.js App Router, Prisma ORM, TypeScript, Tailwind CSS) with a modular provider design that operates 100% out of the box with zero external dependencies, while effortlessly scaling to cloud PostgreSQL and Google Gemini GenAI in production.
          </p>
        </Card>
      </div>
    </div>
  );
}
