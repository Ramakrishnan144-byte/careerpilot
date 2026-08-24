'use client';

import React from 'react';
import Link from 'next/link';
import {
  Compass,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Award,
  Users,
  QrCode,
  ArrowRight,
  ShieldCheck,
  Building2,
  GraduationCap,
  Layers,
  FileCheck,
  ChevronRight,
  MessageSquare,
  Clock,
  Briefcase,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

export default function HomePage() {
  const steps = [
    { title: 'Student Profile', desc: 'Academics, CGPA, verified skills & portfolio projects' },
    { title: 'AI Matching', desc: 'Transparent multi-factor Priority Score (0-100%)' },
    { title: 'Skill Gap', desc: 'Targeted missing skills & curated learning milestones' },
    { title: 'Career Roadmap', desc: 'Interactive visual progression from day 1 to placement' },
    { title: 'Applications', desc: 'Real-time Kanban status tracking & deadline reminders' },
    { title: 'Placement', desc: 'Dream job offers from top campus recruiters' },
  ];

  const features = [
    {
      icon: Sparkles,
      title: 'AI Opportunity Matching & Priority Score',
      desc: 'Deterministic rules ensure you never miss CGPA or department criteria, while transparent AI algorithms score your skill alignment.',
      badge: 'Transparent AI',
      color: 'text-sky-600 bg-sky-50',
    },
    {
      icon: TrendingUp,
      title: 'Skill Gap Analyzer & Learning Hub',
      desc: 'Compare your skills directly against company requirements. Get targeted courses, project ideas, and estimated study priorities.',
      badge: 'Actionable',
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      icon: FileCheck,
      title: 'AI Resume & ATS Optimization',
      desc: 'Scan your resume against live job descriptions. Discover missing keywords, formatting fixes, and ATS compatibility percentages.',
      badge: 'ATS Score',
      color: 'text-indigo-600 bg-indigo-50',
    },
    {
      icon: MessageSquare,
      title: 'AI Mock Interview Simulator',
      desc: 'Practice role-specific technical, behavioral, and HR questions with instant multi-rubric feedback on relevance and technical depth.',
      badge: 'Live Simulator',
      color: 'text-rose-600 bg-rose-50',
    },
    {
      icon: Award,
      title: 'Career Readiness Score (0-100)',
      desc: 'A unified 7-dimension readiness index tracking skills, projects, certifications, internships, and interview preparations.',
      badge: 'Readiness Meter',
      color: 'text-amber-600 bg-amber-50',
    },
    {
      icon: Users,
      title: 'Complementary Team / Peer Finder',
      desc: 'Find classmates with complementary skills for capstone projects and hackathons with privacy-first opt-in discoverability.',
      badge: 'Collaborative',
      color: 'text-purple-600 bg-purple-50',
    },
    {
      icon: QrCode,
      title: 'Verified Digital Profile & QR Codes',
      desc: 'Generate a public, tamper-resistant portfolio with QR code cards for recruiters, career fairs, and LinkedIn headlines.',
      badge: 'Shareable',
      color: 'text-teal-600 bg-teal-50',
    },
    {
      icon: Building2,
      title: 'Institutional Placement Command Center',
      desc: 'University placement cells get end-to-end drive management, real-time department analytics, salary distribution, and audits.',
      badge: 'For Colleges',
      color: 'text-blue-600 bg-blue-50',
    },
  ];

  return (
    <div className="space-y-24 pb-16 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Background glow subtle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-sky-200/40 blur-[120px] -z-10 rounded-full pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-50 border border-sky-200/80 text-sky-700 text-xs font-semibold mb-6 shadow-xs animate-fadeIn">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Gen Placement & Career Intelligence Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] max-w-4xl mx-auto">
          Your Skills. Your Opportunities.{' '}
          <span className="bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">
            Your Career.
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
          CareerPilot unifies opportunity matching, deterministic eligibility checks, skill gap analytics, AI mock interviews, and university placement operations into one seamless experience.
        </p>

        {/* Call to Actions */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/login">
            <Button size="lg" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Launch Interactive Demo
            </Button>
          </Link>
          <Link href="/for-students">
            <Button size="lg" variant="outline">
              Explore Student Features
            </Button>
          </Link>
        </div>

        {/* Live Metrics Ribbon */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">10+</p>
            <p className="text-xs font-medium text-slate-500 mt-0.5">Top Tech Recruiters</p>
          </div>
          <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <p className="text-2xl sm:text-3xl font-extrabold text-sky-600">20+</p>
            <p className="text-xs font-medium text-slate-500 mt-0.5">Active Campus Drives</p>
          </div>
          <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600">100%</p>
            <p className="text-xs font-medium text-slate-500 mt-0.5">Deterministic Eligibility</p>
          </div>
          <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <p className="text-2xl sm:text-3xl font-extrabold text-indigo-600">52 LPA</p>
            <p className="text-xs font-medium text-slate-500 mt-0.5">Highest Package</p>
          </div>
        </div>
      </section>

      {/* Visual Workflow Steps */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="primary" size="md" className="mb-3">
            Placement Lifecycle
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            From First Year to Placement Day
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            A continuous, transparent intelligence pipeline guiding every step of your campus recruitment journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          {steps.map((step, idx) => (
            <div
              key={step.title}
              className="relative bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="w-7 h-7 rounded-xl bg-sky-100 text-sky-700 font-bold text-xs flex items-center justify-center mb-3">
                  0{idx + 1}
                </div>
                <h4 className="font-bold text-sm text-slate-900 leading-tight">{step.title}</h4>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Grid of Core Capabilities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge variant="purple" size="md" className="mb-3">
            Enterprise Architecture
          </Badge>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Engineered for Modern Universities & High-Scale Hiring
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            No mock dashboards or fake placeholders. Every calculation is grounded in database logic and transparent algorithms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <Card key={feat.title} className="flex flex-col justify-between hover:border-sky-300">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${feat.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <Badge variant="outline" size="sm">
                      {feat.badge}
                    </Badge>
                  </div>
                  <h3 className="font-bold text-base text-slate-900 leading-snug">{feat.title}</h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">{feat.desc}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Stakeholder Segments */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* For Students */}
          <div className="bg-gradient-to-b from-sky-50 to-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center mb-5 shadow-md shadow-sky-600/20">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">For Students</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Take full ownership of your career trajectory with transparent Priority Scores, skill gap maps, AI mock interviews, and automated application tracking.
              </p>
              <ul className="mt-6 space-y-2.5 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-600" />
                  <span>Transparent 0-100% Opportunity Matching</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-600" />
                  <span>Real-time Eligibility Warnings (CGPA / Backlogs)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-600" />
                  <span>Verified QR Profile for recruiters</span>
                </li>
              </ul>
            </div>
            <div className="mt-8">
              <Link href="/for-students">
                <Button variant="outline" size="sm" className="w-full">
                  Student Solutions
                </Button>
              </Link>
            </div>
          </div>

          {/* For Colleges */}
          <div className="bg-gradient-to-b from-purple-50 to-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center mb-5 shadow-md shadow-purple-600/20">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">For Colleges & TPOs</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Streamline university-wide placement drives, automate eligibility rule enforcement, broadcast real-time alerts, and monitor department-wise analytics.
              </p>
              <ul className="mt-6 space-y-2.5 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600" />
                  <span>Automated Branch & CGPA Filtering</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600" />
                  <span>Salary Distribution & Skill Demand Charts</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600" />
                  <span>Campus-wide Broadcast Alerts</span>
                </li>
              </ul>
            </div>
            <div className="mt-8">
              <Link href="/for-colleges">
                <Button variant="outline" size="sm" className="w-full">
                  College Solutions
                </Button>
              </Link>
            </div>
          </div>

          {/* For Recruiters */}
          <div className="bg-gradient-to-b from-emerald-50 to-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mb-5 shadow-md shadow-emerald-600/20">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">For Recruiters</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Post opportunities with exact eligibility policies, view ranked candidate talent pools with pre-calculated match scores, and advance stages seamlessly.
              </p>
              <ul className="mt-6 space-y-2.5 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Custom Deterministic Eligibility Rules</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Ranked Candidate Talent Pipeline</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Instant Shortlisting & Feedback Notes</span>
                </li>
              </ul>
            </div>
            <div className="mt-8">
              <Link href="/for-recruiters">
                <Button variant="outline" size="sm" className="w-full">
                  Recruiter Solutions
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-sky-600 to-indigo-700 rounded-3xl p-8 sm:p-14 text-white shadow-xl shadow-sky-600/20 relative overflow-hidden text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight max-w-2xl mx-auto">
            Ready to Elevate Campus Career Intelligence?
          </h2>
          <p className="text-sky-100 text-sm sm:text-base max-w-xl mx-auto mt-4 leading-relaxed">
            Test drive CareerPilot immediately with pre-configured student, recruiter, and institutional demo accounts.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login">
              <Button size="lg" className="bg-white hover:bg-slate-100 text-sky-700 border-none">
                Start Test Drive Now
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="text-white border-white/40 hover:bg-white/10">
                Create New Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
