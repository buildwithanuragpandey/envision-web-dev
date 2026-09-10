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
} from 'lucide-react';
import { ProgressBar, Skeleton } from '../components/common/CommonUI';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import { Avatar } from '../components/common/Avatar';
import { AnimatedCounter } from '../components/common/AnimatedCounter';
import { DashboardTicker, TickerItem } from '../components/common/DashboardTicker';
import { PageTransition } from '../components/common/PageTransition';
import { BackgroundAtmosphere } from '../components/common/BackgroundAtmosphere';
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
        <Skeleton className="h-32 rounded-lg" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-20 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-72 rounded-lg" />
      </div>
    );
  }

  const { kpis, assignedTasks, projects } = data;

  const tickerItems: TickerItem[] = [
    { id: '1', category: 'SQUADS', label: `Member of ${projects.length} club project committees` },
    { id: '2', category: 'TASKS', label: `${kpis.todoTasks + kpis.inProgressTasks} deliverables assigned to you` },
    { id: '3', category: 'FULFILLMENT', label: `${kpis.completedTasks} completed milestone deliverables` },
  ];

  return (
    <PageTransition>
      {/* Hero Header with Atmosphere */}
      <div className="relative rounded-lg border border-white/8 bg-[#0A0A0C] p-6 sm:p-8 overflow-hidden shadow-premium">
        <BackgroundAtmosphere variant="hero" showAmbientMesh={true} />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#FFDD00] font-semibold bg-[#111114] px-2 py-0.5 rounded border border-white/10">
                PERSONAL WORKSPACE • CONTRIBUTOR
              </span>
              <span className="text-[11px] font-mono text-zinc-500">
                MY DELIVERABLES & SQUADS
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F5F0] tracking-tight mt-2">
              Good morning, {user?.name?.split(' ')[0] || 'Member'}
            </h1>
            <p className="text-xs text-zinc-400 mt-1 max-w-xl">
              You have {kpis.todoTasks + kpis.inProgressTasks} assigned deliverables across {projects.length} project committees.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              to="/tasks"
              className="btn-brand text-xs font-semibold px-4 py-2 rounded-lg"
            >
              Open Task Board
            </Link>
          </div>
        </div>
      </div>

      {/* Activity Ticker */}
      <DashboardTicker items={tickerItems} className="rounded-lg my-3" />

      {/* Command Center Compact Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 py-1">
        <div className="p-4 rounded-lg bg-[#0A0A0C] border border-white/8 shadow-subtle hover:border-[#FF6814]/30 transition-all">
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-semibold">
            MY PROJECTS
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[#F5F5F0]">
              <AnimatedCounter value={projects.length} />
            </span>
            <span className="text-xs font-mono text-zinc-500">squads</span>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-[#0A0A0C] border border-white/8 shadow-subtle hover:border-[#FF6814]/30 transition-all">
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-semibold">
            ACTIVE DELIVERABLES
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[#FF6814]">
              <AnimatedCounter value={kpis.todoTasks + kpis.inProgressTasks} />
            </span>
            <span className="text-xs font-mono text-zinc-500">pending</span>
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
            <span className="text-xs font-mono text-zinc-500">tasks done</span>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-[#0A0A0C] border border-white/8 shadow-subtle hover:border-[#FF6814]/30 transition-all">
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-semibold">
            COMPLETION RATE
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[#F5F5F0]">
              <AnimatedCounter value={kpis.completionRate} suffix="%" />
            </span>
            {kpis.overdueTasks > 0 ? (
              <span className="text-[10px] font-mono text-rose-400 bg-rose-950/50 px-1.5 py-0.5 rounded border border-rose-800/60">
                {kpis.overdueTasks} overdue
              </span>
            ) : (
              <span className="text-[10px] font-mono text-[#FFDD00]">all on time</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: My Deliverables & My Project Squads */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        {/* Left 2 Cols: My Assigned Deliverables List */}
        <div className="lg:col-span-2 rounded-lg border border-white/8 bg-[#0A0A0C] p-5 shadow-subtle">
          <div className="flex items-center justify-between pb-3 border-b border-white/8 mb-4">
            <div>
              <h2 className="text-sm font-bold text-[#F5F5F0] tracking-tight">
                My Assigned Deliverables
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Click task for slide-over drawer or toggle status directly.
              </p>
            </div>
            <Link
              to="/tasks"
              className="text-xs font-medium text-zinc-400 hover:text-[#FF6814] flex items-center gap-1 group transition-colors"
            >
              <span>Task board</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {assignedTasks.length === 0 ? (
              <div className="p-8 text-center bg-[#111114] rounded-lg border border-white/5">
                <CheckCircle2 className="w-8 h-8 text-[#FFDD00] mx-auto mb-2" />
                <p className="text-sm font-bold text-[#F5F5F0]">You are all caught up!</p>
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
                    className="p-3.5 rounded-lg border border-white/5 bg-[#111114]/40 hover:border-white/10 hover:bg-[#111114] transition-all flex items-center justify-between gap-3 text-xs"
                  >
                    <div
                      onClick={() => setSelectedTask(t)}
                      className="min-w-0 flex-1 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-medium transition-colors ${
                            t.status === 'COMPLETED' ? 'line-through text-zinc-500' : 'text-[#F5F5F0]'
                          }`}
                        >
                          {t.title}
                        </span>
                        <PriorityBadge priority={t.priority} size="sm" />
                      </div>
                      <div className="flex items-center gap-2 mt-1.5 text-[11px] text-zinc-500 font-mono">
                        <span className="text-zinc-400 font-medium">{t.project?.name}</span>
                        {deadlineInfo && (
                          <>
                            <span>•</span>
                            <span
                              className={
                                deadlineInfo.isOverdue
                                  ? 'text-rose-400 font-semibold'
                                  : deadlineInfo.isUrgent
                                  ? 'text-[#FFDD00] font-semibold'
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
                          ? 'bg-[#111114] text-[#FFDD00] border-white/10 hover:border-[#FFDD00]/40'
                          : t.status === 'IN_PROGRESS'
                          ? 'bg-[#16161A] text-[#FF6814] border-[#FF6814]/30 hover:border-[#FF6814]'
                          : 'bg-[#111114] text-zinc-300 border-white/8 hover:bg-[#16161A]'
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
        <div className="rounded-lg border border-white/8 bg-[#0A0A0C] p-5 shadow-subtle">
          <div className="pb-3 border-b border-white/8 mb-4">
            <h2 className="text-sm font-bold text-[#F5F5F0] tracking-tight">
              My Club Squads
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Active project committees you are enrolled in.
            </p>
          </div>

          <div className="space-y-3">
            {projects.length === 0 ? (
              <p className="text-xs text-zinc-500 py-6 text-center">
                You have not been added to any project committees yet.
              </p>
            ) : (
              projects.map((p: any) => (
                <div
                  key={p.id}
                  className="p-3.5 rounded-lg border border-white/5 bg-[#111114]/40 hover:border-white/10 transition-all"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <Link
                      to={`/projects/${p.id}`}
                      className="text-xs font-semibold text-[#F5F5F0] hover:text-[#FF6814] transition-colors line-clamp-1"
                    >
                      {p.name}
                    </Link>
                    <StatusBadge status={p.status} size="sm" />
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 mb-2">
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
