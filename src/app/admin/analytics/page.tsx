'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Award, DollarSign, Users, Sparkles } from 'lucide-react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { Card } from '@/components/ui/Card';
import { PlacementRateChart } from '@/components/charts/PlacementRateChart';
import { SkillDemandBar } from '@/components/charts/SkillDemandBar';
import { SalaryDistributionChart } from '@/components/charts/SalaryDistributionChart';
import { ApplicationFunnelChart } from '@/components/charts/ApplicationFunnelChart';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function AdminAnalyticsPage() {
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
        <AdminSidebar />
        <div className="flex-1 bg-white rounded-2xl p-12 border border-slate-200">
          <LoadingSpinner message="Aggregating university-wide placement analytics..." />
        </div>
      </div>
    );
  }

  const { departmentStats, topSkills, salaryDistribution, applicationFunnel } = metrics || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
      <AdminSidebar />

      <div className="flex-1 space-y-6 min-w-0">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-purple-600" />
            University Placement Analytics & Trends
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Interactive multi-dimensional reports on hiring conversion, compensation tiers, and skill demand.
          </p>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 space-y-4">
            <h3 className="font-bold text-sm text-slate-900">Department Placement Conversion (%)</h3>
            <PlacementRateChart data={departmentStats || []} />
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="font-bold text-sm text-slate-900">Salary Package Distribution (Tiers)</h3>
            <SalaryDistributionChart data={salaryDistribution || []} />
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="font-bold text-sm text-slate-900">Top In-Demand Technical Skills</h3>
            <SkillDemandBar data={topSkills || []} />
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="font-bold text-sm text-slate-900">Campus Application Pipeline Funnel</h3>
            <ApplicationFunnelChart data={applicationFunnel || []} />
          </Card>
        </div>
      </div>
    </div>
  );
}
