import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi, taskApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
  CheckSquare,
  Clock,
  CheckCircle2,
  FolderKanban,
  Calendar,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { ProgressBar, Skeleton } from '../components/common/CommonUI';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import { Avatar } from '../components/common/Avatar';
import { AnimatedCounter } from '../components/common/AnimatedCounter';
import { DashboardTicker, TickerItem } from '../components/common/DashboardTicker';
import { PageTransition } from '../components/common/PageTransition';
import { TaskDetailDrawer, formatTaskDeadline } from '../components/tasks/TaskDetailDrawer';
import { Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { Task } from '../types';

export const MemberDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['member-dashboard'],
    queryFn: async () => {
      const res = await dashboardApi.getMemberDashboard();
      return res.data;
    },
  });

  const handleStatusToggle = async (taskId: string, currentStatus: string) => {
    let nextStatus = 'IN_PROGRESS';
    if (currentStatus === 'IN_PROGRESS') nextStatus = 'COMPLETED';
    else if (currentStatus === 'COMPLETED') nextStatus = 'TODO';

    try {
      await taskApi.updateTaskStatus(taskId, nextStatus);
      success('Status Updated', `Deliverable moved to ${nextStatus.replace('_', ' ')}.`);
      refetch();
    } catch (err: any) {
      error('Update Failed', err.response?.data?.error || 'Could not update task');
    }
  };

  const handleStatusChangeFromDrawer = async (taskId: string, newStatus: any) => {
    try {
      await taskApi.updateTaskStatus(taskId, newStatus);
      success('Status Updated', `Deliverable moved to ${newStatus.replace('_', ' ')}.`);
      refetch();
      if (selectedTask && selectedTask.id === taskId) {
        setSelectedTask({ ...selectedTask, status: newStatus });
      }
    } catch (err: any) {
      error('Update Failed', err.response?.data?.error || 'Could not update task');
    }
  };

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 rounded-2xl" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-72 rounded-xl" />
      </div>
    );
  }

  const { kpis, assignedTasks, projects } = data;

  const tickerItems: TickerItem[] = [
    { id: '1', category: 'SQUADS', label: `Member of ${projects.length} club project teams` },
    { id: '2', category: 'TASKS', label: `${kpis.todoTasks + kpis.inProgressTasks} deliverables assigned to you` },
    { id: '3', category: 'FULFILLMENT', label: `${kpis.completedTasks} completed milestone deliverables` },
  ];

  return (
    <PageTransition>
      {/* Editorial Header */}
      <div className="pb-4 border-b border-zinc-200/80">
        <span className="font-mono text-[11px] uppercase tracking-wider text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
          Personal Club Workspace
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight mt-1.5">
          Good morning, {user?.name?.split(' ')[0] || 'Member'}
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          You have {kpis.todoTasks + kpis.inProgressTasks} assigned deliverables across {projects.length} project committees.
        </p>
      </div>

      {/* Activity Ticker */}
      <DashboardTicker items={tickerItems} className="rounded-lg my-2" />

      {/* Inline Compact Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 py-2">
        <div className="p-4 rounded-xl bg-white border border-zinc-200/80 shadow-subtle">
          <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
            My Projects
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-zinc-900">
              <AnimatedCounter value={projects.length} />
            </span>
            <span className="text-xs text-zinc-400">squads</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-zinc-200/80 shadow-subtle">
          <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
            Active Deliverables
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-blue-600">
              <AnimatedCounter value={kpis.todoTasks + kpis.inProgressTasks} />
            </span>
            <span className="text-xs text-zinc-400">pending</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-zinc-200/80 shadow-subtle">
          <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
            Completed
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-600">
              <AnimatedCounter value={kpis.completedTasks} />
            </span>
            <span className="text-xs text-zinc-400">tasks done</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-zinc-200/80 shadow-subtle">
          <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
            Completion Rate
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-zinc-900">
              <AnimatedCounter value={kpis.completionRate} suffix="%" />
            </span>
            {kpis.overdueTasks > 0 ? (
              <span className="text-[11px] font-mono text-rose-600 font-semibold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200/60">
                {kpis.overdueTasks} overdue
              </span>
            ) : (
              <span className="text-[11px] font-mono text-emerald-600">all on time</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: My Deliverables & My Project Squads */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: My Assigned Deliverables List */}
        <div className="lg:col-span-2 rounded-xl border border-zinc-200/80 bg-white p-5 shadow-subtle">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100 mb-4">
            <div>
              <h2 className="text-base font-bold text-zinc-900 tracking-tight">
                My Assigned Deliverables
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Click task for details or toggle status directly.
              </p>
            </div>
            <Link
              to="/tasks"
              className="text-xs font-semibold text-zinc-700 hover:text-zinc-900 flex items-center gap-1 group"
            >
              <span>Task board</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {assignedTasks.length === 0 ? (
              <div className="p-8 text-center bg-zinc-50 rounded-xl border border-zinc-100">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <p className="text-sm font-bold text-zinc-900">You are all caught up!</p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  No pending deliverables currently assigned to your account.
                </p>
              </div>
            ) : (
              assignedTasks.map((t: any) => {
                const deadlineInfo = formatTaskDeadline(t.deadline);
                return (
                  <div
                    key={t.id}
                    className="p-3.5 rounded-xl border border-zinc-100 hover:border-zinc-200 hover:bg-zinc-50/60 transition-all flex items-center justify-between gap-3 text-xs"
                  >
                    <div
                      onClick={() => setSelectedTask(t)}
                      className="min-w-0 flex-1 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-semibold transition-colors ${
                            t.status === 'COMPLETED' ? 'line-through text-zinc-400' : 'text-zinc-900'
                          }`}
                        >
                          {t.title}
                        </span>
                        <PriorityBadge priority={t.priority} size="sm" />
                      </div>
                      <div className="flex items-center gap-2 mt-1.5 text-[11px] text-zinc-400 font-mono">
                        <span className="text-zinc-600 font-medium">{t.project?.name}</span>
                        {deadlineInfo && (
                          <>
                            <span>•</span>
                            <span
                              className={
                                deadlineInfo.isOverdue
                                  ? 'text-rose-600 font-semibold'
                                  : deadlineInfo.isUrgent
                                  ? 'text-amber-700 font-semibold'
                                  : 'text-zinc-500'
                              }
                            >
                              {deadlineInfo.text}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* 1-Click Status Progression Button */}
                    <button
                      type="button"
                      onClick={() => handleStatusToggle(t.id, t.status)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all shrink-0 ${
                        t.status === 'COMPLETED'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                          : t.status === 'IN_PROGRESS'
                          ? 'bg-blue-50 text-blue-800 border-blue-300 hover:bg-blue-100'
                          : 'bg-zinc-100 text-zinc-700 border-zinc-300 hover:bg-zinc-200'
                      }`}
                    >
                      {t.status === 'COMPLETED'
                        ? 'Done ✓'
                        : t.status === 'IN_PROGRESS'
                        ? 'In Progress →'
                        : 'Start →'}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right 1 Col: My Project Squads */}
        <div className="rounded-xl border border-zinc-200/80 bg-white p-5 shadow-subtle">
          <div className="pb-3 border-b border-zinc-100 mb-4">
            <h2 className="text-base font-bold text-zinc-900 tracking-tight">
              My Club Squads
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Active project committees you are enrolled in.
            </p>
          </div>

          <div className="space-y-4">
            {projects.length === 0 ? (
              <p className="text-xs text-zinc-400 py-6 text-center">
                You have not been added to any project committees yet.
              </p>
            ) : (
              projects.map((p: any) => (
                <div
                  key={p.id}
                  className="p-3.5 rounded-xl border border-zinc-100 hover:border-zinc-200 transition-all"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <Link
                      to={`/projects/${p.id}`}
                      className="text-xs font-bold text-zinc-900 hover:text-emerald-600 transition-colors line-clamp-1"
                    >
                      {p.name}
                    </Link>
                    <StatusBadge status={p.status} size="sm" />
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 mb-2">
                    <Avatar name={p.projectLead?.name} size="xs" />
                    <span>Lead: {p.projectLead?.name || 'Unassigned'}</span>
                  </div>
                  <ProgressBar progress={p.progress} size="sm" />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Task Detail Slide-over Drawer */}
      <TaskDetailDrawer
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        onStatusChange={handleStatusChangeFromDrawer}
        canEdit={true}
      />
    </PageTransition>
  );
};
