'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  BarChart3,
  Users,
  Building2,
  Briefcase,
  GraduationCap,
  Award,
  TrendingUp,
  Sparkles,
  ChevronRight,
  Bell,
} from 'lucide-react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PlacementRateChart } from '@/components/charts/PlacementRateChart';
import { SkillDemandBar } from '@/components/charts/SkillDemandBar';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setIsLoading(true);
      const [metRes, oppRes] = await Promise.all([
        fetch('/api/admin/metrics'),
        fetch('/api/opportunities'),
      ]);

      const metData = await metRes.json();
      const oppData = await oppRes.json();

      setMetrics(metData);
      if (oppData.opportunities) {
        setOpportunities(oppData.opportunities.slice(0, 5));
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
        <AdminSidebar />
        <div className="flex-1 bg-white rounded-2xl p-12 border border-slate-200">
          <LoadingSpinner message="Loading University Placement Command Center..." />
        </div>
      </div>
    );
  }

  const { summary, departmentStats, topSkills } = metrics || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
      <AdminSidebar />

      <div className="flex-1 space-y-6 min-w-0">
        {/* Command Center Header */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <Badge variant="purple" size="sm" className="bg-purple-500/20 text-purple-300 border-purple-400/30">
              Placement Cell (TPO) Command Center
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Institutional Placement Dashboard
            </h1>
            <p className="text-xs text-purple-200">
              Campus placement season 2025–26 live metrics and department intelligence.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/admin/notifications">
              <Button size="sm" className="bg-purple-600 hover:bg-purple-500 text-white font-bold" leftIcon={<Bell className="w-4 h-4" />}>
                Broadcast Alert
              </Button>
            </Link>
          </div>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5">
            <p className="text-xs font-semibold text-slate-500">Overall Placement Rate</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-1">
              {summary?.placementRate || 82}%
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Verified Institutional Rate</p>
          </Card>

          <Card className="p-5">
            <p className="text-xs font-semibold text-slate-500">Average CTC Package</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-sky-600 mt-1">
              {summary?.averagePackageLpa || 16.8} LPA
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Highest: {summary?.highestPackageLpa || 52} LPA</p>
          </Card>

          <Card className="p-5">
            <p className="text-xs font-semibold text-slate-500">Partner Companies</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-purple-600 mt-1">
              {summary?.totalCompanies || 10}+
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Across Tech, Cloud & FinTech</p>
          </Card>

          <Card className="p-5">
            <p className="text-xs font-semibold text-slate-500">Total Applications Processed</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-indigo-600 mt-1">
              {summary?.totalApplications || 25}+
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Real-time candidate pipeline</p>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-purple-600" />
                Department Placement Conversion (%)
              </h3>
              <Link href="/admin/analytics" className="text-xs text-sky-600 hover:text-sky-700 font-semibold">
                Full Analytics
              </Link>
            </div>
            <PlacementRateChart data={departmentStats || []} />
          </Card>

          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Top Demanded Skills in Campus Drives
              </h3>
              <Link href="/admin/analytics" className="text-xs text-sky-600 hover:text-sky-700 font-semibold">
                View Trends
              </Link>
            </div>
            <SkillDemandBar data={topSkills || []} />
          </Card>
        </div>

        {/* Active Campus Drives Table */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-sky-600" />
                Active Campus Recruitment Drives
              </h3>
              <p className="text-xs text-slate-500">Live recruitment drives currently open for student registration.</p>
            </div>
            <Link href="/admin/opportunities">
              <Button variant="outline" size="sm" rightIcon={<ChevronRight className="w-3.5 h-3.5" />}>
                Manage Drives
              </Button>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">Company & Role</th>
                  <th className="p-3">Package</th>
                  <th className="p-3">Min CGPA</th>
                  <th className="p-3">Allowed Branches</th>
                  <th className="p-3">Deadline</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {opportunities.map((opp) => (
                  <tr key={opp.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-3">
                      <p className="font-bold text-slate-900">{opp.title}</p>
                      <p className="text-[11px] text-slate-500">{opp.company.name}</p>
                    </td>
                    <td className="p-3 font-semibold text-slate-800">{opp.salaryPackage}</td>
                    <td className="p-3 font-bold text-slate-900">{opp.minCgpa}</td>
                    <td className="p-3 text-slate-600">{opp.allowedDepartments}</td>
                    <td className="p-3 text-slate-500">{new Date(opp.applicationDeadline).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
