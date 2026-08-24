'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Building2,
  MapPin,
  Briefcase,
  ChevronLeft,
  BookOpen,
  Award,
  Layers,
  FileText,
  TrendingUp,
} from 'lucide-react';
import { StudentSidebar } from '@/components/layout/StudentSidebar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function OpportunityDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    fetchDetail();
  }, [params.id]);

  const fetchDetail = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/opportunities/${params.id}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Error fetching detail:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = async () => {
    try {
      setIsApplying(true);
      const res = await fetch(`/api/opportunities/${params.id}/apply`, { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        fetchDetail();
      } else {
        alert(json.error || 'Failed to apply');
      }
    } catch (err) {
      console.error('Apply error:', err);
    } finally {
      setIsApplying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
        <StudentSidebar />
        <div className="flex-1 bg-white rounded-2xl p-12 border border-slate-200">
          <LoadingSpinner message="Analyzing opportunity match and deterministic rules..." />
        </div>
      </div>
    );
  }

  if (!data || !data.opportunity) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
        <StudentSidebar />
        <Card className="flex-1 p-12 text-center text-slate-500 text-xs">
          Opportunity not found or inactive.
        </Card>
      </div>
    );
  }

  const { opportunity, application, scoreBreakdown, eligibility, skillGapAnalysis, aiExplanation } = data;
  const isApplied = Boolean(application);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
      <StudentSidebar />

      <div className="flex-1 space-y-6 min-w-0">
        {/* Back Link */}
        <Link
          href="/student/opportunities"
          className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-sky-600 font-semibold"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Opportunities</span>
        </Link>

        {/* Top Header Card */}
        <Card className="p-6 bg-gradient-to-br from-white to-slate-50/80 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center font-bold text-sky-700 text-base overflow-hidden flex-shrink-0">
                {opportunity.company.logo ? (
                  <img src={opportunity.company.logo} alt={opportunity.company.name} className="w-full h-full object-cover" />
                ) : (
                  opportunity.company.name.charAt(0)
                )}
              </div>

              <div className="space-y-1">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {opportunity.title}
                </h1>
                <p className="text-sm font-semibold text-slate-700">{opportunity.company.name}</p>
                <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap pt-1">
                  <span className="font-bold text-slate-900 text-sm">{opportunity.salaryPackage}</span>
                  <span>•</span>
                  <span>{opportunity.location}</span>
                  <span>•</span>
                  <span className="capitalize">{opportunity.workMode.toLowerCase()}</span>
                  <span>•</span>
                  <span>Due: {new Date(opportunity.applicationDeadline).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Apply Action */}
            <div>
              {isApplied ? (
                <div className="text-right">
                  <Badge variant="success" size="lg">
                    Applied ({application.status})
                  </Badge>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Applied on {new Date(application.appliedAt).toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <Button
                  onClick={handleApply}
                  variant="primary"
                  size="md"
                  isLoading={isApplying}
                >
                  Apply to Drive
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Priority Score Breakdown (The Platform Differentiator) */}
        {scoreBreakdown && (
          <Card className="p-6 space-y-5 bg-gradient-to-br from-sky-50/50 via-white to-indigo-50/30 border-sky-200/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-sky-600" />
                  <h3 className="text-base font-bold text-slate-900">
                    Transparent Priority Score Model
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Multi-factor weighted recommendation algorithm.
                </p>
              </div>

              <Badge variant="primary" size="lg">
                ⭐ {scoreBreakdown.overallPriorityScore}% Overall Priority Score
              </Badge>
            </div>

            {/* Multi-Factor Progress Bars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                <ProgressBar
                  value={scoreBreakdown.skillMatchScore}
                  label="Skill Match (35%)"
                  size="sm"
                  colorVariant="sky"
                />
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                <ProgressBar
                  value={scoreBreakdown.eligibilityScore}
                  label="Eligibility (25%)"
                  size="sm"
                  colorVariant="emerald"
                />
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                <ProgressBar
                  value={scoreBreakdown.resumeMatchScore}
                  label="Resume ATS (20%)"
                  size="sm"
                  colorVariant="purple"
                />
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                <ProgressBar
                  value={scoreBreakdown.locationMatchScore}
                  label="Location (10%)"
                  size="sm"
                  colorVariant="amber"
                />
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                <ProgressBar
                  value={scoreBreakdown.experienceMatchScore}
                  label="Experience (10%)"
                  size="sm"
                  colorVariant="rose"
                />
              </div>
            </div>

            <p className="text-xs text-slate-600 bg-white/80 p-3.5 rounded-xl border border-slate-200/80 leading-relaxed">
              <strong>Match Summary:</strong> {scoreBreakdown.recommendationReason}
            </p>
          </Card>
        )}

        {/* Deterministic Eligibility Rule Checker */}
        {eligibility && (
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-600" />
                Deterministic Eligibility Check
              </h3>
              <Badge
                variant={
                  eligibility.status === 'ELIGIBLE'
                    ? 'success'
                    : eligibility.status === 'VERIFY_REQUIRED'
                    ? 'warning'
                    : 'danger'
                }
                size="md"
              >
                {eligibility.status.replace('_', ' ')}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {eligibility.ruleChecks.map((rule: any) => (
                <div
                  key={rule.ruleName}
                  className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                    rule.isSatisfied
                      ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                      : rule.isWarning
                      ? 'bg-amber-50/60 border-amber-200 text-amber-900'
                      : 'bg-rose-50/60 border-rose-200 text-rose-900'
                  }`}
                >
                  {rule.isSatisfied ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  ) : rule.isWarning ? (
                    <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                  )}

                  <div>
                    <p className="font-bold">{rule.ruleName}</p>
                    <p className="text-[11px] opacity-90 mt-0.5">{rule.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Skill Gap Analysis & Resources */}
        {skillGapAnalysis && (
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-sky-600" />
                Skill Gap Breakdown & Learning Path
              </h3>
              <span className="text-xs text-slate-500">
                {skillGapAnalysis.matchedCount} of {skillGapAnalysis.requiredSkillCount} skills matched
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {skillGapAnalysis.gaps.length === 0 ? (
                <p className="text-emerald-700 bg-emerald-50 p-3 rounded-xl font-medium">
                  ✓ Outstanding! You possess all required technical skills for this role.
                </p>
              ) : (
                skillGapAnalysis.gaps.map((gap: any) => (
                  <div
                    key={gap.skillName}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{gap.skillName}</span>
                        <Badge variant={gap.isMandatory ? 'danger' : 'warning'} size="sm">
                          {gap.isMandatory ? 'Required' : 'Preferred'}
                        </Badge>
                      </div>
                      <span className="text-[11px] text-slate-500">
                        Effort: {gap.estimatedLearningEffort}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                      <div className="space-y-1">
                        <span className="font-semibold text-slate-700">Recommended Courses:</span>
                        {gap.recommendedCourses.slice(0, 2).map((c: any) => (
                          <p key={c.title} className="text-slate-600">
                            • {c.title} ({c.provider})
                          </p>
                        ))}
                      </div>

                      <div className="space-y-1">
                        <span className="font-semibold text-slate-700">Suggested Practice:</span>
                        {gap.recommendedProjects.slice(0, 1).map((p: string) => (
                          <p key={p} className="text-slate-600">• {p}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        )}

        {/* Opportunity Description & Selection Process */}
        <Card className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            Job Description & Responsibilities
          </h3>
          <div className="text-xs text-slate-600 leading-relaxed space-y-3">
            <p>{opportunity.description}</p>
            {opportunity.responsibilities && (
              <div>
                <p className="font-semibold text-slate-800 mb-1">Key Responsibilities:</p>
                <p>{opportunity.responsibilities}</p>
              </div>
            )}
            {opportunity.selectionProcess && (
              <div className="pt-2">
                <p className="font-semibold text-slate-800 mb-1">Selection Workflow:</p>
                <p className="p-3 bg-slate-50 rounded-xl border border-slate-100 font-mono text-[11px] text-slate-700">
                  {opportunity.selectionProcess}
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
