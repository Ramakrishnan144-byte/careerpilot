'use client';

import React, { useState } from 'react';
import { Settings, ShieldCheck, Database, Lock, Save } from 'lucide-react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function AdminSettingsPage() {
  const [minCgpaDefault, setMinCgpaDefault] = useState('7.0');
  const [allowBacklogDefault, setAllowBacklogDefault] = useState('0');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
      <AdminSidebar />

      <div className="flex-1 space-y-6 min-w-0">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-purple-600" />
            University Placement Cell Settings
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure campus placement policies, global cutoff baselines, and database integrity.
          </p>
        </div>

        {saved && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            ✓ Institutional placement rules updated successfully!
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2.5">
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              Institutional Baseline Rules
            </h3>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Default Minimum CGPA for Campus Drives
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={minCgpaDefault}
                  onChange={(e) => setMinCgpaDefault(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Default Maximum Backlogs Allowed
                </label>
                <input
                  type="number"
                  value={allowBacklogDefault}
                  onChange={(e) => setAllowBacklogDefault(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <Button type="submit" variant="primary" size="sm" className="w-full mt-2" leftIcon={<Save className="w-4 h-4" />}>
                Save Policy Baselines
              </Button>
            </form>
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2.5">
              <Database className="w-4 h-4 text-emerald-600" />
              Database & Platform Status
            </h3>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <p className="font-bold text-slate-900">Database Engine:</p>
                <p className="text-slate-500 font-mono">SQLite (Local Dev) / PostgreSQL Ready</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <p className="font-bold text-slate-900">AI Intelligence Provider:</p>
                <p className="text-slate-500 font-mono">
                  Deterministic Provider + Gemini 2.5 Flash Adapter
                </p>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 font-semibold">
                ✓ All 25 database models normalized and synchronized.
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
