'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Compass,
  Bell,
  User,
  LogOut,
  Sparkles,
  Briefcase,
  Layers,
  CheckCircle2,
  Menu,
  X,
  ChevronDown,
  Building2,
  GraduationCap,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { formatDateTime } from '@/lib/utils';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchSession();
  }, [pathname]);

  const fetchSession = async () => {
    try {
      const res = await fetch('/api/auth/session');
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        fetchNotifications();
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      if (data.notifications) {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch {}
  };

  const handleMarkAsRead = async (notifId?: string) => {
    try {
      await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notifId ? { notificationId: notifId } : { markAll: true }),
      });
      fetchNotifications();
    } catch {}
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      window.location.href = '/';
    } catch {}
  };

  const getPortalHome = () => {
    if (!user) return '/';
    if (user.role === 'STUDENT') return '/student/dashboard';
    if (user.role === 'RECRUITER') return '/recruiter/dashboard';
    return '/admin/dashboard';
  };

  const getRoleBadgeVariant = (role: string) => {
    if (role === 'STUDENT') return 'primary';
    if (role === 'RECRUITER') return 'success';
    return 'purple';
  };

  return (
    <header className="sticky top-7 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <Link href={getPortalHome()} className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-sky-400 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
                <Compass className="w-5 h-5 animate-spin-slow" />
              </div>
              <div>
                <span className="font-extrabold text-xl text-slate-900 tracking-tight flex items-center gap-1.5">
                  Career<span className="text-sky-600">Pilot</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-50 text-sky-600 border border-sky-200 font-bold uppercase tracking-wider">
                    AI
                  </span>
                </span>
                <p className="text-[10px] text-slate-400 font-medium leading-none hidden sm:block">
                  Placement & Career Intelligence
                </p>
              </div>
            </Link>

            {/* Main Links */}
            {!user && (
              <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-600">
                <Link href="/for-students" className="hover:text-sky-600 transition-colors">
                  For Students
                </Link>
                <Link href="/for-colleges" className="hover:text-sky-600 transition-colors">
                  For Colleges
                </Link>
                <Link href="/for-recruiters" className="hover:text-sky-600 transition-colors">
                  For Recruiters
                </Link>
                <Link href="/about" className="hover:text-sky-600 transition-colors">
                  About
                </Link>
              </nav>
            )}

            {user && (
              <nav className="hidden lg:flex items-center space-x-1 text-sm font-medium text-slate-600">
                {user.role === 'STUDENT' && (
                  <>
                    <Link
                      href="/student/dashboard"
                      className={`px-3 py-1.5 rounded-lg transition-colors ${
                        pathname === '/student/dashboard' ? 'bg-sky-50 text-sky-700 font-semibold' : 'hover:bg-slate-50'
                      }`}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/student/opportunities"
                      className={`px-3 py-1.5 rounded-lg transition-colors ${
                        pathname.startsWith('/student/opportunities') ? 'bg-sky-50 text-sky-700 font-semibold' : 'hover:bg-slate-50'
                      }`}
                    >
                      Opportunities
                    </Link>
                    <Link
                      href="/student/applications"
                      className={`px-3 py-1.5 rounded-lg transition-colors ${
                        pathname.startsWith('/student/applications') ? 'bg-sky-50 text-sky-700 font-semibold' : 'hover:bg-slate-50'
                      }`}
                    >
                      Applications
                    </Link>
                    <Link
                      href="/student/roadmap"
                      className={`px-3 py-1.5 rounded-lg transition-colors ${
                        pathname.startsWith('/student/roadmap') ? 'bg-sky-50 text-sky-700 font-semibold' : 'hover:bg-slate-50'
                      }`}
                    >
                      Roadmap
                    </Link>
                    <Link
                      href="/student/interview-prep"
                      className={`px-3 py-1.5 rounded-lg transition-colors ${
                        pathname.startsWith('/student/interview-prep') ? 'bg-sky-50 text-sky-700 font-semibold' : 'hover:bg-slate-50'
                      }`}
                    >
                      AI Mock Interview
                    </Link>
                  </>
                )}

                {user.role === 'RECRUITER' && (
                  <>
                    <Link
                      href="/recruiter/dashboard"
                      className={`px-3 py-1.5 rounded-lg transition-colors ${
                        pathname === '/recruiter/dashboard' ? 'bg-sky-50 text-sky-700 font-semibold' : 'hover:bg-slate-50'
                      }`}
                    >
                      Recruiter Dashboard
                    </Link>
                    <Link
                      href="/recruiter/opportunities"
                      className={`px-3 py-1.5 rounded-lg transition-colors ${
                        pathname.startsWith('/recruiter/opportunities') ? 'bg-sky-50 text-sky-700 font-semibold' : 'hover:bg-slate-50'
                      }`}
                    >
                      Job Postings
                    </Link>
                    <Link
                      href="/recruiter/applicants"
                      className={`px-3 py-1.5 rounded-lg transition-colors ${
                        pathname.startsWith('/recruiter/applicants') ? 'bg-sky-50 text-sky-700 font-semibold' : 'hover:bg-slate-50'
                      }`}
                    >
                      Applicant Pipeline
                    </Link>
                  </>
                )}

                {(user.role === 'PLACEMENT_OFFICER' || user.role === 'ADMIN') && (
                  <>
                    <Link
                      href="/admin/dashboard"
                      className={`px-3 py-1.5 rounded-lg transition-colors ${
                        pathname === '/admin/dashboard' ? 'bg-sky-50 text-sky-700 font-semibold' : 'hover:bg-slate-50'
                      }`}
                    >
                      Command Center
                    </Link>
                    <Link
                      href="/admin/analytics"
                      className={`px-3 py-1.5 rounded-lg transition-colors ${
                        pathname.startsWith('/admin/analytics') ? 'bg-sky-50 text-sky-700 font-semibold' : 'hover:bg-slate-50'
                      }`}
                    >
                      Placement Analytics
                    </Link>
                    <Link
                      href="/admin/students"
                      className={`px-3 py-1.5 rounded-lg transition-colors ${
                        pathname.startsWith('/admin/students') ? 'bg-sky-50 text-sky-700 font-semibold' : 'hover:bg-slate-50'
                      }`}
                    >
                      Students
                    </Link>
                    <Link
                      href="/admin/opportunities"
                      className={`px-3 py-1.5 rounded-lg transition-colors ${
                        pathname.startsWith('/admin/opportunities') ? 'bg-sky-50 text-sky-700 font-semibold' : 'hover:bg-slate-50'
                      }`}
                    >
                      Drives & Jobs
                    </Link>
                  </>
                )}
              </nav>
            )}
          </div>

          {/* Right Action Menu */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setIsNotifOpen(!isNotifOpen);
                      setIsUserMenuOpen(false);
                    }}
                    className="relative p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  {isNotifOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsNotifOpen(false)} />
                      <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-scaleUp">
                        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-slate-900">Notifications</h4>
                            {unreadCount > 0 && <Badge variant="danger" size="sm">{unreadCount} New</Badge>}
                          </div>
                          {unreadCount > 0 && (
                            <button
                              onClick={() => handleMarkAsRead()}
                              className="text-xs text-sky-600 hover:text-sky-700 font-semibold"
                            >
                              Mark all as read
                            </button>
                          )}
                        </div>

                        <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                          {notifications.length === 0 ? (
                            <div className="p-6 text-center text-slate-400 text-xs">
                              No notifications yet
                            </div>
                          ) : (
                            notifications.map((n) => (
                              <div
                                key={n.id}
                                onClick={() => {
                                  handleMarkAsRead(n.id);
                                  if (n.actionUrl) {
                                    setIsNotifOpen(false);
                                    router.push(n.actionUrl);
                                  }
                                }}
                                className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer text-left ${
                                  !n.isRead ? 'bg-sky-50/40' : ''
                                }`}
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <p className="text-xs font-semibold text-slate-900">{n.title}</p>
                                  <span className="text-[10px] text-slate-400 whitespace-nowrap">
                                    {formatDateTime(n.createdAt)}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(!isUserMenuOpen);
                      setIsNotifOpen(false);
                    }}
                    className="flex items-center gap-2 p-1.5 pl-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs overflow-hidden">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        user.name?.charAt(0) || 'U'
                      )}
                    </div>
                    <div className="text-left hidden sm:block">
                      <p className="text-xs font-bold text-slate-800 leading-tight">{user.name}</p>
                      <p className="text-[10px] text-slate-400 leading-none capitalize">
                        {user.role.toLowerCase().replace('_', ' ')}
                      </p>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* User Dropdown */}
                  {isUserMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-slate-200 p-1.5 z-50 animate-scaleUp">
                        <div className="p-2 border-b border-slate-100 mb-1">
                          <p className="text-xs font-bold text-slate-900">{user.name}</p>
                          <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                          <div className="mt-1.5">
                            <Badge variant={getRoleBadgeVariant(user.role)} size="sm">
                              {user.role.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>

                        {user.role === 'STUDENT' && (
                          <>
                            <Link
                              href="/student/profile"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                            >
                              <User className="w-4 h-4 text-slate-400" />
                              My Profile
                            </Link>
                            <Link
                              href="/student/digital-profile"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                            >
                              <Sparkles className="w-4 h-4 text-sky-500" />
                              Verified QR Profile
                            </Link>
                          </>
                        )}

                        {user.role === 'RECRUITER' && (
                          <Link
                            href="/recruiter/company"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                          >
                            <Building2 className="w-4 h-4 text-slate-400" />
                            Company Profile
                          </Link>
                        )}

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 rounded-lg hover:bg-rose-50 transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4 text-rose-500" />
                          Sign Out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Log In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
