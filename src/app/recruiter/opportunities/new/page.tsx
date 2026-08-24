'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlusCircle, Save, Sparkles, Building2, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { RecruiterSidebar } from '@/components/layout/RecruiterSidebar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function NewOpportunityPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [jobRole, setJobRole] = useState('Software Engineer');
  const [jobType, setJobType] = useState('FULL_TIME');
  const [workMode, setWorkMode] = useState('HYBRID');
  const [location, setLocation] = useState('Bangalore, India');
  const [salaryPackage, setSalaryPackage] = useState('20 - 28 LPA');
  const [minCgpa, setMinCgpa] = useState('7.5');
  const [maxBacklogsAllowed, setMaxBacklogsAllowed] = useState('0');
  const [allowedDepartments, setAllowedDepartments] = useState('CSE,IT,AI_DS,ECE');
  const [allowedGraduationYears, setAllowedGraduationYears] = useState('2025,2026');
  const [applicationDeadline, setApplicationDeadline] = useState('2026-09-15');
  const [selectionProcess, setSelectionProcess] = useState('1. Online Assessment -> 2. Technical Rounds -> 3. HR Interview');
  const [skillsInput, setSkillsInput] = useState('React, TypeScript, Node.js, PostgreSQL, System Design');
  const [description, setDescription] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const skillNames = skillsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await fetch('/api/recruiter/opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          jobRole,
          jobType,
          workMode,
          location,
          salaryPackage,
          minCgpa,
          maxBacklogsAllowed,
          allowedDepartments,
          allowedGraduationYears,
          applicationDeadline,
          selectionProcess,
          skillNames,
          description,
          responsibilities,
        }),
      });

      const data = await res.json();
      if (data.opportunity) {
        router.push('/recruiter/opportunities');
      } else {
        alert(data.error || 'Failed to create opportunity');
      }
    } catch (err) {
      console.error('Create opp error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
      <RecruiterSidebar />

      <div className="flex-1 space-y-6 min-w-0">
        <Link
          href="/recruiter/opportunities"
          className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-sky-600 font-semibold"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Opportunities</span>
        </Link>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <PlusCircle className="w-6 h-6 text-sky-600" />
            Publish Campus Recruitment Opportunity
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure job description, deterministic eligibility policies, and required skill competencies.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          {/* Section 1: Role Overview */}
          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2.5">
              1. Opportunity Basics
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Opportunity Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Software Development Engineer (SDE I)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Job Role Category</label>
                <input
                  type="text"
                  required
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Compensation / Package</label>
                <input
                  type="text"
                  required
                  value={salaryPackage}
                  onChange={(e) => setSalaryPackage(e.target.value)}
                  placeholder="e.g. 20 - 28 LPA"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Job Type</label>
                <select
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 bg-white"
                >
                  <option value="FULL_TIME">Full Time (FTE)</option>
                  <option value="INTERNSHIP">Internship</option>
                  <option value="INTERN_TO_FTE">Intern to FTE (PPO)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Work Mode</label>
                <select
                  value={workMode}
                  onChange={(e) => setWorkMode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 bg-white"
                >
                  <option value="HYBRID">Hybrid</option>
                  <option value="REMOTE">Remote</option>
                  <option value="ON_SITE">On-Site</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Location</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Job Description</label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Overview of the engineering responsibilities and project scope..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </Card>

          {/* Section 2: Deterministic Eligibility Criteria */}
          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2.5">
              2. Deterministic Eligibility Rules
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Min CGPA Cutoff</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={minCgpa}
                  onChange={(e) => setMinCgpa(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Max Active Backlogs</label>
                <input
                  type="number"
                  required
                  value={maxBacklogsAllowed}
                  onChange={(e) => setMaxBacklogsAllowed(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Allowed Departments</label>
                <input
                  type="text"
                  required
                  value={allowedDepartments}
                  onChange={(e) => setAllowedDepartments(e.target.value)}
                  placeholder="e.g. CSE,IT,AI_DS,ECE"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Application Deadline</label>
                <input
                  type="date"
                  required
                  value={applicationDeadline}
                  onChange={(e) => setApplicationDeadline(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Required Technical Skills (Comma-separated)
              </label>
              <input
                type="text"
                required
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                placeholder="e.g. React, TypeScript, Node.js, PostgreSQL, Docker"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Selection Workflow Stages</label>
              <input
                type="text"
                value={selectionProcess}
                onChange={(e) => setSelectionProcess(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </Card>

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Publish Job Drive
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
