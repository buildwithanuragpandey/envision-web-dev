import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi, projectApi, userApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  FolderKanban,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  ArrowRight,
  Activity,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { ProgressBar, Skeleton } from '../components/common/CommonUI';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import { AnimatedCounter } from '../components/common/AnimatedCounter';
import { DashboardTicker, TickerItem } from '../components/common/DashboardTicker';
import { PageTransition } from '../components/common/PageTransition';
import { Link } from 'react-router-dom';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { ProjectModal } from '../components/projects/ProjectModal';
import { MemberModal } from '../components/members/MemberModal';
import { format } from 'date-fns';
import { useToast } from '../context/ToastContext';
import { motion } from 'framer-motion';

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
      success('Project Created', `Project "${formData.name}" created.`);
      refetch();
    } catch (err: any) {
      error('Creation Failed', err.response?.data?.error || 'Failed to create project');
      throw err;
    }
  };

  const handleAddMember = async (formData: any) => {
    try {
      await userApi.createUser(formData);
      success('Member Added', `Account for "${formData.name}" created.`);
      refetch();
    } catch (err: any) {
      error('Failed to Add Member', err.response?.data?.error || 'Could not create member');
      throw err;
    }
  };

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-80 rounded-2xl" />
      </div>
    );
  }

  const { kpis, projectProgressList, taskStatusDistribution, upcomingDeadlines, recentActivities } = data;

  // Build live ticker items
  const tickerItems: TickerItem[] = [
    { id: '1', category: 'COMPLETED', label: `${kpis.completedTasks} tasks fulfilled club-wide` },
    { id: '2', category: 'PROJECTS', label: `${kpis.activeProjects} initiatives actively executing` },
    { id: '3', category: 'ROSTER', label: `${kpis.activeMembers} active contributors enrolled` },
    { id: '4', category: 'VELOCITY', label: `Club completion rate at ${kpis.clubCompletionRate}%` },
  ];
  if (recentActivities.length > 0) {
    tickerItems.unshift({
      id: 'recent',
      category: 'LATEST EVENT',
      label: recentActivities[0].description,
    });
  }

  return (
    <PageTransition>
      {/* Editorial Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-zinc-200/80">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-zinc-400">
            Executive Command Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight mt-1">
            Welcome back, {user?.name?.split(' ')[0] || 'Advisor'}
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Real-time deliverable velocity, team momentum, and project status across the club.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAddMemberOpen(true)}
            leftIcon={<Users className="w-3.5 h-3.5" />}
          >
            Add Member
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCreateProjectOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            New Project
          </Button>
        </div>
      </div>

      {/* Horizontal Continuous Activity Ticker */}
      <DashboardTicker items={tickerItems} className="-mx-4 sm:-mx-8 rounded-none" />

      {/* Compact Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Members */}
        <div className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-mono uppercase tracking-wider">Members</span>
            <Users className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-zinc-900">
              <AnimatedCounter value={kpis.totalMembers} />
            </span>
            <span className="text-[11px] font-mono text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
              {kpis.activeMembers} active
            </span>
          </div>
        </div>

        {/* Active Projects */}
        <div className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-mono uppercase tracking-wider">Active Projects</span>
            <FolderKanban className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-zinc-900">
              <AnimatedCounter value={kpis.activeProjects} />
            </span>
            <span className="text-[11px] font-mono text-zinc-500">
              {kpis.completedProjects} completed
            </span>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-mono uppercase tracking-wider">Club Completion</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-zinc-900">
              <AnimatedCounter value={kpis.clubCompletionRate} suffix="%" />
            </span>
            <span className="text-[11px] font-mono text-zinc-500">
              {kpis.completedTasks}/{kpis.totalTasks} tasks
            </span>
          </div>
        </div>

        {/* Pending / Overdue */}
        <div className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-mono uppercase tracking-wider">Pending Work</span>
            <Clock className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-zinc-900">
              <AnimatedCounter value={kpis.todoTasks + kpis.inProgressTasks} />
            </span>
            {kpis.overdueTasks > 0 ? (
              <span className="text-[11px] font-mono text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200/60 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {kpis.overdueTasks} overdue
              </span>
            ) : (
              <span className="text-[11px] font-mono text-emerald-600 font-medium">On schedule</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Split: Project Momentum Section (Left) & Task Breakdown (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Momentum Section */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-subtle">
          <div className="flex items-center justify-between mb-5">
            <div>
              <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-zinc-400">
                INITIATIVES
              </span>
              <h3 className="text-base font-bold text-zinc-900 tracking-tight mt-0.5">
                Project Momentum
              </h3>
            </div>
            <Link
              to="/projects"
              className="text-xs font-semibold text-zinc-900 hover:text-zinc-600 flex items-center gap-1 group"
            >
              <span>Explore all</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="space-y-4">
            {projectProgressList.map((p) => (
              <div
                key={p.id}
                className="p-4 rounded-xl border border-zinc-100 hover:border-zinc-200 hover:bg-zinc-50/60 transition-all duration-150"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/projects/${p.id}`}
                      className="text-xs font-bold text-zinc-900 hover:text-emerald-600 transition-colors truncate block"
                    >
                      {p.name}
                    </Link>
                    <div className="flex items-center gap-3 mt-1 text-[11px] text-zinc-500 font-mono">
                      <span>Lead: {p.projectLead?.name || 'Unassigned'}</span>
                      <span>•</span>
                      <span>{p.memberCount} members</span>
                      <span>•</span>
                      <span>
                        {p.completedCount}/{p.taskCount} tasks
                      </span>
                    </div>
                  </div>
                  <StatusBadge status={p.status} size="sm" />
                </div>
                <ProgressBar progress={p.progress} showText={true} size="sm" />
              </div>
            ))}
          </div>
        </div>

        {/* Task Distribution & Status Donut */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-subtle flex flex-col justify-between">
          <div>
            <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-zinc-400">
              STATUS BREAKDOWN
            </span>
            <h3 className="text-base font-bold text-zinc-900 tracking-tight mt-0.5">
              Task Distribution
            </h3>

            <div className="h-48 w-full mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskStatusDistribution}
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="count"
                  >
                    {taskStatusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#18181b',
                      border: '1px solid #27272a',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '11px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-zinc-100 text-center">
            {taskStatusDistribution.map((item) => (
              <div key={item.name} className="p-2 rounded-xl bg-zinc-50 border border-zinc-100">
                <div className="text-[10px] font-mono text-zinc-400 uppercase">{item.name}</div>
                <div className="text-sm font-bold text-zinc-900 mt-0.5">{item.count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline Deadlines & Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timeline Style Upcoming Deadlines */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-subtle">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-zinc-400">
                SCHEDULE
              </span>
              <h3 className="text-base font-bold text-zinc-900 tracking-tight mt-0.5 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-zinc-700" />
                Upcoming Deadlines
              </h3>
            </div>
            <Link
              to="/tasks"
              className="text-xs font-semibold text-zinc-900 hover:text-zinc-600 flex items-center gap-1 group"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {upcomingDeadlines.length === 0 ? (
              <p className="text-xs text-zinc-400 py-6 text-center">No upcoming deadlines.</p>
            ) : (
              upcomingDeadlines.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-zinc-100 hover:border-zinc-200 hover:bg-zinc-50/50 transition-all text-xs"
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <p className="font-semibold text-zinc-900 truncate">{t.title}</p>
                    <p className="text-[11px] text-zinc-500 truncate mt-0.5 font-mono">
                      {t.project?.name} • {t.assignedTo?.name || 'Unassigned'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <PriorityBadge priority={t.priority} size="sm" />
                    {t.deadline && (
                      <span className="text-[11px] font-mono text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200/60">
                        {format(new Date(t.deadline), 'MMM dd')}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Live Activity Stream */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-subtle">
          <div className="mb-4">
            <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-zinc-400">
              AUDIT TRAIL
            </span>
            <h3 className="text-base font-bold text-zinc-900 tracking-tight mt-0.5 flex items-center gap-2">
              <Activity className="w-4 h-4 text-zinc-700" />
              Recent Club Activity
            </h3>
          </div>

          <div className="space-y-3">
            {recentActivities.length === 0 ? (
              <p className="text-xs text-zinc-400 py-6 text-center">No recent activity logged.</p>
            ) : (
              recentActivities.map((log) => (
                <div key={log.id} className="flex items-start gap-3 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-900 mt-1.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-zinc-800 font-medium leading-snug">{log.description}</p>
                    <p className="text-[10px] font-mono text-zinc-400 mt-0.5">
                      {format(new Date(log.createdAt), 'MMM dd, h:mm a')}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
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
        title="Add New Member"
      />
    </PageTransition>
  );
};
