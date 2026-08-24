'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  Building2,
  MapPin,
  Briefcase,
  ChevronRight,
  ArrowUpDown,
} from 'lucide-react';
import { StudentSidebar } from '@/components/layout/StudentSidebar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function StudentOpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [workMode, setWorkMode] = useState('ALL');
  const [jobType, setJobType] = useState('ALL');
  const [eligibleOnly, setEligibleOnly] = useState(false);
  const [sortBy, setSortBy] = useState('priority');
  const [applyingId, setApplyingId] = useState<string | null>(null);

  useEffect(() => {
    fetchOpportunities();
  }, [search, workMode, jobType, eligibleOnly, sortBy]);

  const fetchOpportunities = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        q: search,
        workMode,
        jobType,
        eligibleOnly: String(eligibleOnly),
        sortBy,
      });
      const res = await fetch(`/api/opportunities?${params.toString()}`);
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

  const handleApply = async (oppId: string) => {
    try {
      setApplyingId(oppId);
      const res = await fetch(`/api/opportunities/${oppId}/apply`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        fetchOpportunities();
      } else {
        alert(data.error || 'Failed to apply');
      }
    } catch (err) {
      console.error('Apply error:', err);
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
      <StudentSidebar />

      <div className="flex-1 space-y-6 min-w-0">
        {/* Page Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-sky-600" />
              AI Opportunity Matcher
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Live campus drives scored dynamically based on your verified skills, CGPA, and career goals.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer bg-slate-50 hover:bg-slate-100 p-2.5 rounded-xl border border-slate-200 transition-colors">
              <input
                type="checkbox"
                checked={eligibleOnly}
                onChange={(e) => setEligibleOnly(e.target.checked)}
                className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4"
              />
              <span>Eligible Only</span>
            </label>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <Card className="p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div className="sm:col-span-2 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by company, job role, or skill..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <select
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 bg-white"
              >
                <option value="ALL">All Work Modes</option>
                <option value="HYBRID">Hybrid</option>
                <option value="REMOTE">Remote</option>
                <option value="ON_SITE">On-Site</option>
              </select>
            </div>

            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 bg-white"
              >
                <option value="priority">Sort by Priority Match %</option>
                <option value="deadline">Sort by Deadline (Urgent first)</option>
                <option value="newest">Sort by Recently Added</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Opportunities List */}
        {isLoading ? (
          <Card className="p-12 text-center">
            <LoadingSpinner message="Calculating opportunity match rankings..." />
          </Card>
        ) : opportunities.length === 0 ? (
          <Card className="p-12 text-center text-xs text-slate-500">
            No opportunities found matching your filter criteria. Try clearing some filters.
          </Card>
        ) : (
          <div className="space-y-4">
            {opportunities.map((opp) => {
              const priority = opp.scoreBreakdown?.overallPriorityScore || opp.priorityScore || 75;
              const isEligible = opp.eligibility?.isEligible ?? true;
              const isApplied = opp.isApplied;

              return (
                <Card
                  key={opp.id}
                  className="p-5 sm:p-6 hover:border-sky-300 hover:shadow-md transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center font-bold text-sky-700 text-sm overflow-hidden flex-shrink-0">
                        {opp.company.logo ? (
                          <img
                            src={opp.company.logo}
                            alt={opp.company.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          opp.company.name.charAt(0)
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-bold text-slate-900">{opp.title}</h3>
                          <Badge
                            variant={priority >= 85 ? 'success' : priority >= 70 ? 'primary' : 'warning'}
                            size="sm"
                          >
                            ⭐ {priority}% Match
                          </Badge>
                        </div>

                        <p className="text-xs font-semibold text-slate-700">
                          {opp.company.name} • <span className="text-sky-600 font-bold">{opp.salaryPackage}</span>
                        </p>

                        <p className="text-xs text-slate-500 flex items-center gap-2">
                          <span>{opp.location}</span>
                          <span>•</span>
                          <span className="capitalize">{opp.workMode.toLowerCase()}</span>
                          <span>•</span>
                          <span>Min CGPA: {opp.minCgpa}</span>
                        </p>
                      </div>
                    </div>

                    {/* Eligibility & Action */}
                    <div className="flex flex-col sm:items-end gap-2">
                      {isEligible ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Eligible
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                          <AlertCircle className="w-3.5 h-3.5" />
                          Not Eligible
                        </span>
                      )}

                      <span className="text-[11px] text-slate-400">
                        Deadline: {new Date(opp.applicationDeadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {opp.skills.map((sk: any) => (
                      <span
                        key={sk.id}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium"
                      >
                        {sk.skill.name}
                      </span>
                    ))}
                  </div>

                  {/* Footer Row */}
                  <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <p className="text-slate-500 text-[11px] line-clamp-1 max-w-xl">
                      {opp.scoreBreakdown?.recommendationReason || opp.description}
                    </p>

                    <div className="flex items-center gap-2">
                      <Link href={`/student/opportunities/${opp.id}`}>
                        <Button variant="outline" size="sm">
                          Inspect Match & Gaps
                        </Button>
                      </Link>

                      {isApplied ? (
                        <Badge variant="success" size="lg">
                          Applied ({opp.appliedStatus || 'Under Review'})
                        </Badge>
                      ) : (
                        <Button
                          onClick={() => handleApply(opp.id)}
                          variant="primary"
                          size="sm"
                          isLoading={applyingId === opp.id}
                        >
                          1-Click Apply
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
