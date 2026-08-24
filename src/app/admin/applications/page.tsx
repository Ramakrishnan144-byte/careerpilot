'use client';

import React, { useState, useEffect } from 'react';
import { Layers, Search, Filter, CheckCircle2, Download } from 'lucide-react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/recruiter/applicants')
      .then((r) => r.json())
      .then((data) => {
        if (data.applications) setApplications(data.applications);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
        <AdminSidebar />
        <div className="flex-1 bg-white rounded-2xl p-12 border border-slate-200">
          <LoadingSpinner message="Loading master applications registry..." />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
      <AdminSidebar />

      <div className="flex-1 space-y-6 min-w-0">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Layers className="w-6 h-6 text-purple-600" />
              Master Applications Registry ({applications.length})
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Cross-company applicant tracking, interview schedules, and placement offers.
            </p>
          </div>
        </div>

        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">Candidate</th>
                  <th className="p-4">Company & Drive</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Priority Match</th>
                  <th className="p-4">Stage</th>
                  <th className="p-4">Applied Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 font-bold text-slate-900">{app.studentProfile.user.name}</td>
                    <td className="p-4">
                      <p className="font-semibold text-slate-800">{app.opportunity.title}</p>
                      <p className="text-[11px] text-slate-500">{app.opportunity.company.name}</p>
                    </td>
                    <td className="p-4 text-slate-600">
                      {app.studentProfile.department?.code || 'CSE'} ({app.studentProfile.cgpa} CGPA)
                    </td>
                    <td className="p-4">
                      <Badge variant="primary" size="sm">
                        ⭐ {app.priorityScore || 88}%
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={
                          app.status === 'SELECTED'
                            ? 'success'
                            : app.status === 'INTERVIEW'
                            ? 'purple'
                            : 'secondary'
                        }
                        size="sm"
                      >
                        {app.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-slate-500">
                      {new Date(app.appliedAt).toLocaleDateString()}
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
