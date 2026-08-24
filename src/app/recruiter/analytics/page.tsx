'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Award, ShieldCheck } from 'lucide-react';
import { RecruiterSidebar } from '@/components/layout/RecruiterSidebar';
import { Card } from '@/components/ui/Card';
import { ApplicationFunnelChart } from '@/components/charts/ApplicationFunnelChart';
import { SkillDemandBar } from '@/components/charts/SkillDemandBar';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function RecruiterAnalyticsPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/metrics')
      .then((r) => r.json())
      .then((data) => setMetrics(data))
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
        <RecruiterSidebar />
        <div className="flex-1 bg-white rounded-2xl p-12 border border-slate-200">
          <LoadingSpinner message="Calculating recruitment conversion analytics..." />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
      <RecruiterSidebar />

      <div className="flex-1 space-y-6 min-w-0">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-sky-600" />
            Recruitment Funnel & Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Stage conversion rates and applicant skill density across campus hiring drives.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 space-y-4">
            <h3 className="font-bold text-sm text-slate-900">Application Pipeline Funnel</h3>
            <ApplicationFunnelChart data={metrics?.applicationFunnel || []} />
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="font-bold text-sm text-slate-900">Top Candidate Skill Density</h3>
            <SkillDemandBar data={metrics?.topSkills || []} />
          </Card>
        </div>
      </div>
    </div>
  );
}
