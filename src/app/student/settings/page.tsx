'use client';

import React, { useState } from 'react';
import { Settings, Lock, Bell, ShieldCheck, User } from 'lucide-react';
import { StudentSidebar } from '@/components/layout/StudentSidebar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function SettingsPage() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [interviewReminders, setInterviewReminders] = useState(true);
  const [driveAnnouncements, setDriveAnnouncements] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
      <StudentSidebar />

      <div className="flex-1 space-y-6 min-w-0">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-sky-600" />
            Account & Notification Settings
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your account security, notification alerts, and communication preferences.
          </p>
        </div>

        {saved && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            ✓ Preferences updated successfully!
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Notification Preferences */}
          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2.5">
              <Bell className="w-4 h-4 text-sky-600" />
              Alert Preferences
            </h3>

            <form onSubmit={handleSavePreferences} className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer">
                <div>
                  <p className="font-bold text-slate-900">Immediate Interview Reminders</p>
                  <p className="text-slate-500 text-[11px]">Receive in-app & email warnings 24 hours before interview rounds</p>
                </div>
                <input
                  type="checkbox"
                  checked={interviewReminders}
                  onChange={(e) => setInterviewReminders(e.target.checked)}
                  className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer">
                <div>
                  <p className="font-bold text-slate-900">Campus Drive Announcements</p>
                  <p className="text-slate-500 text-[11px]">Instant notifications when matching companies open registrations</p>
                </div>
                <input
                  type="checkbox"
                  checked={driveAnnouncements}
                  onChange={(e) => setDriveAnnouncements(e.target.checked)}
                  className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4"
                />
              </label>

              <Button type="submit" variant="primary" size="sm" className="w-full mt-3">
                Save Preferences
              </Button>
            </form>
          </Card>

          {/* Security & Password */}
          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2.5">
              <Lock className="w-4 h-4 text-indigo-600" />
              Security & Password
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Current Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <Button
                type="button"
                onClick={() => alert('Password updated successfully!')}
                variant="outline"
                size="sm"
                className="w-full mt-2"
              >
                Update Password
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
