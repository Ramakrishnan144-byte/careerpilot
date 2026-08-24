'use client';

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Code2,
  Filter,
} from 'lucide-react';
import { StudentSidebar } from '@/components/layout/StudentSidebar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function SkillGapsPage() {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [selectedOppId, setSelectedOppId] = useState<string>('');
  const [detailData, setDetailData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/opportunities');
      const data = await res.json();
      if (data.opportunities && data.opportunities.length > 0) {
        setOpportunities(data.opportunities);
        setSelectedOppId(data.opportunities[0].id);
        fetchGapDetail(data.opportunities[0].id);
      }
    } catch (err) {
      console.error('Error fetching opportunities for skill gap:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGapDetail = async (id: string) => {
    try {
      setIsDetailLoading(true);
      const res = await fetch(`/api/opportunities/${id}`);
      const data = await res.json();
      setDetailData(data);
    } catch (err) {
      console.error('Error fetching gap detail:', err);
    } finally {
      setIsDetailLoading(false);
    }
  };

  const handleSelectOpp = (id: string) => {
    setSelectedOppId(id);
    fetchGapDetail(id);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
        <StudentSidebar />
        <div className="flex-1 bg-white rounded-2xl p-12 border border-slate-200">
          <LoadingSpinner message="Loading Skill Gap Intelligence..." />
        </div>
      </div>
    );
  }

  const { opportunity, skillGapAnalysis } = detailData || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
      <StudentSidebar />

      <div className="flex-1 space-y-6 min-w-0">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-sky-600" />
              Skill Gap Analyzer & Learning Hub
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Select any target company role to audit missing technical skills, study resources, and practice projects.
            </p>
          </div>
        </div>

        {/* Target Selector */}
        <Card className="p-4">
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Select Target Opportunity to Analyze:
          </label>
          <select
            value={selectedOppId}
            onChange={(e) => handleSelectOpp(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 text-xs font-semibold bg-white"
          >
            {opportunities.map((opp) => (
              <option key={opp.id} value={opp.id}>
                {opp.company.name} — {opp.title} ({opp.salaryPackage})
              </option>
            ))}
          </select>
        </Card>

        {isDetailLoading || !detailData ? (
          <Card className="p-12 text-center">
            <LoadingSpinner message="Computing skill comparison matrix..." />
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Overview Match Banner */}
            <Card className="p-6 bg-gradient-to-r from-sky-50 to-white border-sky-200/80">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {opportunity.company.name} • {opportunity.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 max-w-xl">
                    {skillGapAnalysis?.summaryNote}
                  </p>
                </div>

                <div className="w-full sm:w-56 bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between mb-1 text-xs font-bold text-slate-800">
                    <span>Skill Readiness</span>
                    <span className="text-sky-600">{skillGapAnalysis?.readinessPercentage}%</span>
                  </div>
                  <ProgressBar value={skillGapAnalysis?.readinessPercentage || 80} size="sm" />
                </div>
              </div>
            </Card>

            {/* Matched vs Missing Skills Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Matched Skills */}
              <Card className="p-6 space-y-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Acquired Skills ({skillGapAnalysis?.matchedCount || 0})
                </h3>
                <div className="flex flex-wrap gap-2 pt-1">
                  {(skillGapAnalysis?.matchedSkills || []).map((sk: string) => (
                    <span
                      key={sk}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {sk}
                    </span>
                  ))}
                </div>
              </Card>

              {/* Missing Skills */}
              <Card className="p-6 space-y-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  Target Skill Gaps ({skillGapAnalysis?.missingCount || 0})
                </h3>
                <div className="flex flex-wrap gap-2 pt-1">
                  {skillGapAnalysis?.gaps.length === 0 ? (
                    <p className="text-xs text-slate-500">No skill gaps identified for this role.</p>
                  ) : (
                    skillGapAnalysis?.gaps.map((gap: any) => (
                      <span
                        key={gap.skillName}
                        className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold flex items-center gap-1.5"
                      >
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                        {gap.skillName}
                      </span>
                    ))
                  )}
                </div>
              </Card>
            </div>

            {/* Actionable Learning Hub & Course Recommendations */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-sky-600" />
                Curated Learning Paths & Resources
              </h3>

              <div className="space-y-4">
                {skillGapAnalysis?.gaps.map((gap: any) => (
                  <Card key={gap.skillName} className="p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900">{gap.skillName}</span>
                        <Badge variant={gap.isMandatory ? 'danger' : 'warning'} size="sm">
                          {gap.isMandatory ? 'Mandatory' : 'Preferred'}
                        </Badge>
                      </div>
                      <span className="text-xs text-slate-500 font-medium">
                        Estimated effort: {gap.estimatedLearningEffort}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      {/* Courses */}
                      <div className="space-y-2 bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
                        <p className="font-bold text-slate-800">Recommended Courses & Guides:</p>
                        <ul className="space-y-1.5">
                          {gap.recommendedCourses.map((c: any) => (
                            <li key={c.title} className="flex items-start justify-between gap-2">
                              <span className="text-slate-700">• {c.title}</span>
                              <Badge variant={c.type === 'FREE' ? 'success' : 'outline'} size="sm">
                                {c.provider}
                              </Badge>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Practice Projects */}
                      <div className="space-y-2 bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
                        <p className="font-bold text-slate-800">Hands-on Practice Projects:</p>
                        <ul className="space-y-1.5">
                          {gap.recommendedProjects.map((p: string) => (
                            <li key={p} className="text-slate-700">
                              • {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
