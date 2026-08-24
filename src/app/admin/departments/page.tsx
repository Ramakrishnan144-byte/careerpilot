'use client';

import React, { useState, useEffect } from 'react';
import { GraduationCap, TrendingUp, Users, Award } from 'lucide-react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function AdminDepartmentsPage() {
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
          <LoadingSpinner message="Loading academic departments data..." />
        </div>
      </div>
    );
  }

  const { departmentStats } = metrics || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
      <AdminSidebar />

      <div className="flex-1 space-y-6 min-w-0">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-purple-600" />
            Department Placement Intelligence
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Placement conversion rates and average packages across university faculties.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(departmentStats || []).map((dept: any) => (
            <Card key={dept.departmentCode} className="p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <Badge variant="purple" size="md">{dept.departmentCode}</Badge>
                  <h3 className="font-bold text-sm text-slate-900">{dept.name}</h3>
                </div>
                <span className="font-extrabold text-sm text-emerald-600">
                  {dept.placementRate}% Placed
                </span>
              </div>

              <ProgressBar value={dept.placementRate} size="sm" />

              <div className="grid grid-cols-2 gap-2 pt-1 text-xs text-slate-600">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-semibold block">Students Enrolled</span>
                  <span className="font-bold text-slate-900 text-sm">{dept.totalStudents}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-semibold block">Placed Students</span>
                  <span className="font-bold text-emerald-600 text-sm">{dept.placedStudents}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
