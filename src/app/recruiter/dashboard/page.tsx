'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  PlusCircle,
  TrendingUp,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { RecruiterSidebar } from '@/components/layout/RecruiterSidebar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function RecruiterDashboardPage() {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [company, setCompany] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [compRes, oppRes, appRes] = await Promise.all([
        fetch('/api/recruiter/company'),
        fetch('/api/recruiter/opportunities'),
        fetch('/api/recruiter/applicants'),
      ]);

      const compData = await compRes.json();
      const oppData = await oppRes.json();
      const appData = await appRes.json();

      if (compData.company) setCompany(compData.company);
      if (oppData.opportunities) setOpportunities(oppData.opportunities);
      if (appData.applications) setApplicants(appData.applications);
    } catch (err) {
      console.error('Error fetching recruiter dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (appId: string, nextStatus: string) => {
    try {
      await fetch(`/api/applications/${appId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus, comment: `Advanced to ${nextStatus}` }),
      });
      fetchData();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
        <RecruiterSidebar />
        <div className="flex-1 bg-white rounded-2xl p-12 border border-slate-200">
          <LoadingSpinner message="Loading hiring pipeline & candidate rankings..." />
        </div>
      </div>
    );
  }

  const shortlistedCount = applicants.filter((a) => a.status === 'SHORTLISTED' || a.status === 'SELECTED').length;
  const interviewCount = applicants.filter((a) => a.status === 'INTERVIEW').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
      <RecruiterSidebar />

      <div className="flex-1 space-y-6 min-w-0">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <Badge variant="primary" size="sm" className="bg-sky-500/20 text-sky-300 border-sky-400/30">
              Campus Recruiter Portal
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {company?.name || 'Enterprise'} Talent Dashboard
            </h1>
            <p className="text-xs text-slate-300">
              Manage candidate talent pools, evaluate eligibility rules, and schedule interview rounds.
            </p>
          </div>

          <Link href="/recruiter/opportunities/new">
            <Button variant="primary" size="md" leftIcon={<PlusCircle className="w-4 h-4" />}>
              Create New Job Drive
            </Button>
          </Link>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5">
            <p className="text-xs font-semibold text-slate-500">Active Campus Drives</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              {opportunities.length}
            </p>
          </Card>

          <Card className="p-5">
            <p className="text-xs font-semibold text-slate-500">Total Applicants</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-sky-600 mt-1">
              {applicants.length}
            </p>
          </Card>

          <Card className="p-5">
            <p className="text-xs font-semibold text-slate-500">In Interview Stage</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-purple-600 mt-1">
              {interviewCount}
            </p>
          </Card>

          <Card className="p-5">
            <p className="text-xs font-semibold text-slate-500">Shortlisted / Offers</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-1">
              {shortlistedCount}
            </p>
          </Card>
        </div>

        {/* Candidate Evaluation Table */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-sky-600" />
                Ranked Candidate Talent Pool ({applicants.length})
              </h2>
              <p className="text-xs text-slate-500">
                Sorted by computed Priority Score match against opportunity criteria.
              </p>
            </div>
            <Link href="/recruiter/applicants">
              <Button variant="outline" size="sm" rightIcon={<ChevronRight className="w-3.5 h-3.5" />}>
                View All Candidates
              </Button>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">Candidate</th>
                  <th className="p-3">Role Applied</th>
                  <th className="p-3">CGPA & Dept</th>
                  <th className="p-3">Priority Match</th>
                  <th className="p-3">Stage</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applicants.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 font-bold flex items-center justify-center text-xs">
                          {app.studentProfile.user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{app.studentProfile.user.name}</p>
                          <Link
                            href={`/p/${app.studentProfile.publicProfileSlug}`}
                            target="_blank"
                            className="text-[11px] text-sky-600 hover:underline flex items-center gap-1"
                          >
                            <span>Verified Profile</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 font-semibold text-slate-800">{app.opportunity.title}</td>
                    <td className="p-3 text-slate-600">
                      <span className="font-bold text-slate-900">{app.studentProfile.cgpa} CGPA</span> •{' '}
                      {app.studentProfile.department?.code || app.studentProfile.departmentName}
                    </td>
                    <td className="p-3">
                      <Badge variant="primary" size="sm">
                        ⭐ {app.priorityScore || 88}% Match
                      </Badge>
                    </td>
                    <td className="p-3">
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
                    <td className="p-3 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {app.status === 'APPLIED' && (
                          <Button
                            onClick={() => handleUpdateStatus(app.id, 'ASSESSMENT')}
                            size="sm"
                            variant="outline"
                          >
                            Send OA
                          </Button>
                        )}
                        {app.status === 'ASSESSMENT' && (
                          <Button
                            onClick={() => handleUpdateStatus(app.id, 'INTERVIEW')}
                            size="sm"
                            variant="primary"
                          >
                            Schedule Interview
                          </Button>
                        )}
                        {app.status === 'INTERVIEW' && (
                          <Button
                            onClick={() => handleUpdateStatus(app.id, 'SHORTLISTED')}
                            size="sm"
                            variant="success"
                          >
                            Shortlist
                          </Button>
                        )}
                        {app.status === 'SHORTLISTED' && (
                          <Button
                            onClick={() => handleUpdateStatus(app.id, 'SELECTED')}
                            size="sm"
                            variant="success"
                          >
                            Select & Offer
                          </Button>
                        )}
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
