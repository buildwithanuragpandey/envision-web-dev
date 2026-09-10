import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi, taskApi } from '../api/client';
import {
  FolderKanban,
  CheckSquare,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  ArrowUpRight,
  Calendar,
} from 'lucide-react';
import { ProgressBar, Skeleton } from '../components/common/CommonUI';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useToast } from '../context/ToastContext';
import { TaskStatus } from '../types';

export const MemberDashboardPage: React.FC = () => {
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-80 rounded-2xl" />
      </div>
    );
  }

  const { kpis, projects, assignedTasks, upcomingTasks } = data;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Member Dashboard</h2>
          <p className="text-xs text-slate-500 mt-1">
            Overview of your project assignments, pending deliverables, and upcoming milestones.
          </p>
        </div>
        <Link
          to="/tasks"
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all self-start sm:self-auto"
        >
          <CheckSquare className="w-4 h-4" />
          Open Task Board
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* My Projects */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">My Projects</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <FolderKanban className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900">{kpis.totalProjects}</span>
            <span className="text-xs text-slate-500 font-medium">active memberships</span>
          </div>
        </div>

        {/* My Tasks Total */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Assigned Tasks</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <CheckSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900">{kpis.totalTasks}</span>
            <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-md">
              {kpis.completedTasks} completed
            </span>
          </div>
        </div>

        {/* Completion % */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">My Completion Rate</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900">{kpis.completionRate}%</span>
            <span className="text-xs text-slate-500 font-medium">
              {kpis.completedTasks}/{kpis.totalTasks} done
            </span>
          </div>
        </div>

        {/* Pending / Overdue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Work</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900">
              {kpis.todoTasks + kpis.inProgressTasks}
            </span>
            {kpis.overdueTasks > 0 ? (
              <span className="text-xs text-rose-600 font-medium bg-rose-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {kpis.overdueTasks} overdue
              </span>
            ) : (
              <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-md">
                On track
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-subtle">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">My Projects</h3>
            <p className="text-xs text-slate-500">Projects where you are an active collaborator</p>
          </div>
          <Link
            to="/projects"
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            All projects <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center col-span-2">
              You are not currently assigned to any projects.
            </p>
          ) : (
            projects.map((p) => (
              <div
                key={p.id}
                className="p-5 rounded-xl border border-slate-200 hover:border-brand-500/40 hover:shadow-card transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Link
                      to={`/projects/${p.id}`}
                      className="text-sm font-bold text-slate-900 hover:text-brand-600 transition-colors"
                    >
                      {p.name}
                    </Link>
                    <StatusBadge status={p.status} size="sm" />
                  </div>
                  {p.description && (
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
                      {p.description}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-medium">
                    <span>Lead: {p.projectLead?.name || 'Faculty Advisor'}</span>
                    <span>
                      My tasks: {p.myCompletedCount}/{p.myTaskCount} ({p.myProgress}%)
                    </span>
                  </div>
                  <ProgressBar progress={p.myProgress} size="md" />

                  <div className="mt-3 flex items-center justify-between pt-2">
                    <span className="text-[11px] text-slate-400">
                      Overall Project: {p.overallProgress}% complete
                    </span>
                    <Link
                      to={`/projects/${p.id}`}
                      className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                    >
                      View Details <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Assigned Tasks & Deadlines Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Assigned Tasks List */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-subtle lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">My Assigned Deliverables</h3>
              <p className="text-xs text-slate-500">Quickly update status as you make progress</p>
            </div>
            <Link
              to="/tasks"
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              Task Board <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {assignedTasks.length === 0 ? (
              <p className="text-xs text-slate-400 py-8 text-center">
                No tasks currently assigned to you. Enjoy the break!
              </p>
            ) : (
              assignedTasks.map((t) => (
                <div
                  key={t.id}
                  className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md truncate max-w-[150px]">
                        {t.project?.name}
                      </span>
                      <PriorityBadge priority={t.priority} size="sm" />
                      {t.deadline && (
                        <span
                          className={`text-[11px] font-medium flex items-center gap-1 ${
                            t.isOverdue
                              ? 'text-rose-600 font-semibold'
                              : t.isDueToday
                              ? 'text-amber-600 font-semibold'
                              : 'text-slate-500'
                          }`}
                        >
                          <Calendar className="w-3 h-3" />
                          {format(new Date(t.deadline), 'MMM dd')}
                          {t.isOverdue && ' (Overdue)'}
                          {t.isDueToday && ' (Due Today)'}
                        </span>
                      )}
                    </div>
                    <p className="font-semibold text-slate-900 text-sm">{t.title}</p>
                    {t.description && (
                      <p className="text-slate-500 mt-1 line-clamp-1">{t.description}</p>
                    )}
                  </div>

                  {/* Status Switcher Controls */}
                  <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                    <select
                      value={t.status}
                      onChange={(e) => handleUpdateStatus(t.id, e.target.value as TaskStatus)}
                      className={`px-3 py-1.5 rounded-lg font-semibold text-xs border outline-none cursor-pointer transition-all ${
                        t.status === 'COMPLETED'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                          : t.status === 'IN_PROGRESS'
                          ? 'bg-blue-50 text-blue-700 border-blue-300'
                          : 'bg-amber-50 text-amber-700 border-amber-300'
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
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-subtle">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-brand-600" />
            Upcoming Deadlines
          </h3>
          <p className="text-xs text-slate-500 mb-4">Milestones due soon</p>

          <div className="space-y-3">
            {upcomingTasks.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No upcoming deadlines.</p>
            ) : (
              upcomingTasks.map((t) => (
                <div
                  key={t.id}
                  className="p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-all text-xs"
                >
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <p className="font-semibold text-slate-900 leading-snug">{t.title}</p>
                    <PriorityBadge priority={t.priority} size="sm" />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
                    <span className="truncate max-w-[130px]">{t.project?.name}</span>
                    {t.deadline && (
                      <span className="font-semibold text-slate-700">
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
    </div>
  );
};
