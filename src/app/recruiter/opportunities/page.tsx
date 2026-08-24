'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Briefcase, PlusCircle, Users, ChevronRight, CheckCircle2 } from 'lucide-react';
import { RecruiterSidebar } from '@/components/layout/RecruiterSidebar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function RecruiterOpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/recruiter/opportunities');
      const data = await res.json();
      if (data.opportunities) {
        setOpportunities(data.opportunities);
      }
    } catch (err) {
      console.error('Error fetching opportunities:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
        <RecruiterSidebar />
        <div className="flex-1 bg-white rounded-2xl p-12 border border-slate-200">
          <LoadingSpinner message="Loading your company job drives..." />
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
              <Briefcase className="w-6 h-6 text-sky-600" />
              Manage Job Postings & Campus Drives
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Review active postings, eligibility thresholds, and applicant conversion rates.
            </p>
          </div>

          <Link href="/recruiter/opportunities/new">
            <Button variant="primary" size="sm" leftIcon={<PlusCircle className="w-4 h-4" />}>
              Create New Job Drive
            </Button>
          </Link>
        </div>

        <div className="space-y-4">
          {opportunities.length === 0 ? (
            <Card className="p-12 text-center text-xs text-slate-500">
              No opportunities created yet. Click &quot;Create New Job Drive&quot; to publish your first role.
            </Card>
          ) : (
            opportunities.map((opp) => (
              <Card key={opp.id} className="p-5 space-y-3 hover:border-sky-300 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-slate-900">{opp.title}</h3>
                      <Badge variant="success" size="sm">{opp.status}</Badge>
                    </div>

                    <p className="text-xs font-semibold text-slate-700">
                      {opp.jobRole} • <span className="text-sky-600 font-bold">{opp.salaryPackage}</span>
                    </p>

                    <p className="text-xs text-slate-500">
                      {opp.location} • <span className="capitalize">{opp.workMode.toLowerCase()}</span> • Min CGPA: {opp.minCgpa}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link href={`/recruiter/applicants?opportunityId=${opp.id}`}>
                      <Button variant="outline" size="sm" leftIcon={<Users className="w-4 h-4" />}>
                        View Applicants ({opp.applications?.length || 0})
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {opp.skills?.map((sk: any) => (
                    <span key={sk.id} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold">
                      {sk.skill?.name || sk.name}
                    </span>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Deadline: {new Date(opp.applicationDeadline).toLocaleDateString()}</span>
                  <span>Allowed Branches: {opp.allowedDepartments}</span>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
