import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi, projectApi, userApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  FolderKanban,
  CheckCircle2,
  Clock,
  Plus,
  ArrowRight,
  Activity,
  Calendar,
  Video,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { ProgressBar, Skeleton } from '../components/common/CommonUI';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import { Avatar } from '../components/common/Avatar';
import { AnimatedCounter } from '../components/common/AnimatedCounter';
import { DashboardTicker, TickerItem } from '../components/common/DashboardTicker';
import { MediaFrame } from '../components/common/MediaFrame';
import { PageTransition } from '../components/common/PageTransition';
import { BackgroundAtmosphere } from '../components/common/BackgroundAtmosphere';
import { Link } from 'react-router-dom';
import { ProjectModal } from '../components/projects/ProjectModal';
import { MemberModal } from '../components/members/MemberModal';
import { format, formatDistanceToNow, isPast, isToday } from 'date-fns';
import { useToast } from '../context/ToastContext';

export const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      const res = await dashboardApi.getAdminDashboard();
      return res.data;
    },
  });

  const handleCreateProject = async (formData: any) => {
    try {
      await projectApi.createProject(formData);
      success('Project Created', `Initiative "${formData.name}" added to club registry.`);
      refetch();
    } catch (err: any) {
      error('Creation Failed', err.response?.data?.error || 'Failed to create project');
      throw err;
    }
  };

  const handleAddMember = async (formData: any) => {
    try {
      await userApi.createUser(formData);
      success('Member Enrolled', `Student account for "${formData.name}" created.`);
      refetch();
    } catch (err: any) {
      error('Enrollment Failed', err.response?.data?.error || 'Could not enroll member');
      throw err;
    }
  };

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 rounded-lg" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-20 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-72 rounded-lg" />
      </div>
    );
  }

  const { kpis, projectProgressList, upcomingDeadlines, recentActivities } = data;

  // Build live ticker items
  const tickerItems: TickerItem[] = [
    { id: '1', category: 'COMPLETED', label: `${kpis.completedTasks} deliverables fulfilled club-wide` },
    { id: '2', category: 'INITIATIVES', label: `${kpis.activeProjects} projects actively running` },
    { id: '3', category: 'COMMUNITY', label: `${kpis.activeMembers} student contributors enrolled` },
    { id: '4', category: 'PROGRESS', label: `Overall club completion at ${kpis.clubCompletionRate}%` },
  ];
  if (recentActivities.length > 0) {
    tickerItems.unshift({
      id: 'recent',
      category: 'LATEST UPDATE',
      label: recentActivities[0].description,
    });
  }

  return (
    <PageTransition>
      {/* Hero Dashboard Header with Background Video Atmosphere (10-20% visual intensity) */}
      <div className="relative rounded-lg border border-white/8 bg-[#0A0A0C] p-6 sm:p-8 overflow-hidden shadow-premium">
        <BackgroundAtmosphere variant="hero" showAmbientMesh={true} />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#FFDD00] font-semibold bg-[#111114] px-2 py-0.5 rounded border border-white/10">
                COMMAND CENTER • ADVISOR
              </span>
              <span className="text-[11px] font-mono text-zinc-500">
                YOUR CLUB. IN MOTION.
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F5F0] tracking-tight mt-2">
              Good morning, {user?.name?.split(' ')[0] || 'Advisor'}
            </h1>
            <p className="text-xs text-zinc-400 mt-1 max-w-xl">
              Here is what needs your attention today across active initiatives, team velocity, and milestone deliverables.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddMemberOpen(true)}
              leftIcon={<Users className="w-3.5 h-3.5" />}
            >
              Enroll Member
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsCreateProjectOpen(true)}
              leftIcon={<Plus className="w-3.5 h-3.5 text-black font-bold" />}
            >
              New Project
            </Button>
          </div>
        </div>
      </div>

      {/* Moving Marquee Ticker */}
      <DashboardTicker items={tickerItems} className="rounded-lg my-3" />

      {/* Command Center Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 py-1">
        <div className="p-4 rounded-lg bg-[#0A0A0C] border border-white/8 shadow-subtle hover:border-[#FF6814]/30 transition-all">
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-semibold">
            ACTIVE PROJECTS
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[#F5F5F0]">
              <AnimatedCounter value={kpis.activeProjects} />
            </span>
            <span className="text-xs font-mono text-zinc-500">/ {kpis.totalProjects} total</span>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-[#0A0A0C] border border-white/8 shadow-subtle hover:border-[#FF6814]/30 transition-all">
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-semibold">
            TASKS DUE
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[#F5F5F0]">
              <AnimatedCounter value={kpis.todoTasks + kpis.inProgressTasks} />
            </span>
            <span className="text-xs font-mono text-zinc-500">in flight</span>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-[#0A0A0C] border border-white/8 shadow-subtle hover:border-[#FF6814]/30 transition-all">
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-semibold">
            COMPLETED
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[#FFDD00]">
              <AnimatedCounter value={kpis.completedTasks} />
            </span>
            <span className="text-xs font-mono text-zinc-500">deliverables</span>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-[#0A0A0C] border border-white/8 shadow-subtle hover:border-[#FF6814]/30 transition-all">
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-semibold">
            PROGRESS
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[#FF6814]">
              <AnimatedCounter value={kpis.clubCompletionRate} suffix="%" />
            </span>
            {kpis.overdueTasks > 0 ? (
              <span className="text-[10px] font-mono text-rose-400 bg-rose-950/50 px-1.5 py-0.5 rounded border border-rose-800/60">
                {kpis.overdueTasks} overdue
              </span>
            ) : (
              <span className="text-[10px] font-mono text-[#FFDD00]">on track</span>
            )}
          </div>
        </div>
      </div>

      {/* Projects Table & Momentum Section */}
      <div className="rounded-lg border border-white/8 bg-[#0A0A0C] overflow-hidden shadow-subtle mt-4">
        <div className="p-5 border-b border-white/8 flex items-center justify-between bg-[#050506]">
          <div>
            <h2 className="text-sm font-bold text-[#F5F5F0] tracking-tight">
              Current Club Initiatives
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Live deliverable completion and team leadership across active technical projects.
            </p>
          </div>
          <Link
            to="/projects"
            className="text-xs font-medium text-zinc-400 hover:text-[#FF6814] flex items-center gap-1 group transition-colors"
          >
            <span>All projects</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="divide-y divide-white/5">
          {projectProgressList.map((p) => (
            <div
              key={p.id}
              className="p-4 sm:px-6 hover:bg-[#111114]/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2.5">
                  <Link
                    to={`/projects/${p.id}`}
                    className="text-sm font-semibold text-[#F5F5F0] hover:text-[#FF6814] transition-colors truncate"
                  >
                    {p.name}
                  </Link>
                  <StatusBadge status={p.status} size="sm" />
                </div>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-zinc-400 font-mono">
                  <div className="flex items-center gap-1.5">
                    <Avatar name={p.projectLead?.name} size="xs" />
                    <span className="text-zinc-300">Lead: {p.projectLead?.name || 'Unassigned'}</span>
                  </div>
                  <span>•</span>
                  <span>{p.memberCount} members</span>
                  <span>•</span>
                  <span>
                    {p.completedCount}/{p.taskCount} tasks done
                  </span>
                </div>
              </div>

              <div className="w-full sm:w-48 flex items-center gap-3 shrink-0">
                <div className="flex-1">
                  <ProgressBar progress={p.progress} size="sm" />
                </div>
                <span className="font-mono text-xs font-semibold text-[#FF6814] w-10 text-right">
                  {p.progress}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Split: Upcoming Deadlines & Recent Club Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        {/* Upcoming Deadlines Timeline */}
        <div className="rounded-lg border border-white/8 bg-[#0A0A0C] p-5 shadow-subtle">
          <div className="flex items-center justify-between pb-3 border-b border-white/8 mb-4">
            <h3 className="text-xs font-bold text-[#F5F5F0] uppercase tracking-wider flex items-center gap-2 font-mono">
              <Calendar className="w-3.5 h-3.5 text-[#FF6814]" />
              Upcoming Deliverables & Deadlines
            </h3>
            <Link
              to="/tasks"
              className="text-xs font-medium text-zinc-400 hover:text-[#FF6814] flex items-center gap-1 transition-colors"
            >
              <span>Task board</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {upcomingDeadlines.length === 0 ? (
              <p className="text-xs text-zinc-500 py-6 text-center">No upcoming deadlines scheduled.</p>
            ) : (
              upcomingDeadlines.map((t) => {
                const isOverdue = t.deadline && isPast(new Date(t.deadline)) && !isToday(new Date(t.deadline));
                return (
                  <div
                    key={t.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-[#111114]/40 hover:border-white/10 hover:bg-[#111114] transition-all text-xs"
                  >
                    <div className="min-w-0 flex-1 pr-3">
                      <p className="font-medium text-[#F5F5F0] truncate">{t.title}</p>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-zinc-400">
                        <Avatar name={t.assignedTo?.name} size="xs" />
                        <span>{t.assignedTo?.name || 'Unassigned'}</span>
                        <span>•</span>
                        <span className="truncate text-zinc-500">{t.project?.name}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <PriorityBadge priority={t.priority} size="sm" />
                      {t.deadline && (
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                            isOverdue
                              ? 'bg-rose-950/50 text-rose-400 border-rose-800/60'
                              : 'bg-[#16161A] text-zinc-300 border-white/10'
                          }`}
                        >
                          {format(new Date(t.deadline), 'MMM dd')}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Live Activity Stream */}
        <div className="rounded-lg border border-white/8 bg-[#0A0A0C] p-5 shadow-subtle">
          <div className="pb-3 border-b border-white/8 mb-4">
            <h3 className="text-xs font-bold text-[#F5F5F0] uppercase tracking-wider flex items-center gap-2 font-mono">
              <Activity className="w-3.5 h-3.5 text-[#FFDD00]" />
              Club Activity Stream
            </h3>
          </div>

          <div className="space-y-3">
            {recentActivities.length === 0 ? (
              <p className="text-xs text-zinc-500 py-6 text-center">No recent activity logged.</p>
            ) : (
              recentActivities.map((log) => (
                <div key={log.id} className="flex items-start gap-3 text-xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FF6814] mt-1.5 shrink-0 shadow-glow-orange" />
                  <div className="flex-1 min-w-0">
                    <p className="text-zinc-300 font-medium leading-snug">{log.description}</p>
                    <p className="text-[10px] font-mono text-zinc-500 mt-0.5">
                      {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Club Highlights & Workspace Media Section */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#F5F5F0] flex items-center gap-2">
              <Video className="w-4 h-4 text-[#FF6814]" />
              Club Highlights & Media Reel
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Event documentation, workshop archives, and technical project showcases.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MediaFrame
            type="video"
            src="https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-41551-large.mp4"
            poster="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80"
            title="Web Development & Cloud Bootcamp 2026"
            category="WORKSHOP RECAP"
            description="Hands-on session covering React 19 architecture and API integrations."
            aspectRatio="video"
            autoPlayMuted={false}
          />

          <MediaFrame
            type="image"
            src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80"
            title="HackFest 2026 – Hackathon Sprint"
            category="EVENT HIGHLIGHT"
            description="36-hour sprint with 300+ collegiate developers and live mentorship queues."
            aspectRatio="video"
          />

          <MediaFrame
            type="image"
            src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=80"
            title="Design System & Component Sprint"
            category="TEAM SHOWCASE"
            description="Figma tokens, accessible ARIA patterns, and Tailwind documentation portal."
            aspectRatio="video"
          />
        </div>
      </div>

      {/* Modals */}
      <ProjectModal
        isOpen={isCreateProjectOpen}
        onClose={() => setIsCreateProjectOpen(false)}
        onSubmit={handleCreateProject}
        title="Create New Project"
      />

      <MemberModal
        isOpen={isAddMemberOpen}
        onClose={() => setIsAddMemberOpen(false)}
        onSubmit={handleAddMember}
        title="Enroll New Member"
      />
    </PageTransition>
  );
};
