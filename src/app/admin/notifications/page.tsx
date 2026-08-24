'use client';

import React, { useState } from 'react';
import { Bell, Send, CheckCircle2, AlertCircle, Users } from 'lucide-react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function AdminBroadcastNotificationsPage() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetDepartmentCode, setTargetDepartmentCode] = useState('ALL');
  const [level, setLevel] = useState('INFO');
  const [category, setCategory] = useState('ANNOUNCEMENT');
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSending(true);
      setSentSuccess(false);
      const res = await fetch('/api/admin/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          message,
          targetDepartmentCode,
          level,
          category,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSentSuccess(true);
        setTitle('');
        setMessage('');
        setTimeout(() => setSentSuccess(false), 4000);
      }
    } catch (err) {
      console.error('Error broadcasting notification:', err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
      <AdminSidebar />

      <div className="flex-1 space-y-6 min-w-0">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Bell className="w-6 h-6 text-purple-600" />
            Campus Broadcast Notifications
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Broadcast urgent alerts, drive deadlines, or general announcements to all students or specific departments.
          </p>
        </div>

        {sentSuccess && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Campus broadcast alert successfully dispatched to student notification centers!</span>
          </div>
        )}

        <Card className="p-6 space-y-4">
          <form onSubmit={handleBroadcast} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Broadcast Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Google Campus Drive Registration Deadline Approaching"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Department Scope</label>
                <select
                  value={targetDepartmentCode}
                  onChange={(e) => setTargetDepartmentCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 bg-white"
                >
                  <option value="ALL">All Departments (Campus-wide)</option>
                  <option value="CSE">CSE Only</option>
                  <option value="IT">IT Only</option>
                  <option value="AI_DS">AI & DS Only</option>
                  <option value="ECE">ECE Only</option>
                  <option value="ME">ME Only</option>
                  <option value="MBA">MBA Only</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Urgency Level</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 bg-white"
                >
                  <option value="INFO">Info (Normal)</option>
                  <option value="REMINDER">Reminder (Important)</option>
                  <option value="URGENT">Urgent (Critical Countdown)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 bg-white"
                >
                  <option value="ANNOUNCEMENT">Campus Announcement</option>
                  <option value="DRIVE_UPDATE">Drive Update</option>
                  <option value="DEADLINE">Deadline Alert</option>
                  <option value="POLICY">Institutional Policy</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Alert Message</label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type the message content that will appear in students' notification dropdowns and alert lists..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSending}
                rightIcon={<Send className="w-4 h-4" />}
              >
                Send Campus Broadcast
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
