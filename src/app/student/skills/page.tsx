'use client';

import React, { useState, useEffect } from 'react';
import { Code2, Plus, Trash2, CheckCircle2, Sparkles, Star } from 'lucide-react';
import { StudentSidebar } from '@/components/layout/StudentSidebar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function StudentSkillsPage() {
  const [studentSkills, setStudentSkills] = useState<any[]>([]);
  const [availableSkills, setAvailableSkills] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [skillName, setSkillName] = useState('');
  const [category, setCategory] = useState('Frontend');
  const [proficiency, setProficiency] = useState('INTERMEDIATE');
  const [yearsOfExperience, setYearsOfExperience] = useState('1.5');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/student/skills');
      const data = await res.json();
      if (data.studentSkills) setStudentSkills(data.studentSkills);
      if (data.availableSkills) setAvailableSkills(data.availableSkills);
    } catch (err) {
      console.error('Error fetching skills:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSkill = async (e?: React.FormEvent, customName?: string) => {
    if (e) e.preventDefault();
    const targetName = customName || skillName;
    if (!targetName) return;

    try {
      setIsAdding(true);
      const res = await fetch('/api/student/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skillName: targetName,
          category,
          proficiency,
          yearsOfExperience,
        }),
      });
      const data = await res.json();
      if (data.studentSkill) {
        setSkillName('');
        fetchSkills();
      }
    } catch (err) {
      console.error('Error adding skill:', err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteSkill = async (id: string) => {
    try {
      await fetch(`/api/student/skills?id=${id}`, { method: 'DELETE' });
      setStudentSkills(studentSkills.filter((s) => s.id !== id));
    } catch (err) {
      console.error('Error deleting skill:', err);
    }
  };

  const quickPicks = ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Python', 'Docker', 'System Design', 'SQL', 'FastAPI', 'AWS'];

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
        <StudentSidebar />
        <div className="flex-1 bg-white rounded-2xl p-12 border border-slate-200">
          <LoadingSpinner message="Loading your technical skill repertoire..." />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
      <StudentSidebar />

      <div className="flex-1 space-y-6 min-w-0">
        <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Technical Skills & Competencies
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Add programming languages, frameworks, and tools to boost your Priority Score match.
            </p>
          </div>
          <Badge variant="primary" size="lg">
            {studentSkills.length} Verified Skills
          </Badge>
        </div>

        {/* Add Skill Card */}
        <Card className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Plus className="w-4 h-4 text-sky-600" />
            Add New Skill to Profile
          </h3>

          <form onSubmit={(e) => handleAddSkill(e)} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div className="sm:col-span-1">
              <label className="block font-semibold text-slate-700 mb-1">Skill Name</label>
              <input
                type="text"
                required
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                placeholder="e.g. Next.js, Redis"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 bg-white"
              >
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Database">Database</option>
                <option value="Cloud/DevOps">Cloud / DevOps</option>
                <option value="AI/ML">AI & ML</option>
                <option value="Core CS">Core CS & Systems</option>
                <option value="Hardware/IoT">Hardware / IoT</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Proficiency Level</label>
              <select
                value={proficiency}
                onChange={(e) => setProficiency(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 bg-white"
              >
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
                <option value="EXPERT">Expert</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button type="submit" variant="primary" size="md" className="w-full" isLoading={isAdding}>
                Add Skill
              </Button>
            </div>
          </form>

          {/* Quick Add Suggestions */}
          <div className="pt-2 border-t border-slate-100 flex items-center gap-2 flex-wrap text-xs">
            <span className="text-slate-400 font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Quick Add:
            </span>
            {quickPicks
              .filter((qp) => !studentSkills.some((s) => s.skill.name.toLowerCase() === qp.toLowerCase()))
              .slice(0, 6)
              .map((qp) => (
                <button
                  key={qp}
                  type="button"
                  onClick={() => handleAddSkill(undefined, qp)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-700 text-[11px] font-medium transition-colors"
                >
                  + {qp}
                </button>
              ))}
          </div>
        </Card>

        {/* Current Skills List Grid */}
        <Card className="p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Code2 className="w-4 h-4 text-sky-600" />
            Your Skill Portfolio ({studentSkills.length})
          </h3>

          {studentSkills.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No skills added yet. Use the form above to add your first skill.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {studentSkills.map((sk) => (
                <div
                  key={sk.id}
                  className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/60 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="font-bold text-slate-900">{sk.skill.name}</p>
                      {sk.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-100 text-sky-700 font-bold">
                        {sk.proficiency}
                      </span>
                      <span className="text-[10px] text-slate-500">{sk.skill.category}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteSkill(sk.id)}
                    className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Remove skill"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
