'use client';

import React, { useState, useEffect } from 'react';
import {
  MapPin,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Circle,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { StudentSidebar } from '@/components/layout/StudentSidebar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function CareerRoadmapPage() {
  const [roadmapData, setRoadmapData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const fetchRoadmap = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/student/roadmap');
      const data = await res.json();
      if (data.roadmap) {
        setRoadmapData(data);
      }
    } catch (err) {
      console.error('Error fetching roadmap:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (milestoneId: string, currentStatus: string) => {
    let nextStatus = 'IN_PROGRESS';
    if (currentStatus === 'IN_PROGRESS') nextStatus = 'COMPLETED';
    else if (currentStatus === 'COMPLETED') nextStatus = 'NOT_STARTED';

    try {
      setUpdatingId(milestoneId);
      const res = await fetch('/api/student/roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ milestoneId, status: nextStatus }),
      });
      const data = await res.json();
      if (data.milestone) {
        if (nextStatus === 'COMPLETED' && data.progressPercentage === 100) {
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        }
        fetchRoadmap();
      }
    } catch (err) {
      console.error('Error updating milestone status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
        <StudentSidebar />
        <div className="flex-1 bg-white rounded-2xl p-12 border border-slate-200">
          <LoadingSpinner message="Generating your personalized placement roadmap..." />
        </div>
      </div>
    );
  }

  const { roadmap, progressPercentage } = roadmapData || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
      <StudentSidebar />

      <div className="flex-1 space-y-6 min-w-0">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-sky-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-sky-600/15 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1 max-w-xl">
            <Badge variant="outline" size="sm" className="text-sky-200 border-sky-300/40 mb-1">
              Personalized Career Pipeline
            </Badge>
            <h1 className="text-2xl font-extrabold tracking-tight">
              Roadmap: {roadmap?.targetRole || 'Software Development Engineer'}
            </h1>
            <p className="text-xs text-sky-100 leading-relaxed">
              Step-by-step milestones to transition from student fundamentals to Tier-1 campus placement.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center min-w-[140px]">
            <p className="text-3xl font-extrabold">{progressPercentage}%</p>
            <p className="text-[11px] text-sky-200 uppercase tracking-wider font-semibold">
              Roadmap Complete
            </p>
          </div>
        </div>

        {/* Progress Tracker */}
        <Card className="p-6">
          <ProgressBar value={progressPercentage} size="lg" label="Overall Roadmap Progress" />
        </Card>

        {/* Vertical Pipeline of Milestones */}
        <div className="space-y-4">
          {(roadmap?.milestones || []).map((m: any, idx: number) => {
            const isCompleted = m.status === 'COMPLETED';
            const isInProgress = m.status === 'IN_PROGRESS';

            return (
              <Card
                key={m.id}
                className={`p-5 transition-all flex items-start gap-4 ${
                  isCompleted
                    ? 'bg-emerald-50/40 border-emerald-200/80'
                    : isInProgress
                    ? 'bg-sky-50/40 border-sky-200/80 shadow-xs'
                    : 'bg-white'
                }`}
              >
                {/* Step indicator circle button */}
                <button
                  onClick={() => handleToggleStatus(m.id, m.status)}
                  disabled={updatingId === m.id}
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-xs flex-shrink-0 transition-transform active:scale-95 ${
                    isCompleted
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : isInProgress
                      ? 'bg-sky-600 text-white shadow-sm ring-4 ring-sky-100'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                  title="Click to toggle status"
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : idx + 1}
                </button>

                {/* Milestone details */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h3 className="font-bold text-sm text-slate-900">{m.title}</h3>
                    <Badge
                      variant={isCompleted ? 'success' : isInProgress ? 'primary' : 'secondary'}
                      size="sm"
                    >
                      {m.status.replace('_', ' ')}
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{m.description}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
