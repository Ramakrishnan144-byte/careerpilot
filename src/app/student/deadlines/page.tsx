'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Clock,
  Calendar,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { StudentSidebar } from '@/components/layout/StudentSidebar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function DeadlinesPage() {
  const [deadlines, setDeadlines] = useState<any[]>([]);
  const [filterLevel, setFilterLevel] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDeadlines();
  }, []);

  const fetchDeadlines = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/student/deadlines');
      const data = await res.json();
      if (data.deadlines) {
        setDeadlines(data.deadlines);
      }
    } catch (err) {
      console.error('Error fetching deadlines:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = deadlines.filter((dl) => {
    if (filterLevel === 'ALL') return true;
    return dl.urgencyLevel === filterLevel;
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
        <StudentSidebar />
        <div className="flex-1 bg-white rounded-2xl p-12 border border-slate-200">
          <LoadingSpinner message="Checking placement drive schedules and assessment deadlines..." />
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
              <Clock className="w-6 h-6 text-amber-500" />
              Smart Placement Deadlines & Schedules
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated countdown alerts across all active campus drives, assessments, interviews, and certifications.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            {['ALL', 'URGENT', 'REMINDER', 'INFO'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilterLevel(lvl)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filterLevel === lvl
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Deadlines List */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <Card className="p-12 text-center text-xs text-slate-500">
              No deadlines found in this category.
            </Card>
          ) : (
            filtered.map((dl) => {
              const isUrgent = dl.urgencyLevel === 'URGENT';
              const isReminder = dl.urgencyLevel === 'REMINDER';

              return (
                <Card
                  key={dl.id}
                  className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                    isUrgent
                      ? 'bg-rose-50/40 border-rose-200/80'
                      : isReminder
                      ? 'bg-amber-50/40 border-amber-200/80'
                      : 'bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                        isUrgent
                          ? 'bg-rose-100 text-rose-700'
                          : isReminder
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-sky-100 text-sky-700'
                      }`}
                    >
                      <Calendar className="w-5 h-5" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-sm text-slate-900">{dl.title}</h3>
                        <Badge
                          variant={isUrgent ? 'danger' : isReminder ? 'warning' : 'primary'}
                          size="sm"
                        >
                          {dl.urgencyLevel}
                        </Badge>
                      </div>

                      <p className="text-xs text-slate-500 flex items-center gap-2">
                        <span>Due: {new Date(dl.dueDate).toLocaleDateString()}</span>
                        <span>•</span>
                        <span className="font-semibold text-slate-700">{dl.entityType}</span>
                      </p>
                    </div>
                  </div>

                  {/* Right side status & action */}
                  <div className="flex items-center gap-4 justify-between sm:justify-end">
                    <span
                      className={`text-xs font-bold ${
                        isUrgent ? 'text-rose-600' : isReminder ? 'text-amber-600' : 'text-slate-600'
                      }`}
                    >
                      {dl.daysRemaining <= 0 ? 'Due Today' : `${dl.daysRemaining} days remaining`}
                    </span>

                    {dl.actionUrl && (
                      <Link href={dl.actionUrl}>
                        <Button variant="outline" size="sm" rightIcon={<ChevronRight className="w-3.5 h-3.5" />}>
                          Open
                        </Button>
                      </Link>
                    )}
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
