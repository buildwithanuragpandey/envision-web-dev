import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi, taskApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
  FolderKanban,
  CheckSquare,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  Calendar,
} from 'lucide-react';
import { ProgressBar, Skeleton } from '../components/common/CommonUI';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import { AnimatedCounter } from '../components/common/AnimatedCounter';
import { DashboardTicker, TickerItem } from '../components/common/DashboardTicker';
import { PageTransition } from '../components/common/PageTransition';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useToast } from '../context/ToastContext';
import { TaskStatus } from '../types';

export const MemberDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['member-dashboard'],
    queryFn: async () => {
      const res = await dashboardApi.getMemberDashboard();
      return res.data;
    },
  });

  const handleUpdateStatus = async (taskId: string, newStatus: TaskStatus) => {
    try {
      await taskApi.updateTaskStatus(taskId, newStatus);
      success('Status Updated', `Task status changed to ${newStatus}`);
      refetch();
    } catch (err: any) {
      error('Failed to update status', err.response?.data?.error || 'Could not update task');
    }
  };

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 rounded-2xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-80 rounded-2xl" />
      </div>
    );
  }

  const { kpis, projects, assignedTasks, upcomingTasks } = data;

  const tickerItems: TickerItem[] = [
    { id: '1', category: 'FOCUS', label: `${assignedTasks.length} total deliverables assigned to you` },
    { id: '2', category: 'COMPLETION', label: `Personal velocity at ${kpis.completionRate}%` },
    { id: '3', category: 'PROJECTS', label: `Active collaborator across ${projects.length} club squads` },
  ];

  return (
    <PageTransition>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-zinc-200/80">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-zinc-400">
            Member Workspace
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight mt-1">
            Welcome back, {user?.name?.split(' ')[0] || 'Member'}
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Track your individual project deliverables, upcoming milestones, and personal velocity.
          </p>
        </div>

        <Link
          to="/tasks"
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold rounded-xl transition-all self-start sm:self-auto shadow-sm"
        >
          <CheckSquare className="w-3.5 h-3.5" />
          Open Kanban Board
        </Link>
      </div>

      {/* Activity Ticker */}
      <DashboardTicker items={tickerItems} className="-mx-4 sm:-mx-8 rounded-none" />

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-mono uppercase tracking-wider">My Projects</span>
            <FolderKanban className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-zinc-900">
              <AnimatedCounter value={kpis.totalProjects} />
            </span>
            <span className="text-[11px] font-mono text-zinc-500">active squads</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-mono uppercase tracking-wider">Assigned Tasks</span>
            <CheckSquare className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-zinc-900">
              <AnimatedCounter value={kpis.totalTasks} />
            </span>
            <span className="text-[11px] font-mono text-emerald-600 font-semibold">
              {kpis.completedTasks} done
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-mono uppercase tracking-wider">My Velocity</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-zinc-900">
              <AnimatedCounter value={kpis.completionRate} suffix="%" />
            </span>
            <span className="text-[11px] font-mono text-zinc-500">completion rate</span>
          </div>
        </div>

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
              <span className="text-[11px] font-mono text-emerald-600 font-medium">On track</span>
            )}
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-subtle">
        <div className="flex items-center justify-between mb-5">
          <div>
            <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-zinc-400">
              PARTICIPATION
            </span>
            <h3 className="text-base font-bold text-zinc-900 tracking-tight mt-0.5">
              My Assigned Projects
            </h3>
          </div>
          <Link
            to="/projects"
            className="text-xs font-semibold text-zinc-900 hover:text-zinc-600 flex items-center gap-1 group"
          >
            <span>All projects</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.length === 0 ? (
            <p className="text-xs text-zinc-400 py-6 text-center col-span-2">
              You are not currently assigned to any projects.
            </p>
          ) : (
            projects.map((p) => (
              <div
                key={p.id}
                className="p-5 rounded-xl border border-zinc-200/80 hover:border-zinc-300 hover:bg-zinc-50/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Link
                      to={`/projects/${p.id}`}
                      className="text-sm font-bold text-zinc-900 hover:text-emerald-600 transition-colors"
                    >
                      {p.name}
                    </Link>
                    <StatusBadge status={p.status} size="sm" />
                  </div>
                  {p.description && (
                    <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed mb-3">
                      {p.description}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-zinc-100">
                  <div className="flex items-center justify-between text-xs text-zinc-600 mb-2 font-mono">
                    <span>Lead: {p.projectLead?.name || 'Faculty'}</span>
                    <span>
                      My tasks: {p.myCompletedCount}/{p.myTaskCount} ({p.myProgress}%)
                    </span>
                  </div>
                  <ProgressBar progress={p.myProgress} size="sm" />

                  <div className="mt-3 flex items-center justify-between pt-2">
                    <span className="text-[11px] font-mono text-zinc-400">
                      Overall: {p.overallProgress}%
                    </span>
                    <Link
                      to={`/projects/${p.id}`}
                      className="text-xs font-semibold text-zinc-900 hover:text-zinc-600 flex items-center gap-1"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Deliverables & Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Deliverables List */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-subtle lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-zinc-400">
                ACTIVE WORK
              </span>
              <h3 className="text-base font-bold text-zinc-900 tracking-tight mt-0.5">
                My Assigned Deliverables
              </h3>
            </div>
            <Link
              to="/tasks"
              className="text-xs font-semibold text-zinc-900 hover:text-zinc-600 flex items-center gap-1 group"
            >
              <span>Kanban Board</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {assignedTasks.length === 0 ? (
              <p className="text-xs text-zinc-400 py-8 text-center">
                No tasks currently assigned to you.
              </p>
            ) : (
              assignedTasks.map((t) => (
                <div
                  key={t.id}
                  className="p-3.5 rounded-xl border border-zinc-100 hover:border-zinc-200 hover:bg-zinc-50/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono uppercase bg-zinc-100 px-2 py-0.5 rounded text-zinc-600 truncate max-w-[150px]">
                        {t.project?.name}
                      </span>
                      <PriorityBadge priority={t.priority} size="sm" />
                      {t.deadline && (
                        <span
                          className={`text-[11px] font-mono flex items-center gap-1 ${
                            t.isOverdue
                              ? 'text-rose-600 font-bold'
                              : t.isDueToday
                              ? 'text-amber-600 font-bold'
                              : 'text-zinc-500'
                          }`}
                        >
                          <Calendar className="w-3 h-3" />
                          {format(new Date(t.deadline), 'MMM dd')}
                          {t.isOverdue && ' (Overdue)'}
                          {t.isDueToday && ' (Today)'}
                        </span>
                      )}
                    </div>
                    <p className="font-semibold text-zinc-900 text-sm">{t.title}</p>
                    {t.description && (
                      <p className="text-zinc-500 mt-0.5 line-clamp-1">{t.description}</p>
                    )}
                  </div>

                  {/* Status Toggle Control */}
                  <div className="shrink-0 self-end sm:self-center">
                    <select
                      value={t.status}
                      onChange={(e) => handleUpdateStatus(t.id, e.target.value as TaskStatus)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border outline-none cursor-pointer transition-all ${
                        t.status === 'COMPLETED'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                          : t.status === 'IN_PROGRESS'
                          ? 'bg-blue-50 text-blue-700 border-blue-300'
                          : 'bg-zinc-100 text-zinc-700 border-zinc-300'
                      }`}
                    >
                      <option value="TODO">To Do</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Due Soon Deadlines */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-subtle">
          <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-zinc-400">
            DEADLINES
          </span>
          <h3 className="text-base font-bold text-zinc-900 tracking-tight mt-0.5 flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-zinc-700" />
            Due Soon
          </h3>

          <div className="space-y-3">
            {upcomingTasks.length === 0 ? (
              <p className="text-xs text-zinc-400 py-6 text-center">No upcoming deadlines.</p>
            ) : (
              upcomingTasks.map((t) => (
                <div
                  key={t.id}
                  className="p-3 rounded-xl border border-zinc-100 hover:border-zinc-200 transition-all text-xs"
                >
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <p className="font-semibold text-zinc-900 leading-snug">{t.title}</p>
                    <PriorityBadge priority={t.priority} size="sm" />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-zinc-500 mt-2 pt-2 border-t border-zinc-100 font-mono">
                    <span className="truncate max-w-[130px]">{t.project?.name}</span>
                    {t.deadline && (
                      <span className="font-semibold text-zinc-700">
                        {format(new Date(t.deadline), 'MMM dd')}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
