'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Briefcase, Search, CheckCircle2, Building2 } from 'lucide-react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function AdminOpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/opportunities')
      .then((r) => r.json())
      .then((data) => {
        if (data.opportunities) setOpportunities(data.opportunities);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
        <AdminSidebar />
        <div className="flex-1 bg-white rounded-2xl p-12 border border-slate-200">
          <LoadingSpinner message="Loading all campus drives..." />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
      <AdminSidebar />

      <div className="flex-1 space-y-6 min-w-0">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-purple-600" />
            Master Campus Recruitment Drives ({opportunities.length})
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Institutional oversight of all active and upcoming campus placements.
          </p>
        </div>

        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">Company & Drive Title</th>
                  <th className="p-4">Package</th>
                  <th className="p-4">Eligibility Cutoff</th>
                  <th className="p-4">Allowed Branches</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Deadline</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {opportunities.map((opp) => (
                  <tr key={opp.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-slate-900">{opp.title}</p>
                      <p className="text-[11px] text-slate-500">{opp.company.name} • {opp.jobRole}</p>
                    </td>
                    <td className="p-4 font-bold text-slate-900">{opp.salaryPackage}</td>
                    <td className="p-4">
                      <p className="font-semibold text-slate-800">Min {opp.minCgpa} CGPA</p>
                      <p className="text-[11px] text-slate-400">Max {opp.maxBacklogsAllowed} Backlogs</p>
                    </td>
                    <td className="p-4 text-slate-600">{opp.allowedDepartments}</td>
                    <td className="p-4">
                      <Badge variant="success" size="sm">{opp.status}</Badge>
                    </td>
                    <td className="p-4 text-slate-500">
                      {new Date(opp.applicationDeadline).toLocaleDateString()}
                    </td>
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
