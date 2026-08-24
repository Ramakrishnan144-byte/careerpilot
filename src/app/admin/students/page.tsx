'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, Search, Download, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/team-finder')
      .then((r) => r.json())
      .then((data) => {
        if (data.peerMatches) {
          const all = data.peerMatches.map((m: any) => m.candidate);
          setStudents(all);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.departmentName && s.departmentName.toLowerCase().includes(search.toLowerCase())) ||
      (s.targetJobRole && s.targetJobRole.toLowerCase().includes(search.toLowerCase()))
  );

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Name,Department,Graduation Year,Target Role\n' +
      students.map((s) => `"${s.name}","${s.departmentName || 'Engineering'}","${s.graduationYear}","${s.targetJobRole || 'SDE'}"`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'careerpilot_student_roster.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
        <AdminSidebar />
        <div className="flex-1 bg-white rounded-2xl p-12 border border-slate-200">
          <LoadingSpinner message="Loading student roster directory..." />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
      <AdminSidebar />

      <div className="flex-1 space-y-6 min-w-0">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Users className="w-6 h-6 text-purple-600" />
              Institutional Student Directory
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified student profiles, verified skill portfolios, and public credentials.
            </p>
          </div>

          <Button onClick={handleExportCSV} variant="outline" size="sm" leftIcon={<Download className="w-4 h-4" />}>
            Export Roster (CSV)
          </Button>
        </div>

        {/* Search Bar */}
        <Card className="p-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search students by name, branch, or target role..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </Card>

        {/* Students Table */}
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">Student Name</th>
                  <th className="p-4">Department & Batch</th>
                  <th className="p-4">Target Job Role</th>
                  <th className="p-4">Verified Skills</th>
                  <th className="p-4 text-right">Digital Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-xs">
                          {s.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{s.name}</p>
                          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> Verified Student
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-slate-800">{s.departmentName}</p>
                      <p className="text-[11px] text-slate-500">Batch of {s.graduationYear}</p>
                    </td>
                    <td className="p-4 font-semibold text-slate-700">{s.targetJobRole || 'Software Engineer'}</td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {(s.skills || []).slice(0, 3).map((sk: string) => (
                          <span key={sk} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/p/${s.publicProfileSlug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-sky-600 hover:text-sky-700 font-bold"
                      >
                        <span>View QR Profile</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
