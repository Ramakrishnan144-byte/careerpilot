'use client';

import React, { useState, useEffect } from 'react';
import { Lightbulb, Sparkles, Code2, Award, CheckCircle2, Filter } from 'lucide-react';
import { StudentSidebar } from '@/components/layout/StudentSidebar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function ProjectIdeasPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [difficulty, setDifficulty] = useState('ALL');
  const [skillsUsed, setSkillsUsed] = useState<string[]>([]);
  const [targetRole, setTargetRole] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, [difficulty]);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/ai/project-recommendations?difficulty=${difficulty}`);
      const data = await res.json();
      if (data.projects) {
        setProjects(data.projects);
        setSkillsUsed(data.skillsUsed || []);
        setTargetRole(data.targetRole || '');
      }
    } catch (err) {
      console.error('Error fetching project ideas:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
        <StudentSidebar />
        <div className="flex-1 bg-white rounded-2xl p-12 border border-slate-200">
          <LoadingSpinner message="Generating tailored project recommendations for your skill stack..." />
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
              <Lightbulb className="w-6 h-6 text-amber-500" />
              Skill-Tailored Project Recommendations
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              High-impact portfolio projects tailored to your current skills and target role ({targetRole || 'Software Engineer'}).
            </p>
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            {['ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  difficulty === d
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="space-y-4">
          {projects.map((proj, idx) => (
            <Card key={idx} className="p-6 space-y-4 hover:border-sky-300 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{proj.title}</h3>
                    <Badge
                      variant={
                        proj.difficulty === 'ADVANCED'
                          ? 'purple'
                          : proj.difficulty === 'INTERMEDIATE'
                          ? 'primary'
                          : 'success'
                      }
                      size="sm"
                    >
                      {proj.difficulty}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{proj.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                  <p className="font-bold text-slate-900">Suggested Architecture & Tech Stack:</p>
                  <p className="text-slate-600 font-mono text-[11px]">{proj.suggestedTechStack}</p>

                  <div className="pt-2">
                    <p className="font-bold text-slate-900 mb-1">Resume Value:</p>
                    <p className="text-slate-600 italic">&quot;{proj.resumeValue}&quot;</p>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                  <p className="font-bold text-slate-900">Core Learning Outcomes:</p>
                  <ul className="space-y-1 text-slate-600">
                    {(proj.learningOutcomes || []).map((outcome: string, oIdx: number) => (
                      <li key={oIdx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{outcome}</span>
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
  );
}
