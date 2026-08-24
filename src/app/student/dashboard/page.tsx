'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  TrendingUp,
  Award,
  Clock,
  Layers,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  MapPin,
  Building2,
  FileCheck,
  ChevronRight,
} from 'lucide-react';
import { StudentSidebar } from '@/components/layout/StudentSidebar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function StudentDashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [careerScore, setCareerScore] = useState<any>(null);
  const [topOpportunities, setTopOpportunities] = useState<any[]>([]);
  const [deadlines, setDeadlines] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [roadmap, setRoadmap] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const [profRes, scoreRes, oppsRes, dlRes, appsRes, roadRes] = await Promise.all([
        fetch('/api/student/profile'),
        fetch('/api/student/career-score'),
        fetch('/api/opportunities?sortBy=priority'),
        fetch('/api/student/deadlines'),
        fetch('/api/applications'),
        fetch('/api/student/roadmap'),
      ]);

      const profData = await profRes.json();
      const scoreData = await scoreRes.json();
      const oppsData = await oppsRes.json();
      const dlData = await dlRes.json();
      const appsData = await appsRes.json();
      const roadData = await roadRes.json();

      if (profData.profile) setProfile(profData.profile);
      if (scoreData.careerScore) setCareerScore(scoreData.careerScore);
      if (oppsData.opportunities) setTopOpportunities(oppsData.opportunities.slice(0, 3));
      if (dlData.deadlines) setDeadlines(dlData.deadlines.slice(0, 4));
      if (appsData.applications) setApplications(appsData.applications);
      if (roadData.roadmap) setRoadmap(roadData);
    } catch (err) {
      console.error('Error loading dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex gap-8">
        <StudentSidebar />
        <div className="flex-1 bg-white rounded-2xl p-12 border border-slate-200">
          <LoadingSpinner message="Assembling your career snapshot..." />
        </div>
      </div>
    );
  }

  const studentName = profile?.user?.name || 'Student';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
      {/* Sidebar Navigation */}
      <StudentSidebar />

      {/* Main Content Area */}
      <div className="flex-1 space-y-8 min-w-0">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-sky-600 via-sky-700 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-sky-600/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <Badge variant="outline" size="sm" className="text-sky-200 border-sky-300/40 mb-1">
              Active Placement Season 2025–26
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Good morning, {studentName} 👋
            </h1>
            <p className="text-xs sm:text-sm text-sky-100 leading-relaxed">
              Here is your career snapshot. You are currently tracking {applications.length} active application(s) and have a {careerScore?.totalScore || 78}/100 Career Readiness Score.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/student/opportunities">
              <Button size="sm" className="bg-white hover:bg-slate-100 text-sky-700 font-bold border-none">
                Browse Opportunities
              </Button>
            </Link>
          </div>
        </div>

        {/* Row 1: Readiness Score + Roadmap Snapshot */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Career Readiness Score Card */}
          <Card className="p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-sky-600" />
                  Career Readiness Score
                </h3>
                <Badge variant="primary" size="sm">
                  {careerScore?.ratingLabel.split('—')[0] || 'Job Ready'}
                </Badge>
              </div>

              <div className="py-2 flex justify-center">
                <ScoreRing
                  score={careerScore?.totalScore || 78}
                  size={125}
                  strokeWidth={10}
                  label="Readiness Index"
                  sublabel="Based on 7 verified pillars"
                />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100">
              <Link
                href="/student/career-score"
                className="text-xs text-sky-600 hover:text-sky-700 font-bold flex items-center justify-between"
              >
                <span>View Breakdown & Action Plan</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </Card>

          {/* Roadmap & Active Pipeline Snapshot */}
          <Card className="lg:col-span-2 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    Personal Career Roadmap
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Target: {profile?.targetJobRole || 'Software Development Engineer'}
                  </p>
                </div>
                <Badge variant="success" size="sm">
                  {roadmap?.progressPercentage || 45}% Complete
                </Badge>
              </div>

              <ProgressBar value={roadmap?.progressPercentage || 45} size="md" className="mb-5" />

              {/* Roadmap Milestones Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(roadmap?.roadmap?.milestones || []).slice(0, 3).map((m: any, idx: number) => (
                  <div
                    key={m.id}
                    className={`p-3 rounded-xl border text-xs ${
                      m.status === 'COMPLETED'
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                        : m.status === 'IN_PROGRESS'
                        ? 'bg-sky-50/70 border-sky-200 text-sky-900'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold">Step {idx + 1}</span>
                      <span className="text-[10px] uppercase font-bold">
                        {m.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="font-semibold truncate">{m.title}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                {roadmap?.roadmap?.completedMilestones || 3} of {roadmap?.roadmap?.totalMilestones || 9} milestones completed
              </span>
              <Link href="/student/roadmap" className="text-sky-600 hover:text-sky-700 font-bold flex items-center gap-1">
                <span>Open Roadmap</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </Card>
        </div>

        {/* Row 2: Top AI Matched Opportunities */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-sky-600" />
                Top Matched Opportunities for You
              </h2>
              <p className="text-xs text-slate-500">
                Ranked by multi-factor Priority Score algorithm matching your skills and criteria
              </p>
            </div>
            <Link href="/student/opportunities">
              <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                View All ({topOpportunities.length}+)
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {topOpportunities.map((opp) => {
              const priority = opp.scoreBreakdown?.overallPriorityScore || opp.priorityScore || 85;
              const isEligible = opp.eligibility?.isEligible ?? true;

              return (
                <Card
                  key={opp.id}
                  className="p-5 flex flex-col justify-between hover:border-sky-300 hover:shadow-md transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Badge
                          variant={priority >= 85 ? 'success' : priority >= 70 ? 'primary' : 'warning'}
                          size="sm"
                        >
                          ⭐ {priority}% Priority Match
                        </Badge>
                        <h4 className="font-bold text-sm text-slate-900 mt-2 leading-tight">
                          {opp.title}
                        </h4>
                        <p className="text-xs font-medium text-slate-600">{opp.company.name}</p>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-500 pt-1">
                      <p className="font-semibold text-slate-900">{opp.salaryPackage}</p>
                      <p>
                        {opp.location} • <span className="capitalize">{opp.workMode.toLowerCase()}</span>
                      </p>
                    </div>

                    {/* Eligibility Indicator */}
                    <div className="pt-2">
                      {isEligible ? (
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>100% Deterministic Eligible</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-1 rounded-lg border border-rose-200">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>Eligibility Criteria Pending</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      href={`/student/opportunities/${opp.id}`}
                      className="text-xs text-sky-600 hover:text-sky-700 font-bold flex items-center gap-1"
                    >
                      <span>Check Details & Match</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Row 3: Upcoming Deadlines & Active Applications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Deadlines Widget */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                Smart Deadlines & Schedule
              </h3>
              <Link href="/student/deadlines" className="text-xs text-sky-600 hover:text-sky-700 font-semibold">
                Calendar View
              </Link>
            </div>

            <div className="space-y-3">
              {deadlines.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">No imminent deadlines</p>
              ) : (
                deadlines.map((dl) => (
                  <div
                    key={dl.id}
                    className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 truncate">{dl.title}</p>
                      <p className="text-[11px] text-slate-500">
                        Due: {new Date(dl.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge
                      variant={
                        dl.urgencyLevel === 'URGENT'
                          ? 'danger'
                          : dl.urgencyLevel === 'REMINDER'
                          ? 'warning'
                          : 'secondary'
                      }
                      size="sm"
                    >
                      {dl.daysRemaining <= 0
                        ? 'Due Today'
                        : `${dl.daysRemaining}d left`}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Active Application Stages */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                Active Applications
              </h3>
              <Link href="/student/applications" className="text-xs text-sky-600 hover:text-sky-700 font-semibold">
                Kanban Tracker
              </Link>
            </div>

            <div className="space-y-3">
              {applications.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">No applications submitted yet</p>
              ) : (
                applications.slice(0, 4).map((app) => (
                  <div
                    key={app.id}
                    className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 truncate">{app.opportunity.title}</p>
                      <p className="text-[11px] text-slate-500">{app.opportunity.company.name}</p>
                    </div>
                    <Badge
                      variant={
                        app.status === 'SELECTED'
                          ? 'success'
                          : app.status === 'INTERVIEW'
                          ? 'purple'
                          : app.status === 'ASSESSMENT'
                          ? 'primary'
                          : 'secondary'
                      }
                      size="sm"
                    >
                      {app.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
