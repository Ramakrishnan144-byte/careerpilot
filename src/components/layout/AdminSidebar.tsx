'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BarChart3,
  Users,
  Building2,
  Briefcase,
  Layers,
  GraduationCap,
  Bell,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function AdminSidebar() {
  const pathname = usePathname();

  const navigation = [
    { name: 'Command Center', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Placement Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Student Directory', href: '/admin/students', icon: Users },
    { name: 'Partner Companies', href: '/admin/companies', icon: Building2 },
    { name: 'Campus Drives / Jobs', href: '/admin/opportunities', icon: Briefcase },
    { name: 'Master Applications', href: '/admin/applications', icon: Layers },
    { name: 'Departments & Stats', href: '/admin/departments', icon: GraduationCap },
    { name: 'Broadcast Notification', href: '/admin/notifications', icon: Bell },
    { name: 'Platform Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 flex-shrink-0 hidden md:block">
      <div className="sticky top-24 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-3.5 space-y-1">
        <div className="px-3 py-2 border-b border-slate-100 mb-2">
          <p className="text-xs font-bold text-slate-900">Placement Cell (TPO)</p>
          <p className="text-[10px] text-slate-400">Institutional Administration</p>
        </div>
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2.5 text-xs font-medium rounded-xl transition-all',
                isActive
                  ? 'bg-purple-50 text-purple-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              )}
            >
              <Icon className={cn('w-4 h-4', isActive ? 'text-purple-600' : 'text-slate-400')} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
