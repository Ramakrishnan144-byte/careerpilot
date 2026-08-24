'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Sparkles,
  Layers,
  MapPin,
  TrendingUp,
  FileText,
  MessageSquare,
  Award,
  Clock,
  Users,
  QrCode,
  GitCompare,
  Lightbulb,
  Bell,
  Settings,
  Briefcase,
  BookOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function StudentSidebar() {
  const pathname = usePathname();

  const navigation = [
    {
      group: 'Core Placement',
      items: [
        { name: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
        { name: 'AI Opportunity Match', href: '/student/opportunities', icon: Sparkles, badge: 'Smart' },
        { name: 'Application Tracker', href: '/student/applications', icon: Layers },
        { name: 'Personal Roadmap', href: '/student/roadmap', icon: MapPin },
        { name: 'Skill Gap Analyzer', href: '/student/skill-gaps', icon: TrendingUp },
      ],
    },
    {
      group: 'Career Intelligence',
      items: [
        { name: 'AI Resume Analyzer', href: '/student/resume', icon: FileText },
        { name: 'AI Mock Interview', href: '/student/interview-prep', icon: MessageSquare },
        { name: 'Career Readiness Score', href: '/student/career-score', icon: Award },
        { name: 'Smart Deadlines', href: '/student/deadlines', icon: Clock },
      ],
    },
    {
      group: 'Collaboration & Discovery',
      items: [
        { name: 'Team / Peer Finder', href: '/student/team-finder', icon: Users },
        { name: 'Verified Digital Profile', href: '/student/digital-profile', icon: QrCode },
        { name: 'Company Comparison', href: '/student/company-comparison', icon: GitCompare },
        { name: 'Project Recommendations', href: '/student/project-ideas', icon: Lightbulb },
      ],
    },
    {
      group: 'Account',
      items: [
        { name: 'My Profile & Skills', href: '/student/profile', icon: BookOpen },
        { name: 'Notifications', href: '/student/notifications', icon: Bell },
        { name: 'Settings', href: '/student/settings', icon: Settings },
      ],
    },
  ];

  return (
    <aside className="w-64 flex-shrink-0 hidden md:block">
      <div className="sticky top-24 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-3.5 space-y-5">
        {navigation.map((group) => (
          <div key={group.group}>
            <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              {group.group}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== '/student/dashboard' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl transition-all',
                      isActive
                        ? 'bg-sky-50 text-sky-700 font-semibold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={cn('w-4 h-4', isActive ? 'text-sky-600' : 'text-slate-400')} />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 text-[9px] font-bold bg-sky-100 text-sky-700 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
