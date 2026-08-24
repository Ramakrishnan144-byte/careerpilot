'use client';

import React, { useState } from 'react';
import { Sparkles, User, Briefcase, ShieldAlert, ChevronDown, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function DemoSwitcher() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loadingRole, setLoadingRole] = useState<string | null>(null);

  const demoAccounts = [
    {
      id: 'STUDENT_ALEX',
      label: 'Alex Rivera',
      badge: 'Student (SDE Track)',
      detail: '8.85 CGPA • CSE • Top Match SDE',
      icon: User,
      color: 'text-sky-600 bg-sky-50',
    },
    {
      id: 'STUDENT_SARAH',
      label: 'Sarah Chen',
      badge: 'Student (AI/Data)',
      detail: '8.92 CGPA • AI & DS',
      icon: User,
      color: 'text-indigo-600 bg-indigo-50',
    },
    {
      id: 'STUDENT_PRIYA',
      label: 'Priya Sharma',
      badge: 'Student (ECE/IoT)',
      detail: '8.40 CGPA • Hardware & IoT',
      icon: User,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      id: 'RECRUITER_GOOGLE',
      label: 'David Miller',
      badge: 'Recruiter (Google)',
      detail: 'Google University Talent Lead',
      icon: Briefcase,
      color: 'text-rose-600 bg-rose-50',
    },
    {
      id: 'RECRUITER_TCS',
      label: 'Jennifer Wu',
      badge: 'Recruiter (TCS)',
      detail: 'TCS Campus Hiring Operations',
      icon: Briefcase,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      id: 'ADMIN',
      label: 'Dr. Robert Vance',
      badge: 'Placement Officer / Admin',
      detail: 'TPO Dean • University Command Center',
      icon: ShieldAlert,
      color: 'text-purple-600 bg-purple-50',
    },
  ];

  const handleSwitch = async (roleType: string) => {
    try {
      setLoadingRole(roleType);
      const res = await fetch('/api/auth/demo-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roleType }),
      });
      const data = await res.json();
      if (data.success && data.redirectUrl) {
        setIsOpen(false);
        window.location.href = data.redirectUrl;
      }
    } catch (err) {
      console.error('Demo switcher error:', err);
    } finally {
      setLoadingRole(null);
    }
  };

  return (
    <div className="bg-slate-900 text-slate-100 text-xs py-1.5 px-4 sticky top-0 z-50 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-slate-200 hidden sm:inline">
            Interactive Test Drive:
          </span>
          <span className="text-slate-400 hidden md:inline">
            Switch test accounts with 1-click
          </span>
        </div>

        {/* Quick buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {demoAccounts.slice(0, 4).map((acc) => (
            <button
              key={acc.id}
              onClick={() => handleSwitch(acc.id)}
              disabled={loadingRole !== null}
              className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700 text-[11px] font-medium whitespace-nowrap flex items-center gap-1"
            >
              {loadingRole === acc.id ? (
                <span className="inline-block w-2.5 h-2.5 border-2 border-sky-400 border-t-transparent rounded-full animate-spin"></span>
              ) : (
                acc.label
              )}
              <span className="text-slate-400 text-[10px]">({acc.badge.split(' ')[0]})</span>
            </button>
          ))}

          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="px-2.5 py-1 rounded-md bg-sky-600 hover:bg-sky-500 text-white font-medium transition-colors text-[11px] flex items-center gap-1"
            >
              <span>More Roles</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {isOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                <div className="absolute right-0 mt-2 w-72 bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-200 p-2 z-50 animate-scaleUp">
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <p className="font-bold text-xs text-slate-900">Switch Demo Role</p>
                    <p className="text-[11px] text-slate-500">Test different user workflows</p>
                  </div>
                  <div className="space-y-1 max-h-80 overflow-y-auto">
                    {demoAccounts.map((acc) => {
                      const Icon = acc.icon;
                      return (
                        <button
                          key={acc.id}
                          onClick={() => handleSwitch(acc.id)}
                          className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 text-left transition-colors"
                        >
                          <div className={`p-1.5 rounded-md ${acc.color}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-semibold text-slate-900 truncate">
                                {acc.label}
                              </p>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                                {acc.badge}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 truncate">{acc.detail}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
