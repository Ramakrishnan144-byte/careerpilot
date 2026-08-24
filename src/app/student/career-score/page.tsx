'use client';

import React, { useState, useEffect } from 'react';
import { Award, CheckCircle2, ArrowUpRight, TrendingUp, Sparkles } from 'lucide-react';
import { StudentSidebar } from '@/components/layout/StudentSidebar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function CareerScorePage() {
  const [careerScore, setCareerScore] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchScore();
  }, []);

  const fetchScore = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/student/career-score');
      const data = await res.json();
      if (data.careerScore) {
        setCareerScore(data.careerScore);
      }
    } catch (err) {
      console.error('Error fetching career score:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
        <StudentSidebar />
        <div className="flex-1 bg-white rounded-2xl p-12 border border-slate-200">
          <LoadingSpinner message="Calculating multi-dimensional Career Readiness Score..." />
        </div>
      </div>
    );
  }

  const { totalScore, ratingTier, ratingLabel, categoryScores, actionPlan } = careerScore || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
      <StudentSidebar />

      <div className="flex-1 space-y-6 min-w-0">
        {/* Header Banner */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Award className="w-6 h-6 text-sky-600" />
              Career Readiness Score (0–100)
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Holistic measurement of your placement competitiveness across 7 verified competency dimensions.
            </p>
          </div>

          <Badge variant="primary" size="lg">
            {ratingLabel}
          </Badge>
        </div>

        {/* Score Ring & Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 flex flex-col items-center justify-center text-center space-y-2 bg-gradient-to-br from-white to-sky-50/40">
            <ScoreRing
              score={totalScore || 78}
              size={140}
              strokeWidth={12}
              label="Overall Readiness"
              sublabel="Score out of 100"
            />
          </Card>

          {/* 7 Category Progress Bars */}
          <Card className="md:col-span-2 p-6 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Category Breakdown
            </h3>

            <div className="space-y-3 text-xs">
              {categoryScores &&
                Object.entries(categoryScores).map(([key, cat]: [string, any]) => (
                  <div key={key} className="space-y-1">
                    <div className="flex justify-between font-semibold text-slate-700">
                      <span>{cat.label}</span>
                      <span>
                        {cat.score} / {cat.max} pts ({cat.percentage}%)
                      </span>
                    </div>
                    <ProgressBar value={cat.percentage} size="sm" />
                  </div>
                ))}
            </div>
          </Card>
        </div>

        {/* Actionable Roadmap to 100 Points */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                How to Elevate Your Score to 100
              </h3>
              <p className="text-xs text-slate-500">
                Actionable milestones tailored to unlock maximum placement competitiveness.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {actionPlan && actionPlan.length === 0 ? (
              <p className="text-xs text-emerald-600 font-bold p-4 bg-emerald-50 rounded-xl">
                ✓ Phenomenal work! You have achieved maximum readiness across all categories.
              </p>
            ) : (
              actionPlan?.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/60 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 font-bold flex items-center justify-center text-[11px] flex-shrink-0">
                      +{item.pointsGain}
                    </span>
                    <div>
                      <span className="font-bold text-slate-900">[{item.category}] </span>
                      <span className="text-slate-700">{item.action}</span>
                    </div>
                  </div>

                  <Badge variant="outline" size="sm">
                    Recommended
                  </Badge>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
