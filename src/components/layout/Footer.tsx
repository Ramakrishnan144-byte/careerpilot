import React from 'react';
import Link from 'next/link';
import { Compass, ShieldCheck, Heart, Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Col 1: Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-sky-400 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
                <Compass className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                Career<span className="text-sky-400">Pilot</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              AI-Powered Student Career, Internship & Placement Intelligence Platform. Bridging student skill profiles, deterministic eligibility rules, transparent recommendation algorithms, and campus recruitment operations.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verified Institutional Platform Architecture</span>
            </div>
          </div>

          {/* Col 2: For Students */}
          <div>
            <h4 className="font-semibold text-slate-200 mb-3 text-xs uppercase tracking-wider">
              For Students
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/for-students" className="hover:text-sky-400 transition-colors">
                  AI Opportunity Match
                </Link>
              </li>
              <li>
                <Link href="/for-students" className="hover:text-sky-400 transition-colors">
                  Deterministic Eligibility
                </Link>
              </li>
              <li>
                <Link href="/for-students" className="hover:text-sky-400 transition-colors">
                  Skill Gap Analyzer
                </Link>
              </li>
              <li>
                <Link href="/for-students" className="hover:text-sky-400 transition-colors">
                  Personal Career Roadmap
                </Link>
              </li>
              <li>
                <Link href="/for-students" className="hover:text-sky-400 transition-colors">
                  AI Mock Interviews
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: For Colleges */}
          <div>
            <h4 className="font-semibold text-slate-200 mb-3 text-xs uppercase tracking-wider">
              For Colleges (TPO)
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/for-colleges" className="hover:text-sky-400 transition-colors">
                  Placement Command Center
                </Link>
              </li>
              <li>
                <Link href="/for-colleges" className="hover:text-sky-400 transition-colors">
                  Department Placement Analytics
                </Link>
              </li>
              <li>
                <Link href="/for-colleges" className="hover:text-sky-400 transition-colors">
                  Student Eligibility Enforcer
                </Link>
              </li>
              <li>
                <Link href="/for-colleges" className="hover:text-sky-400 transition-colors">
                  Automated Campus Drives
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: For Recruiters & Legal */}
          <div>
            <h4 className="font-semibold text-slate-200 mb-3 text-xs uppercase tracking-wider">
              Recruiters & Info
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/for-recruiters" className="hover:text-sky-400 transition-colors">
                  Campus Hiring Portal
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-sky-400 transition-colors">
                  About CareerPilot
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-sky-400 transition-colors">
                  Contact & Support
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-sky-400 transition-colors">
                  Demo Fast Login
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 CareerPilot. All rights reserved. Production-Ready University SaaS.</p>
          <div className="flex items-center gap-4 mt-2 sm:mt-0">
            <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
              Demo Mode Active
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
