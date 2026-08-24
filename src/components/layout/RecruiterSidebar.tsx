'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  Briefcase,
  PlusCircle,
  Users,
  BarChart3,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function RecruiterSidebar() {
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/recruiter/dashboard', icon: LayoutDashboard },
    { name: 'Company Profile', href: '/recruiter/company', icon: Building2 },
    { name: 'Post New Opportunity', href: '/recruiter/opportunities/new', icon: PlusCircle, highlight: true },
    { name: 'Manage Opportunities', href: '/recruiter/opportunities', icon: Briefcase },
    { name: 'Applicant Pipeline', href: '/recruiter/applicants', icon: Users },
    { name: 'Recruitment Analytics', href: '/recruiter/analytics', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 flex-shrink-0 hidden md:block">
      <div className="sticky top-24 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-3.5 space-y-1">
        <div className="px-3 py-2 border-b border-slate-100 mb-2">
          <p className="text-xs font-bold text-slate-900">Recruiter Portal</p>
          <p className="text-[10px] text-slate-400">Campus Hiring Management</p>
        </div>
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/recruiter/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2.5 text-xs font-medium rounded-xl transition-all',
                item.highlight
                  ? 'bg-sky-600 hover:bg-sky-700 text-white font-semibold shadow-sm'
                  : isActive
                  ? 'bg-sky-50 text-sky-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              )}
            >
              <Icon className={cn('w-4 h-4', item.highlight ? 'text-white' : isActive ? 'text-sky-600' : 'text-slate-400')} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
