'use client';

import React, { useState } from 'react';
import {
  MessageSquare,
  Sparkles,
  Award,
  CheckCircle2,
  AlertCircle,
  Send,
  Play,
  RotateCcw,
  Building2,
} from 'lucide-react';
import { StudentSidebar } from '@/components/layout/StudentSidebar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function InterviewPrepPage() {
  const [jobRole, setJobRole] = useState('Software Development Engineer');
  const [category, setCategory] = useState('TECHNICAL');
  const [difficulty, setDifficulty] = useState('MEDIUM');
  const [companyName, setCompanyName] = useState('Google');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [evaluations, setEvaluations] = useState<Record<number, any>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const handleStartSession = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsGenerating(true);
      setQuestions([]);
      setCurrentIndex(0);
      setEvaluations({});

      const res = await fetch('/api/ai/interview/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobRole, category, difficulty, companyName }),
      });
      const data = await res.json();
      if (data.questions) {
        setQuestions(data.questions);
        setSessionId(data.sessionId);
      }
    } catch (err) {
      console.error('Error generating questions:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!currentAnswer.trim() || !questions[currentIndex]) return;

    try {
      setIsEvaluating(true);
      const q = questions[currentIndex];
      const res = await fetch('/api/ai/interview/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          question: q.question,
          category: q.category,
          studentAnswer: currentAnswer,
          jobRole,
        }),
      });

      const data = await res.json();
      if (data.evaluation) {
        setEvaluations({ ...evaluations, [currentIndex]: data.evaluation });
      }
    } catch (err) {
      console.error('Error evaluating answer:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const currentQ = questions[currentIndex];
  const currentEval = evaluations[currentIndex];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
      <StudentSidebar />

      <div className="flex-1 space-y-6 min-w-0">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-sky-600" />
              AI Mock Interview Practice Simulator
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Practice role-specific technical and behavioral questions with automated rubric scoring & feedback.
            </p>
          </div>
        </div>

        {/* Configuration Setup Form */}
        <Card className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2.5">
            <Sparkles className="w-4 h-4 text-sky-600" />
            Interview Session Configuration
          </h3>

          <form onSubmit={handleStartSession} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Job Role</label>
              <input
                type="text"
                required
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Company</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Question Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 bg-white"
              >
                <option value="TECHNICAL">Technical & Architecture</option>
                <option value="BEHAVIORAL">Behavioral (STAR Method)</option>
                <option value="HR">HR & Culture Fit</option>
                <option value="SITUATIONAL">Situational & Triage</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button type="submit" variant="primary" size="md" className="w-full" isLoading={isGenerating}>
                Generate AI Questions
              </Button>
            </div>
          </form>
        </Card>

        {/* Live Q&A Interaction Panel */}
        {questions.length > 0 && currentQ && (
          <div className="space-y-6 animate-fadeIn">
            <Card className="p-6 space-y-4">
              {/* Question Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Badge variant="primary" size="md">
                    Question {currentIndex + 1} of {questions.length}
                  </Badge>
                  <Badge variant="outline" size="sm">
                    {currentQ.category}
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    disabled={currentIndex === 0}
                    onClick={() => {
                      setCurrentIndex(currentIndex - 1);
                      setCurrentAnswer('');
                    }}
                    className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <button
                    disabled={currentIndex === questions.length - 1}
                    onClick={() => {
                      setCurrentIndex(currentIndex + 1);
                      setCurrentAnswer('');
                    }}
                    className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>

              {/* Question Text */}
              <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100">
                <p className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed">
                  {currentQ.question}
                </p>
              </div>

              {/* Answer Input */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  Your Answer (Type or structure with key points):
                </label>
                <textarea
                  rows={6}
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  placeholder="Explain your approach, design decisions, trade-offs, or STAR situation..."
                  className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 font-sans"
                />
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleSubmitAnswer}
                  variant="primary"
                  size="md"
                  isLoading={isEvaluating}
                  disabled={!currentAnswer.trim()}
                  rightIcon={<Send className="w-4 h-4" />}
                >
                  Submit for AI Evaluation
                </Button>
              </div>
            </Card>

            {/* AI Evaluation Report */}
            {currentEval && (
              <Card className="p-6 space-y-5 bg-gradient-to-br from-white to-slate-50 border-emerald-200/80 animate-scaleUp">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">AI Evaluation Feedback</h3>
                    <p className="text-xs text-slate-600 mt-0.5">{currentEval.feedback}</p>
                  </div>

                  <ScoreRing score={currentEval.totalScore} size={90} strokeWidth={8} label="Total Score" />
                </div>

                {/* Criteria Sub-Scores */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <ProgressBar value={currentEval.relevanceScore} label="Relevance" size="sm" />
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <ProgressBar value={currentEval.clarityScore} label="Clarity" size="sm" />
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <ProgressBar value={currentEval.technicalScore} label="Technical Depth" size="sm" />
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <ProgressBar value={currentEval.communicationScore} label="Communication" size="sm" />
                  </div>
                </div>

                {/* Suggestions List */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                  <p className="font-bold text-slate-900">Key Suggestions to Level Up:</p>
                  <ul className="space-y-1 text-slate-600">
                    {(currentEval.suggestions || []).map((s: string, idx: number) => (
                      <li key={idx}>• {s}</li>
                    ))}
                  </ul>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
