'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Sparkles,
  Upload,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  FileCheck,
} from 'lucide-react';
import { StudentSidebar } from '@/components/layout/StudentSidebar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function ResumeAnalyzerPage() {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [selectedOppId, setSelectedOppId] = useState('');
  const [result, setResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    // Load student profile resume text if present
    fetch('/api/student/profile')
      .then((r) => r.json())
      .then((data) => {
        if (data.profile?.resumeText) {
          setResumeText(data.profile.resumeText);
        }
      })
      .catch(() => {});

    fetch('/api/opportunities')
      .then((r) => r.json())
      .then((data) => {
        if (data.opportunities) {
          setOpportunities(data.opportunities);
          if (data.opportunities[0]) {
            setSelectedOppId(data.opportunities[0].id);
            setJobDescription(data.opportunities[0].description);
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleSelectOpp = (id: string) => {
    setSelectedOppId(id);
    const opp = opportunities.find((o) => o.id === id);
    if (opp) {
      setJobDescription(`${opp.title} at ${opp.company.name}. ${opp.description}`);
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText) return;

    try {
      setIsAnalyzing(true);
      const res = await fetch('/api/ai/resume-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText,
          jobDescription,
          opportunityId: selectedOppId || undefined,
        }),
      });
      const data = await res.json();
      if (data.result) {
        setResult(data.result);
      }
    } catch (err) {
      console.error('Error analyzing resume:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveResume = async () => {
    try {
      setIsUploading(true);
      await fetch('/api/student/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: 'student_resume.txt',
          resumeText,
        }),
      });
      alert('Resume saved to your profile!');
    } catch (err) {
      console.error('Error saving resume:', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
      <StudentSidebar />

      <div className="flex-1 space-y-6 min-w-0">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <FileCheck className="w-6 h-6 text-sky-600" />
              AI Resume & ATS Match Analyzer
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Inspect your resume against live job descriptions to audit ATS keyword density and discover optimizations.
            </p>
          </div>
        </div>

        {/* Input Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Resume Text Input */}
          <Card className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-sky-600" />
                Resume Content
              </h3>
              <button
                type="button"
                onClick={handleSaveResume}
                disabled={isUploading || !resumeText}
                className="text-[11px] font-semibold text-sky-600 hover:text-sky-700 disabled:opacity-50"
              >
                {isUploading ? 'Saving...' : 'Save to Profile'}
              </button>
            </div>

            <textarea
              rows={12}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your plain text resume or Markdown content here..."
              className="w-full p-3 text-xs rounded-xl border border-slate-200 font-mono focus:ring-2 focus:ring-sky-500"
            />
          </Card>

          {/* Job Description Input & Target Selector */}
          <Card className="p-6 space-y-3">
            <h3 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Target Job Description
            </h3>

            <div className="space-y-2">
              <select
                value={selectedOppId}
                onChange={(e) => handleSelectOpp(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-sky-500"
              >
                <option value="">-- Or Select from Active Campus Drives --</option>
                {opportunities.map((opp) => (
                  <option key={opp.id} value={opp.id}>
                    {opp.company.name} — {opp.title}
                  </option>
                ))}
              </select>

              <textarea
                rows={9}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the target job description or select an active opportunity from above..."
                className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <Button
              onClick={handleAnalyze}
              variant="primary"
              size="md"
              className="w-full"
              isLoading={isAnalyzing}
              disabled={!resumeText}
            >
              Run AI ATS Analysis
            </Button>
          </Card>
        </div>

        {/* Results Card */}
        {result && (
          <Card className="p-6 space-y-6 bg-gradient-to-br from-white to-slate-50 border-sky-200/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">ATS Analysis Summary</h3>
                <p className="text-xs text-slate-600 mt-1 max-w-xl">{result.summary}</p>
              </div>

              <div className="flex items-center gap-4">
                <ScoreRing
                  score={result.matchPercentage}
                  size={95}
                  strokeWidth={8}
                  label="ATS Match"
                />
              </div>
            </div>

            {/* Matched vs Missing Keywords */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                <h4 className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Matched Keywords ({result.matchedSkills?.length || 0})
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {(result.matchedSkills || []).map((sk: string) => (
                    <span key={sk} className="px-2 py-0.5 rounded-md bg-white text-emerald-800 font-semibold border border-emerald-200">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200 space-y-2">
                <h4 className="font-bold text-rose-900 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  Missing Keywords ({result.missingSkills?.length || 0})
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {(result.missingSkills || []).map((sk: string) => (
                    <span key={sk} className="px-2 py-0.5 rounded-md bg-white text-rose-800 font-semibold border border-rose-200">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Strengths & Actionable Fixes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900">Key Strengths Demonstrated:</h4>
                <ul className="space-y-1 text-slate-600">
                  {(result.strengths || []).map((s: string, idx: number) => (
                    <li key={idx}>• {s}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900">Recommended Enhancements:</h4>
                <ul className="space-y-1 text-slate-600">
                  {(result.areasForImprovement || []).map((a: string, idx: number) => (
                    <li key={idx}>• {a}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
