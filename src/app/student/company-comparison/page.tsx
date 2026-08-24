'use client';

import React, { useState, useEffect } from 'react';
import { GitCompare, CheckCircle2, AlertCircle, Sparkles, Building2 } from 'lucide-react';
import { StudentSidebar } from '@/components/layout/StudentSidebar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function CompanyComparisonPage() {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/opportunities')
      .then((r) => r.json())
      .then((data) => {
        if (data.opportunities && data.opportunities.length > 0) {
          setOpportunities(data.opportunities);
          setSelectedIds(data.opportunities.slice(0, 3).map((o: any) => o.id));
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) {
        setSelectedIds(selectedIds.filter((item) => item !== id));
      }
    } else {
      if (selectedIds.length < 4) {
        setSelectedIds([...selectedIds, id]);
      } else {
        alert('You can compare up to 4 companies simultaneously.');
      }
    }
  };

  const selectedOpps = opportunities.filter((o) => selectedIds.includes(o.id));

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
        <StudentSidebar />
        <div className="flex-1 bg-white rounded-2xl p-12 border border-slate-200">
          <LoadingSpinner message="Loading company comparison intelligence..." />
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
              <GitCompare className="w-6 h-6 text-sky-600" />
              Side-by-Side Company Comparison
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Compare compensation, eligibility cutoffs, work mode, and priority match across campus recruiters.
            </p>
          </div>
        </div>

        {/* Opportunity Selector Chips */}
        <Card className="p-4 space-y-2">
          <p className="text-xs font-bold text-slate-700">Select Companies to Compare (2–4):</p>
          <div className="flex flex-wrap gap-2">
            {opportunities.map((opp) => {
              const isSelected = selectedIds.includes(opp.id);
              return (
                <button
                  key={opp.id}
                  onClick={() => toggleSelect(opp.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                    isSelected
                      ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {opp.company.name} ({opp.jobRole})
                </button>
              );
            })}
          </div>
        </Card>

        {/* Comparison Matrix Table */}
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700">
                <tr>
                  <th className="p-4 font-bold w-48">Metric / Feature</th>
                  {selectedOpps.map((opp) => (
                    <th key={opp.id} className="p-4 min-w-[200px]">
                      <div className="space-y-1">
                        <p className="font-extrabold text-slate-900 text-sm">{opp.company.name}</p>
                        <p className="text-xs text-slate-500">{opp.title}</p>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {/* Priority Match % */}
                <tr className="bg-sky-50/30">
                  <td className="p-4 font-bold text-slate-900">Priority Match</td>
                  {selectedOpps.map((opp) => (
                    <td key={opp.id} className="p-4">
                      <Badge variant="primary" size="md">
                        ⭐ {opp.priorityScore || 85}%
                      </Badge>
                    </td>
                  ))}
                </tr>

                {/* Deterministic Eligibility */}
                <tr>
                  <td className="p-4 font-bold text-slate-900">Eligibility Status</td>
                  {selectedOpps.map((opp) => (
                    <td key={opp.id} className="p-4">
                      {opp.eligibility?.isEligible ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Eligible
                        </span>
                      ) : (
                        <span className="text-rose-700 font-bold flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" /> Not Eligible
                        </span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Package / CTC */}
                <tr>
                  <td className="p-4 font-bold text-slate-900">Compensation Package</td>
                  {selectedOpps.map((opp) => (
                    <td key={opp.id} className="p-4 font-extrabold text-slate-900 text-sm">
                      {opp.salaryPackage}
                    </td>
                  ))}
                </tr>

                {/* Work Mode & Location */}
                <tr>
                  <td className="p-4 font-bold text-slate-900">Work Mode & Location</td>
                  {selectedOpps.map((opp) => (
                    <td key={opp.id} className="p-4 text-slate-700">
                      <span className="font-semibold capitalize">{opp.workMode.toLowerCase()}</span> • {opp.location}
                    </td>
                  ))}
                </tr>

                {/* Minimum CGPA */}
                <tr>
                  <td className="p-4 font-bold text-slate-900">CGPA Cutoff</td>
                  {selectedOpps.map((opp) => (
                    <td key={opp.id} className="p-4 font-semibold text-slate-800">
                      Min {opp.minCgpa} CGPA
                    </td>
                  ))}
                </tr>

                {/* Backlog Policy */}
                <tr>
                  <td className="p-4 font-bold text-slate-900">Backlog Allowance</td>
                  {selectedOpps.map((opp) => (
                    <td key={opp.id} className="p-4 text-slate-700">
                      Max {opp.maxBacklogsAllowed} active backlog(s)
                    </td>
                  ))}
                </tr>

                {/* Required Skills */}
                <tr>
                  <td className="p-4 font-bold text-slate-900">Required Skills</td>
                  {selectedOpps.map((opp) => (
                    <td key={opp.id} className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {opp.skills.map((sk: any) => (
                          <span
                            key={sk.id}
                            className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold"
                          >
                            {sk.skill.name}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Selection Workflow */}
                <tr>
                  <td className="p-4 font-bold text-slate-900">Selection Process</td>
                  {selectedOpps.map((opp) => (
                    <td key={opp.id} className="p-4 text-[11px] text-slate-600 leading-relaxed">
                      {opp.selectionProcess || 'Standard Assessment -> Technical -> HR'}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
