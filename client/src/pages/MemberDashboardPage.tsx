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
      {/* Hero Header with Cinematic Frame */}
      <div className="relative rounded-xl border border-white/8 bg-[#0D0D0F] overflow-hidden shadow-2xl mb-6">
        <div className="grid grid-cols-1 md:grid-cols-12 items-center">
          <div className="p-6 sm:p-8 md:col-span-7 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#FFD400] font-semibold bg-[#141416] px-2.5 py-1 rounded border border-white/8">
                01 / CONTRIBUTOR PORTAL
              </span>
              <span className="text-[11px] font-mono text-[#8C8A84]">
                INNOVATION SQUAD
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#F5F2EA] tracking-tight">
              Good morning, {user?.name?.split(' ')[0] || 'Member'}
            </h1>
            <p className="text-xs sm:text-sm text-[#8C8A84] leading-relaxed max-w-lg">
              You are assigned to {kpis.todoTasks + kpis.inProgressTasks} active deliverables across {projects.length} club project committees.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <Link
                to="/tasks"
                className="px-4 py-2 bg-[#FF6A16] hover:bg-[#FF9D00] text-black text-xs font-bold rounded-lg transition-all shadow-lg hover:shadow-[#FF6A16]/20 inline-flex items-center gap-1.5"
              >
                <span>Open Task Board</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="md:col-span-5 h-48 md:h-64 relative overflow-hidden border-t md:border-t-0 md:border-l border-white/8 group">
            <img
              src="/frames/01_lobby.jpg"
              alt="Club Innovation Lobby"
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0D0D0F] via-transparent to-transparent opacity-90" />
            <div className="absolute bottom-3 right-3 bg-[#050505]/80 backdrop-blur-md px-2.5 py-1 rounded border border-white/10 text-[10px] font-mono text-[#F5F2EA]">
              01 / LOBBY
            </div>
            <div className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-[#FF6A16] to-transparent animate-travel-line" />
          </div>
        </div>
      </div>

      {/* Activity Ticker */}
      <DashboardTicker items={tickerItems} className="rounded-lg my-4 bg-[#0D0D0F] border-white/8 text-[#F5F2EA]" />

      {/* Command Center Compact Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 py-1">
        <div className="p-4 rounded-xl bg-[#0D0D0F] border border-white/8 shadow-subtle hover:border-[#FF6A16]/30 transition-all">
          <div className="text-[10px] font-mono text-[#8C8A84] uppercase tracking-wider font-semibold">
            MY PROJECTS
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[#F5F2EA]">
              <AnimatedCounter value={projects.length} />
            </span>
            <span className="text-xs font-mono text-[#8C8A84]">squads</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0D0D0F] border border-white/8 shadow-subtle hover:border-[#FF6A16]/30 transition-all">
          <div className="text-[10px] font-mono text-[#8C8A84] uppercase tracking-wider font-semibold">
            ACTIVE DELIVERABLES
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[#FF6A16]">
              <AnimatedCounter value={kpis.todoTasks + kpis.inProgressTasks} />
            </span>
            <span className="text-xs font-mono text-[#8C8A84]">pending</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0D0D0F] border border-white/8 shadow-subtle hover:border-[#FF6A16]/30 transition-all">
          <div className="text-[10px] font-mono text-[#8C8A84] uppercase tracking-wider font-semibold">
            COMPLETED
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[#FFD400]">
              <AnimatedCounter value={kpis.completedTasks} />
            </span>
            <span className="text-xs font-mono text-[#8C8A84]">tasks done</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0D0D0F] border border-white/8 shadow-subtle hover:border-[#FF6A16]/30 transition-all">
          <div className="text-[10px] font-mono text-[#8C8A84] uppercase tracking-wider font-semibold">
            COMPLETION RATE
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[#F5F2EA]">
              <AnimatedCounter value={kpis.completionRate} suffix="%" />
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

      {/* Main Grid: My Deliverables & My Project Squads */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        {/* Left 2 Cols: My Assigned Deliverables List */}
        <div className="lg:col-span-2 rounded-xl border border-white/8 bg-[#0D0D0F] p-6 shadow-subtle">
          <div className="flex items-center justify-between pb-3 border-b border-white/8 mb-4">
            <div>
              <h2 className="text-sm font-bold text-[#F5F2EA] tracking-tight">
                My Assigned Deliverables
              </h2>
              <p className="text-xs text-[#8C8A84] mt-0.5">
                Click task for slide-over drawer or toggle status directly.
              </p>
            </div>
            <Link
              to="/tasks"
              className="text-xs font-medium text-[#8C8A84] hover:text-[#FF6A16] flex items-center gap-1 group transition-colors"
            >
              <span>Task board</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {assignedTasks.length === 0 ? (
              <div className="p-8 text-center bg-[#141416] rounded-xl border border-white/5">
                <CheckCircle2 className="w-8 h-8 text-[#FFD400] mx-auto mb-2" />
                <p className="text-sm font-bold text-[#F5F2EA]">You are all caught up!</p>
                <p className="text-xs text-[#8C8A84] mt-0.5">
                  No pending deliverables currently assigned to your account.
                </p>
              </div>
            ) : (
              assignedTasks.map((t: any) => {
                const deadlineInfo = formatTaskDeadline(t.deadline);
                return (
                  <div
                    key={t.id}
                    className="p-3.5 rounded-xl border border-white/5 bg-[#141416]/50 hover:border-[#FF6A16]/30 hover:bg-[#141416] transition-all flex items-center justify-between gap-3 text-xs"
                  >
                    <div
                      onClick={() => setSelectedTask(t)}
                      className="min-w-0 flex-1 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-semibold transition-colors ${
                            t.status === 'COMPLETED' ? 'line-through text-[#8C8A84]' : 'text-[#F5F2EA]'
                          }`}
                        >
                          {t.title}
                        </span>
                        <PriorityBadge priority={t.priority} size="sm" />
                      </div>
                      <div className="flex items-center gap-2 mt-1.5 text-[11px] text-[#8C8A84] font-mono">
                        <span className="text-[#F5F2EA]/80 font-medium">{t.project?.name}</span>
                        {deadlineInfo && (
                          <>
                            <span>•</span>
                            <span
                              className={
                                deadlineInfo.isOverdue
                                  ? 'text-rose-400 font-semibold'
                                  : deadlineInfo.isUrgent
                                  ? 'text-[#FFD400] font-semibold'
                                  : 'text-[#8C8A84]'
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
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all shrink-0 ${
                        t.status === 'COMPLETED'
                          ? 'bg-[#141416] text-[#FFD400] border-white/10 hover:border-[#FFD400]/40'
                          : t.status === 'IN_PROGRESS'
                          ? 'bg-[#FF6A16]/10 text-[#FF6A16] border-[#FF6A16]/30 hover:border-[#FF6A16]'
                          : 'bg-[#141416] text-[#F5F2EA] border-white/8 hover:bg-[#1C1C20]'
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
        <div className="rounded-xl border border-white/8 bg-[#0D0D0F] p-6 shadow-subtle">
          <div className="pb-3 border-b border-white/8 mb-4">
            <h2 className="text-sm font-bold text-[#F5F2EA] tracking-tight">
              My Club Squads
            </h2>
            <p className="text-xs text-[#8C8A84] mt-0.5">
              Active project committees you are enrolled in.
            </p>
          </div>

          <div className="space-y-3">
            {projects.length === 0 ? (
              <p className="text-xs text-[#8C8A84] py-6 text-center">
                You have not been added to any project committees yet.
              </p>
            ) : (
              projects.map((p: any) => (
                <div
                  key={p.id}
                  className="p-3.5 rounded-xl border border-white/5 bg-[#141416]/50 hover:border-[#FF6A16]/30 transition-all"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <Link
                      to={`/projects/${p.id}`}
                      className="text-xs font-semibold text-[#F5F2EA] hover:text-[#FF6A16] transition-colors line-clamp-1"
                    >
                      {p.name}
                    </Link>
                    <StatusBadge status={p.status} size="sm" />
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#8C8A84] mb-2">
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
