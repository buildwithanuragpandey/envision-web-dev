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
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { ProgressBar, Skeleton } from '../components/common/CommonUI';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import { Avatar } from '../components/common/Avatar';
import { AnimatedCounter } from '../components/common/AnimatedCounter';
import { PageTransition } from '../components/common/PageTransition';
import { CinematicCarousel } from '../components/common/CinematicCarousel';
import { FramesSection } from '../components/common/FramesSection';
import { ProjectStrip } from '../components/common/ProjectStrip';
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
        <Skeleton className="h-64 rounded-lg" />
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

  // Format project strip items from live data
  const projectStripItems = projectProgressList.map((p) => ({
    id: p.id,
    name: p.name.toUpperCase(),
    category: 'INITIATIVE',
    progress: p.progress,
  }));

  return (
    <PageTransition>
      {/* 1. VISUAL HERO BANNER WITH FRAME 02 (CORRIDOR) */}
      <div className="relative rounded-lg border border-white/8 bg-[#0D0D0F] overflow-hidden shadow-premium">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* Left Hero Content (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between z-10">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#FF6A16] font-semibold bg-[#141416] px-2.5 py-1 rounded border border-white/10 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A16] animate-pulse" />
                  02 / COMMAND CENTER
                </span>
                <span className="text-[11px] font-mono text-zinc-500">
                  EXECUTIVE LAB
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#F5F2EA] tracking-tight mt-3 leading-tight">
                Good morning, {user?.name?.split(' ')[0] || 'Advisor'}
              </h1>
              <p className="text-xs sm:text-sm text-[#8C8A84] mt-2 max-w-lg leading-relaxed">
                Your club, projects, and squads in one workspace. Monitor telemetry and sprint milestones in real time.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3 pt-4 border-t border-white/5">
              <Link
                to="/projects"
                className="btn-brand text-xs px-4 py-2 rounded-lg inline-flex items-center gap-1.5 group"
              >
                <span>Open Projects</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAddMemberOpen(true)}
                leftIcon={<Users className="w-3.5 h-3.5" />}
              >
                Enroll Member
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsCreateProjectOpen(true)}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
              >
                New Project
              </Button>
            </div>
          </div>

          {/* Right Hero Frame Visual (5 cols) */}
          <div className="lg:col-span-5 relative min-h-[220px] lg:min-h-full overflow-hidden border-t lg:border-t-0 lg:border-l border-white/8">
            <img
              src="/frames/02_corridor.jpg"
              alt="ClubFlow Innovation Corridor"
              className="w-full h-full object-cover animate-slow-pan"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#0D0D0F] via-[#0D0D0F]/40 to-transparent" />

            <div className="absolute top-3 right-3 z-10">
              <span className="text-[9px] font-mono uppercase bg-[#050505]/80 text-[#FFD400] px-2 py-0.5 rounded border border-white/10 backdrop-blur-md">
                LIVE TELEMETRY
              </span>
            </div>

            <div className="absolute bottom-3 right-3 z-10">
              <span className="text-[10px] font-mono text-zinc-400 bg-[#050505]/80 px-2 py-0.5 rounded border border-white/10 backdrop-blur-md">
                FRAME 02 • CORRIDOR
              </span>
            </div>
          </div>
        </div>

        {/* Travelling Light Line */}
        <div className="absolute top-0 left-0 right-0 h-[1.5px] overflow-hidden z-20 pointer-events-none">
          <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-[#FF6A16] to-transparent animate-travel-line opacity-80" />
        </div>
      </div>

      {/* 2. COMPACT ACTIVITY STRIP */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-lg bg-[#0D0D0F] border border-white/8 shadow-subtle hover:border-[#FF6A16]/30 transition-all">
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-semibold">
            ACTIVE PROJECTS
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[#F5F2EA]">
              <AnimatedCounter value={kpis.activeProjects} />
            </span>
            <span className="text-xs font-mono text-zinc-500">/ {kpis.totalProjects} total</span>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-[#0D0D0F] border border-white/8 shadow-subtle hover:border-[#FF6A16]/30 transition-all">
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-semibold">
            TASKS DUE
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[#F5F2EA]">
              <AnimatedCounter value={kpis.todoTasks + kpis.inProgressTasks} />
            </span>
            <span className="text-xs font-mono text-zinc-500">in flight</span>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-[#0D0D0F] border border-white/8 shadow-subtle hover:border-[#FF6A16]/30 transition-all">
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-semibold">
            COMPLETED
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[#FFD400]">
              <AnimatedCounter value={kpis.completedTasks} />
            </span>
            <span className="text-xs font-mono text-zinc-500">deliverables</span>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-[#0D0D0F] border border-white/8 shadow-subtle hover:border-[#FF6A16]/30 transition-all">
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-semibold">
            PROGRESS
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[#FF6A16]">
              <AnimatedCounter value={kpis.clubCompletionRate} suffix="%" />
            </span>
            {kpis.overdueTasks > 0 ? (
              <span className="text-[10px] font-mono text-rose-400 bg-rose-950/50 px-1.5 py-0.5 rounded border border-rose-800/60">
                {kpis.overdueTasks} overdue
              </span>
            ) : (
              <span className="text-[10px] font-mono text-[#FFD400]">on track</span>
            )}
          </div>
        </div>
      </div>

      {/* 3. CONTINUOUS PROJECT SCROLLING STRIP */}
      <ProjectStrip items={projectStripItems} className="rounded-lg" />

      {/* 4. CINEMATIC PROJECT CAROUSEL */}
      <CinematicCarousel />

      {/* 5. CURRENT WORK: LARGE EDITORIAL PROJECT ROWS */}
      <div className="rounded-lg border border-white/8 bg-[#0D0D0F] overflow-hidden shadow-subtle">
        <div className="p-5 border-b border-white/8 flex items-center justify-between bg-[#050505]">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500 font-semibold block">
              WORK MATRIX
            </span>
            <h2 className="text-sm font-bold text-[#F5F2EA] tracking-tight mt-0.5">
              Current Club Initiatives
            </h2>
          </div>
          <Link
            to="/projects"
            className="text-xs font-medium text-zinc-400 hover:text-[#FF6A16] flex items-center gap-1 group transition-colors"
          >
            <span>All initiatives</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="divide-y divide-white/5">
          {projectProgressList.map((p) => (
            <div
              key={p.id}
              className="p-4 sm:px-6 hover:bg-[#141416]/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2.5">
                  <Link
                    to={`/projects/${p.id}`}
                    className="text-sm font-semibold text-[#F5F2EA] hover:text-[#FF6A16] transition-colors truncate"
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
                  <span>{p.memberCount} squad members</span>
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
                <span className="font-mono text-xs font-semibold text-[#FF6A16] w-10 text-right">
                  {p.progress}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. SPLIT: UPCOMING DEADLINES & ACTIVITY STREAM */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Upcoming Deadlines Timeline */}
        <div className="rounded-lg border border-white/8 bg-[#0D0D0F] p-5 shadow-subtle">
          <div className="flex items-center justify-between pb-3 border-b border-white/8 mb-4">
            <h3 className="text-xs font-bold text-[#F5F2EA] uppercase tracking-wider flex items-center gap-2 font-mono">
              <Calendar className="w-3.5 h-3.5 text-[#FF6A16]" />
              Upcoming Deliverables & Deadlines
            </h3>
            <Link
              to="/tasks"
              className="text-xs font-medium text-zinc-400 hover:text-[#FF6A16] flex items-center gap-1 transition-colors"
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
                    className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-[#141416]/40 hover:border-white/10 hover:bg-[#141416] transition-all text-xs"
                  >
                    <div className="min-w-0 flex-1 pr-3">
                      <p className="font-medium text-[#F5F2EA] truncate">{t.title}</p>
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
                              : 'bg-[#1C1C20] text-zinc-300 border-white/10'
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
        <div className="rounded-lg border border-white/8 bg-[#0D0D0F] p-5 shadow-subtle">
          <div className="pb-3 border-b border-white/8 mb-4">
            <h3 className="text-xs font-bold text-[#F5F5F0] uppercase tracking-wider flex items-center gap-2 font-mono">
              <Activity className="w-3.5 h-3.5 text-[#FFD400]" />
              Live Activity Feed
            </h3>
          </div>

          <div className="space-y-3">
            {recentActivities.length === 0 ? (
              <p className="text-xs text-zinc-500 py-6 text-center">No recent activity logged.</p>
            ) : (
              recentActivities.map((log) => (
                <div key={log.id} className="flex items-start gap-3 text-xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FF6A16] mt-1.5 shrink-0 shadow-glow-orange" />
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

      {/* 7. DEDICATED EDITORIAL "CLUB / FRAMES" SECTION */}
      <div className="pt-2">
        <FramesSection />
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
