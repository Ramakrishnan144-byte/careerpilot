'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  QrCode,
  ShieldCheck,
  Globe,
  ExternalLink,
  Copy,
  Check,
  Save,
  Eye,
  Lock,
} from 'lucide-react';
import { StudentSidebar } from '@/components/layout/StudentSidebar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function DigitalProfilePage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [visibility, setVisibility] = useState('PUBLIC');
  const [isDiscoverable, setIsDiscoverable] = useState(true);
  const [customSlug, setCustomSlug] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/digital-profile');
      const json = await res.json();
      if (json.profile) {
        setData(json);
        setVisibility(json.profile.profileVisibility || 'PUBLIC');
        setIsDiscoverable(json.profile.isDiscoverable ?? true);
        setCustomSlug(json.profile.publicProfileSlug || '');
      }
    } catch (err) {
      console.error('Error fetching digital profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await fetch('/api/digital-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileVisibility: visibility,
          isDiscoverable,
          customSlug,
        }),
      });
      fetchProfile();
      alert('Profile privacy settings updated!');
    } catch (err) {
      console.error('Error saving settings:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const copyToClipboard = () => {
    if (data?.publicUrl) {
      navigator.clipboard.writeText(data.publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
        <StudentSidebar />
        <div className="flex-1 bg-white rounded-2xl p-12 border border-slate-200">
          <LoadingSpinner message="Generating your Verified Digital Student Credentials..." />
        </div>
      </div>
    );
  }

  const { profile, publicUrl, qrCodeDataUrl } = data || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
      <StudentSidebar />

      <div className="flex-1 space-y-6 min-w-0">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <QrCode className="w-6 h-6 text-sky-600" />
              Verified Digital Student Profile & QR Pass
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Share your verified academic credentials, verified skills, and portfolio projects with recruiters via URL or QR code.
            </p>
          </div>

          <Link href={`/p/${profile?.publicProfileSlug}`} target="_blank">
            <Button variant="outline" size="sm" rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>
              Open Public Profile
            </Button>
          </Link>
        </div>

        {/* QR Code Pass & Share Box */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 text-center space-y-4 bg-gradient-to-b from-slate-900 to-slate-800 text-white border-none shadow-xl">
            <Badge variant="success" size="sm" className="mx-auto">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified Pass
            </Badge>

            <div className="p-3 bg-white rounded-2xl inline-block mx-auto shadow-md">
              {qrCodeDataUrl && (
                <img src={qrCodeDataUrl} alt="Student QR Code" className="w-48 h-48 object-contain" />
              )}
            </div>

            <div className="space-y-1">
              <p className="font-bold text-sm text-white">{profile?.user?.name}</p>
              <p className="text-xs text-slate-400">
                {profile?.degree} in {profile?.department?.name || profile?.departmentName}
              </p>
            </div>
          </Card>

          {/* Privacy & Link Customizer */}
          <Card className="md:col-span-2 p-6 space-y-5">
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">Public Share Link</h3>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={publicUrl || ''}
                  className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-mono"
                />
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  size="sm"
                  leftIcon={copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                >
                  {copied ? 'Copied!' : 'Copy Link'}
                </Button>
              </div>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4 pt-4 border-t border-slate-100 text-xs">
              <h3 className="text-sm font-bold text-slate-900">Privacy & Visibility Controls</h3>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Custom URL Slug</label>
                <div className="flex items-center gap-1">
                  <span className="text-slate-400 font-mono">/p/</span>
                  <input
                    type="text"
                    value={customSlug}
                    onChange={(e) => setCustomSlug(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Profile Visibility</label>
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 bg-white"
                >
                  <option value="PUBLIC">Public (Anyone with URL or QR code)</option>
                  <option value="RECRUITERS_ONLY">Campus Recruiters Only</option>
                  <option value="PRIVATE">Private (Only You)</option>
                </select>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-800">Team Finder Discoverability</p>
                  <p className="text-[11px] text-slate-500">Allow other students to find you for capstone projects</p>
                </div>
                <input
                  type="checkbox"
                  checked={isDiscoverable}
                  onChange={(e) => setIsDiscoverable(e.target.checked)}
                  className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
                />
              </div>

              <Button type="submit" variant="primary" size="md" isLoading={isSaving} leftIcon={<Save className="w-4 h-4" />}>
                Save Settings
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
