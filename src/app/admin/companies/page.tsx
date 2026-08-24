'use client';

import React, { useState, useEffect } from 'react';
import { Building2, Globe, MapPin, ExternalLink, ShieldCheck } from 'lucide-react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function AdminCompaniesPage() {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/opportunities')
      .then((r) => r.json())
      .then((data) => {
        if (data.opportunities) setOpportunities(data.opportunities);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  // Extract unique companies
  const companyMap = new Map();
  for (const opp of opportunities) {
    if (!companyMap.has(opp.company.id)) {
      companyMap.set(opp.company.id, {
        ...opp.company,
        activeDrivesCount: 1,
      });
    } else {
      const existing = companyMap.get(opp.company.id);
      existing.activeDrivesCount++;
    }
  }
  const companies = Array.from(companyMap.values());

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
        <AdminSidebar />
        <div className="flex-1 bg-white rounded-2xl p-12 border border-slate-200">
          <LoadingSpinner message="Loading partner companies directory..." />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
      <AdminSidebar />

      <div className="flex-1 space-y-6 min-w-0">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="w-6 h-6 text-purple-600" />
            Campus Partner Companies & Recruiters
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Active corporate employers conducting recruitment drives on campus.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {companies.map((comp: any) => (
            <Card key={comp.id} className="p-5 space-y-3">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center font-bold text-purple-700 text-sm overflow-hidden flex-shrink-0">
                  {comp.logo ? (
                    <img src={comp.logo} alt={comp.name} className="w-full h-full object-cover" />
                  ) : (
                    comp.name.charAt(0)
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-sm text-slate-900">{comp.name}</h3>
                    <Badge variant="purple" size="sm">{comp.tier || 'TIER_1'}</Badge>
                  </div>

                  <p className="text-xs text-slate-500">{comp.industry || 'Technology & Cloud'}</p>
                  <p className="text-[11px] text-slate-400">{comp.location || 'Bangalore, India'}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span className="font-semibold text-purple-700">{comp.activeDrivesCount} Active Campus Drive(s)</span>
                {comp.website && (
                  <a href={comp.website} target="_blank" rel="noreferrer" className="text-sky-600 hover:text-sky-700 font-bold flex items-center gap-1">
                    <span>Website</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
