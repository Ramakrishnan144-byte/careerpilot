'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Layers,
  Clock,
  Calendar,
  Building2,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Plus,
  FileText,
} from 'lucide-react';
import { StudentSidebar } from '@/components/layout/StudentSidebar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tabs } from '@/components/ui/Tabs';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function ApplicationsTrackerPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'KANBAN' | 'TABLE'>('KANBAN');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/applications');
      const data = await res.json();
      if (data.applications) {
        setApplications(data.applications);
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    { id: 'APPLIED', title: 'Applied', color: 'border-t-slate-400 bg-slate-50/50' },
    { id: 'ASSESSMENT', title: 'Online Assessment', color: 'border-t-sky-500 bg-sky-50/30' },
    { id: 'INTERVIEW', title: 'Technical Interview', color: 'border-t-purple-500 bg-purple-50/30' },
    { id: 'SHORTLISTED', title: 'Shortlisted', color: 'border-t-amber-500 bg-amber-50/30' },
    { id: 'SELECTED', title: 'Selected / Offer', color: 'border-t-emerald-500 bg-emerald-50/30' },
  ];

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
        <StudentSidebar />
        <div className="flex-1 bg-white rounded-2xl p-12 border border-slate-200">
          <LoadingSpinner message="Loading your recruitment pipeline..." />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
      <StudentSidebar />

      <div className="flex-1 space-y-6 min-w-0">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Layers className="w-6 h-6 text-sky-600" />
              Recruitment Application Tracker
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Live recruitment stages, scheduled interview dates, assessment links, and recruiter notes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-slate-100 p-1 rounded-xl flex gap-1 text-xs font-semibold">
              <button
                onClick={() => setViewMode('KANBAN')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === 'KANBAN' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Kanban Board
              </button>
              <button
                onClick={() => setViewMode('TABLE')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === 'TABLE' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Table List
              </button>
            </div>
          </div>
        </div>

        {applications.length === 0 ? (
          <Card className="p-12 text-center text-xs text-slate-500">
            You have not applied to any campus drives yet. Explore the Opportunity Matcher to apply.
          </Card>
        ) : viewMode === 'KANBAN' ? (
          /* Kanban Board View */
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
            {columns.map((col) => {
              const colApps = applications.filter((a) => a.status === col.id);
              return (
                <div
                  key={col.id}
                  className={`rounded-2xl border border-slate-200/80 border-t-4 p-3.5 space-y-3 min-w-[220px] ${col.color}`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-xs text-slate-900">{col.title}</h3>
                    <span className="w-5 h-5 rounded-full bg-white text-slate-700 font-bold text-[10px] flex items-center justify-center border border-slate-200 shadow-2xs">
                      {colApps.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {colApps.map((app) => (
                      <div
                        key={app.id}
                        className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs space-y-2 hover:border-sky-300 transition-all text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{app.opportunity.company.name}</span>
                          <Badge variant="primary" size="sm">
                            ⭐ {app.priorityScore || 85}%
                          </Badge>
                        </div>

                        <p className="font-semibold text-slate-700 leading-tight">
                          {app.opportunity.title}
                        </p>

                        <p className="text-[11px] text-slate-500">{app.opportunity.salaryPackage}</p>

                        {app.interviewDate && (
                          <div className="p-2 rounded-lg bg-purple-50 text-purple-900 text-[10px] font-semibold flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-purple-600" />
                            <span>Interview: {new Date(app.interviewDate).toLocaleDateString()}</span>
                          </div>
                        )}

                        {app.notes && (
                          <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                            &quot;{app.notes}&quot;
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Table View */
          <Card className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4">Company & Role</th>
                    <th className="p-4">Package</th>
                    <th className="p-4">Priority Match</th>
                    <th className="p-4">Current Stage</th>
                    <th className="p-4">Interview / OA Date</th>
                    <th className="p-4">Applied Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-slate-900">{app.opportunity.title}</p>
                        <p className="text-[11px] text-slate-500">{app.opportunity.company.name}</p>
                      </td>
                      <td className="p-4 font-semibold text-slate-800">
                        {app.opportunity.salaryPackage}
                      </td>
                      <td className="p-4">
                        <Badge variant="primary" size="sm">
                          ⭐ {app.priorityScore || 85}%
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
                      <td className="p-4 text-slate-600">
                        {app.interviewDate
                          ? new Date(app.interviewDate).toLocaleDateString()
                          : app.assessmentDate
                          ? new Date(app.assessmentDate).toLocaleDateString()
                          : '—'}
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
        )}
      </div>
    </div>
  );
}
