'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Compass, Sparkles, Lock, Mail, ArrowRight, User, Briefcase, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      if (data.user.role === 'STUDENT') {
        window.location.href = '/student/dashboard';
      } else if (data.user.role === 'RECRUITER') {
        window.location.href = '/recruiter/dashboard';
      } else {
        window.location.href = '/admin/dashboard';
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (roleType: string) => {
    setError('');
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/demo-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roleType }),
      });
      const data = await res.json();
      if (data.success && data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        throw new Error(data.error || 'Demo login failed');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-sky-400 text-white shadow-lg shadow-sky-500/20 mb-2">
            <Compass className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Welcome to CareerPilot
          </h2>
          <p className="text-xs text-slate-500">
            Sign in to access your placement intelligence portal
          </p>
        </div>

        {/* 1-Click Fast Test Drive Box */}
        <Card className="bg-gradient-to-b from-sky-50/70 to-white border-sky-200/80 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-sky-600" />
              <p className="text-xs font-bold text-slate-900">1-Click Fast Test Drive</p>
            </div>
            <Badge variant="primary" size="sm">
              Instant Access
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('STUDENT_ALEX')}
              disabled={isLoading}
              className="p-2 rounded-xl bg-white border border-sky-200 hover:border-sky-400 hover:shadow-xs text-left transition-all text-xs"
            >
              <p className="font-bold text-slate-900">Alex Rivera</p>
              <p className="text-[10px] text-sky-600 font-medium">Student (SDE Track)</p>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('STUDENT_SARAH')}
              disabled={isLoading}
              className="p-2 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-xs text-left transition-all text-xs"
            >
              <p className="font-bold text-slate-900">Sarah Chen</p>
              <p className="text-[10px] text-indigo-600 font-medium">Student (AI/Data)</p>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('RECRUITER_GOOGLE')}
              disabled={isLoading}
              className="p-2 rounded-xl bg-white border border-slate-200 hover:border-rose-400 hover:shadow-xs text-left transition-all text-xs"
            >
              <p className="font-bold text-slate-900">Google Recruiter</p>
              <p className="text-[10px] text-rose-600 font-medium">David Miller</p>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('ADMIN')}
              disabled={isLoading}
              className="p-2 rounded-xl bg-white border border-slate-200 hover:border-purple-400 hover:shadow-xs text-left transition-all text-xs"
            >
              <p className="font-bold text-slate-900">Placement Officer</p>
              <p className="text-[10px] text-purple-600 font-medium">Dr. Robert Vance</p>
            </button>
          </div>
        </Card>

        {/* Credentials Form */}
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="alex.student@careerpilot.edu"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">Password</label>
                <span className="text-[11px] text-slate-400">Demo: password123</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full mt-2"
              isLoading={isLoading}
            >
              Sign In
            </Button>
          </form>
        </Card>

        {/* Footer Link */}
        <p className="text-center text-xs text-slate-500">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-sky-600 hover:text-sky-700 font-bold">
            Create Student / Recruiter Account
          </Link>
        </p>
      </div>
    </div>
  );
}
