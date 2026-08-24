'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Sparkles,
  Plus,
  CheckCircle2,
  ExternalLink,
  Code2,
  Send,
  UserPlus,
} from 'lucide-react';
import { StudentSidebar } from '@/components/layout/StudentSidebar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function TeamFinderPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newRoles, setNewRoles] = useState('');
  const [newTechStack, setNewTechStack] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [joiningId, setJoiningId] = useState<string | null>(null);

  useEffect(() => {
    fetchTeamData();
  }, []);

  const fetchTeamData = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/team-finder');
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Error fetching team finder data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const res = await fetch('/api/team-finder/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          description: newDescription,
          neededRoles: newRoles,
          techStack: newTechStack,
        }),
      });
      const json = await res.json();
      if (json.listing) {
        setIsCreateOpen(false);
        setNewTitle('');
        setNewDescription('');
        setNewRoles('');
        setNewTechStack('');
        fetchTeamData();
      }
    } catch (err) {
      console.error('Error creating listing:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleJoinListing = async (listingId: string) => {
    try {
      setJoiningId(listingId);
      const res = await fetch(`/api/team-finder/${listingId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'Collaborator' }),
      });
      const json = await res.json();
      if (json.success) {
        fetchTeamData();
      } else {
        alert(json.error || 'Failed to join team');
      }
    } catch (err) {
      console.error('Join error:', err);
    } finally {
      setJoiningId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
        <StudentSidebar />
        <div className="flex-1 bg-white rounded-2xl p-12 border border-slate-200">
          <LoadingSpinner message="Finding complementary peer matches..." />
        </div>
      </div>
    );
  }

  const { listings, peerMatches } = data || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
      <StudentSidebar />

      <div className="flex-1 space-y-8 min-w-0">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Users className="w-6 h-6 text-purple-600" />
              Complementary Team & Peer Finder
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Discover classmates with complementary skill stacks for capstones, hackathons, and research projects.
            </p>
          </div>

          <Button
            onClick={() => setIsCreateOpen(true)}
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Post Project Team Pitch
          </Button>
        </div>

        {/* AI Complementary Peer Recommendations */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-600" />
              Algorithmic Complementary Peer Matches
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(peerMatches || []).map((match: any) => {
              const c = match.candidate;
              return (
                <Card key={c.id} className="p-5 space-y-3 bg-gradient-to-br from-white to-slate-50">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs overflow-hidden">
                        {c.avatar ? (
                          <img src={c.avatar} alt={c.name} className="w-full h-full object-cover" />
                        ) : (
                          c.name.charAt(0)
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{c.name}</h4>
                        <p className="text-[11px] text-slate-500">{c.departmentName} • Class of {c.graduationYear}</p>
                      </div>
                    </div>

                    <Badge variant="purple" size="sm">
                      ⚡ {match.compatibilityScore}% Compatibility
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed italic">
                    &quot;{match.collaborationRationale}&quot;
                  </p>

                  <div className="space-y-1 text-xs">
                    <p className="text-slate-400 text-[10px] font-bold uppercase">Complementary Skills:</p>
                    <div className="flex flex-wrap gap-1">
                      {match.complementarySkills.map((sk: string) => (
                        <span key={sk} className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[11px] font-semibold">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-500 font-medium truncate max-w-[200px]">
                      Idea: {match.suggestedProjectTheme}
                    </span>
                    <Link
                      href={`/p/${c.publicProfileSlug}`}
                      target="_blank"
                      className="text-sky-600 hover:text-sky-700 font-bold flex items-center gap-1"
                    >
                      <span>View Profile</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Open Project Listings */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Code2 className="w-4 h-4 text-emerald-600" />
            Active Student Capstone & Hackathon Teams ({listings?.length || 0})
          </h2>

          <div className="space-y-4">
            {(listings || []).map((list: any) => (
              <Card key={list.id} className="p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-900">{list.title}</h3>
                    <p className="text-xs text-slate-500">
                      Initiated by <span className="font-semibold text-slate-700">{list.creator.user.name}</span> •{' '}
                      {list.members.length} team member(s) confirmed
                    </p>
                  </div>

                  <Button
                    onClick={() => handleJoinListing(list.id)}
                    variant="outline"
                    size="sm"
                    isLoading={joiningId === list.id}
                    leftIcon={<UserPlus className="w-4 h-4" />}
                  >
                    Join Project
                  </Button>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{list.description}</p>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="font-semibold text-slate-700">Looking for Roles: </span>
                    <span className="text-sky-700 font-bold">{list.neededRoles}</span>
                  </div>
                  {list.techStack && (
                    <div className="text-slate-500 text-[11px]">
                      Stack: <span className="font-medium text-slate-700">{list.techStack}</span>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Create Project Modal */}
        <Modal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          title="Post Project Team Pitch"
          description="Find collaborators for capstone projects, research, or hackathons."
        >
          <form onSubmit={handleCreateListing} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Project Title</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Distributed Real-Time Edge Analytics Engine"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Project Description</label>
              <textarea
                rows={3}
                required
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Describe project goals, problem statement, and expected deliverable..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Needed Roles / Skill Profiles</label>
              <input
                type="text"
                required
                value={newRoles}
                onChange={(e) => setNewRoles(e.target.value)}
                placeholder="e.g. Frontend React Engineer, ML Pipeline Specialist"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Proposed Tech Stack</label>
              <input
                type="text"
                value={newTechStack}
                onChange={(e) => setNewTechStack(e.target.value)}
                placeholder="e.g. Next.js, FastAPI, PostgreSQL, PyTorch"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <Button type="submit" variant="primary" size="md" className="w-full" isLoading={isSubmitting}>
              Publish Team Pitch
            </Button>
          </form>
        </Modal>
      </div>
    </div>
  );
}
