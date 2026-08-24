'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Search,
  Filter,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { RecruiterSidebar } from '@/components/layout/RecruiterSidebar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function RecruiterApplicantsPage() {
  const [applicants, setApplicants] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchApplicants();
  }, [statusFilter]);

  const fetchApplicants = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'ALL') params.set('status', statusFilter);
      const res = await fetch(`/api/recruiter/applicants?${params.toString()}`);
      const data = await res.json();
      if (data.applications) {
        setApplicants(data.applications);
      }
    } catch (err) {
      console.error('Error loading applicants:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (appId: string, nextStatus: string) => {
    try {
      await fetch(`/api/applications/${appId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      fetchApplicants();
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
        <RecruiterSidebar />
        <div className="flex-1 bg-white rounded-2xl p-12 border border-slate-200">
          <LoadingSpinner message="Loading candidate applicant directory..." />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
      <RecruiterSidebar />

      <div className="flex-1 space-y-6 min-w-0">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Users className="w-6 h-6 text-sky-600" />
              Applicant Evaluation Pipeline
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Review and advance applicants through assessment, technical rounds, shortlisting, and offers.
            </p>
          </div>

          {/* Status Filter Chips */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold overflow-x-auto">
            {['ALL', 'APPLIED', 'ASSESSMENT', 'INTERVIEW', 'SHORTLISTED', 'SELECTED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  statusFilter === st
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Applicants Table */}
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">Candidate</th>
                  <th className="p-4">Applied Role</th>
                  <th className="p-4">Academics</th>
                  <th className="p-4">Priority Match</th>
                  <th className="p-4">Top Skills</th>
                  <th className="p-4">Stage</th>
                  <th className="p-4 text-right">Quick Transition</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applicants.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-sky-100 text-sky-700 font-bold flex items-center justify-center text-xs">
                          {app.studentProfile.user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{app.studentProfile.user.name}</p>
                          <Link
                            href={`/p/${app.studentProfile.publicProfileSlug}`}
                            target="_blank"
                            className="text-[11px] text-sky-600 hover:underline flex items-center gap-1 font-semibold"
                          >
                            <span>Verified Profile</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-slate-800">{app.opportunity.title}</td>
                    <td className="p-4">
                      <p className="font-bold text-slate-900">{app.studentProfile.cgpa} CGPA</p>
                      <p className="text-[11px] text-slate-500">
                        {app.studentProfile.department?.code || 'CSE'} • Batch of {app.studentProfile.graduationYear}
                      </p>
                    </td>
                    <td className="p-4">
                      <Badge variant="primary" size="sm">
                        ⭐ {app.priorityScore || 85}%
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {(app.studentProfile.skills || []).slice(0, 3).map((sk: any) => (
                          <span
                            key={sk.id}
                            className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium"
                          >
                            {sk.skill?.name}
                          </span>
                        ))}
                      </div>
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
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <select
                          value={app.status}
                          onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white font-semibold text-xs text-slate-800 focus:ring-2 focus:ring-sky-500"
                        >
                          <option value="APPLIED">Applied</option>
                          <option value="ASSESSMENT">Assessment</option>
                          <option value="INTERVIEW">Interview</option>
                          <option value="SHORTLISTED">Shortlisted</option>
                          <option value="SELECTED">Selected</option>
                          <option value="REJECTED">Rejected</option>
                        </select>
                      </div>
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
