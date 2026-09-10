import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi, taskApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
  FolderKanban,
  Users,
  CheckCircle2,
  Clock,
  Plus,
  ArrowRight,
  Calendar,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { ProgressBar, Skeleton } from '../components/common/CommonUI';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import { Avatar } from '../components/common/Avatar';
import { AnimatedCounter } from '../components/common/AnimatedCounter';
import { PageTransition } from '../components/common/PageTransition';
import { ProjectStrip } from '../components/common/ProjectStrip';
import { Link } from 'react-router-dom';
import { TaskModal } from '../components/tasks/TaskModal';
import { TaskDetailDrawer } from '../components/tasks/TaskDetailDrawer';
import { format, isPast, isToday } from 'date-fns';
import { useToast } from '../context/ToastContext';
import { Task } from '../types';

export const ProjectLeadDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>(undefined);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['lead-dashboard'],
    queryFn: async () => {
      const res = await dashboardApi.getLeadDashboard();
      return res.data;
    },
  });

  const handleCreateTask = async (formData: any) => {
    try {
      await taskApi.createTask(formData);
      success('Task Created', `Deliverable "${formData.title}" assigned successfully.`);
      refetch();
    } catch (err: any) {
      error('Creation Failed', err.response?.data?.error || 'Failed to create task');
      throw err;
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: any) => {
    try {
      await taskApi.updateTaskStatus(taskId, newStatus);
      success('Status Updated', `Deliverable marked as ${newStatus.replace('_', ' ')}.`);
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

  const { kpis, projectSummaries, memberPerformance, upcomingDeadlines } = data;

  const projectStripItems = projectSummaries.map((p) => ({
    id: p.id,
    name: p.name.toUpperCase(),
    category: 'SQUAD',
    progress: p.progress,
  }));

  return (
    <PageTransition>
      {/* Visual Hero Header with Frame 03 (Innovation Workspace) */}
      <div className="relative rounded-lg border border-white/8 bg-[#0D0D0F] overflow-hidden shadow-premium">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between z-10">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#FF6A16] font-semibold bg-[#141416] px-2.5 py-1 rounded border border-white/10 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A16] animate-pulse" />
                  03 / PROJECT LEAD HUB
                </span>
                <span className="text-[11px] font-mono text-zinc-500">
                  DEVELOPMENT LAB
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#F5F2EA] tracking-tight mt-3 leading-tight">
                Good morning, {user?.name?.split(' ')[0] || 'Lead'}
              </h1>
              <p className="text-xs sm:text-sm text-[#8C8A84] mt-2 max-w-lg leading-relaxed">
                Your squad has {kpis.todoTasks + kpis.inProgressTasks} active deliverables across {kpis.totalLedProjects} initiatives.
              </p>
            </div>

            <div className="mt-6 flex items-center gap-3 pt-4 border-t border-white/5">
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setSelectedProjectId(projectSummaries[0]?.id);
                  setIsCreateTaskOpen(true);
                }}
                leftIcon={<Plus className="w-3.5 h-3.5 text-black font-bold" />}
                disabled={projectSummaries.length === 0}
              >
                Assign Task
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5 relative min-h-[200px] lg:min-h-full overflow-hidden border-t lg:border-t-0 lg:border-l border-white/8">
            <img
              src="/frames/03_workspace.jpg"
              alt="Innovation Workspace"
              className="w-full h-full object-cover animate-slow-pan"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#0D0D0F] via-[#0D0D0F]/40 to-transparent" />
            <div className="absolute bottom-3 right-3 z-10">
              <span className="text-[10px] font-mono text-zinc-400 bg-[#050505]/80 px-2 py-0.5 rounded border border-white/10 backdrop-blur-md">
                FRAME 03 • WORKSPACE
              </span>
            </div>
          </div>
        </div>

        {/* Travelling Light Line */}
        <div className="absolute top-0 left-0 right-0 h-[1.5px] overflow-hidden z-20 pointer-events-none">
          <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-[#FF6A16] to-transparent animate-travel-line opacity-80" />
        </div>
      </div>

      {/* Activity Metric Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-lg bg-[#0D0D0F] border border-white/8 shadow-subtle hover:border-[#FF6A16]/30 transition-all">
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-semibold">
            LED PROJECTS
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[#F5F2EA]">
              <AnimatedCounter value={kpis.totalLedProjects} />
            </span>
            <span className="text-xs font-mono text-zinc-500">({kpis.activeProjects} active)</span>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-[#0D0D0F] border border-white/8 shadow-subtle hover:border-[#FF6A16]/30 transition-all">
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-semibold">
            TEAM SQUAD
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[#F5F2EA]">
              <AnimatedCounter value={kpis.totalTeamSize} />
            </span>
            <span className="text-xs font-mono text-zinc-500">collaborators</span>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-[#0D0D0F] border border-white/8 shadow-subtle hover:border-[#FF6A16]/30 transition-all">
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-semibold">
            COMPLETED
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[#FFD400]">
              <AnimatedCounter value={kpis.completionRate} suffix="%" />
            </span>
            <span className="text-xs font-mono text-zinc-500">
              {kpis.completedTasks}/{kpis.totalTasks}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-[#0D0D0F] border border-white/8 shadow-subtle hover:border-[#FF6A16]/30 transition-all">
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-semibold">
            DELIVERABLES DUE
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[#FF6A16]">
              <AnimatedCounter value={kpis.todoTasks + kpis.inProgressTasks} />
            </span>
            {kpis.overdueTasks > 0 ? (
              <span className="text-[10px] font-mono text-rose-400 bg-rose-950/50 px-1.5 py-0.5 rounded border border-rose-800/60">
                {kpis.overdueTasks} overdue
              </span>
            ) : (
              <span className="text-[10px] font-mono text-[#FFD400]">on schedule</span>
            )}
          </div>
        </div>
      </div>

      {/* Project Strip */}
      {projectStripItems.length > 0 && <ProjectStrip items={projectStripItems} className="rounded-lg" />}

      {/* Led Projects Section */}
      <div className="rounded-lg border border-white/8 bg-[#0D0D0F] overflow-hidden shadow-subtle">
        <div className="p-5 border-b border-white/8 flex items-center justify-between bg-[#050505]">
          <div>
            <h2 className="text-sm font-bold text-[#F5F2EA] tracking-tight">
              My Led Initiatives
            </h2>
            <p className="text-xs text-[#8C8A84] mt-0.5">
              Sprint deliverables, squad allocation, and overall milestone progression.
            </p>
          </div>
          <Link
            to="/projects"
            className="text-xs font-medium text-zinc-400 hover:text-[#FF6A16] flex items-center gap-1 group transition-colors"
          >
            <span>All projects</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="divide-y divide-white/5">
          {projectSummaries.length === 0 ? (
            <p className="text-xs text-zinc-500 p-8 text-center">
              No initiatives currently assigned to you as project lead.
            </p>
          ) : (
            projectSummaries.map((p) => (
              <div
                key={p.id}
                className="p-5 hover:bg-[#141416]/60 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
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
                  {p.description && (
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-1 leading-relaxed">
                      {p.description}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-2 text-xs text-zinc-500 font-mono">
                    <span>{p.memberCount} squad members</span>
                    <span>•</span>
                    <span>
                      {p.completed}/{p.taskCount} tasks completed
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="w-36 flex items-center gap-2.5">
                    <ProgressBar progress={p.progress} size="sm" />
                    <span className="font-mono text-xs font-semibold text-[#FF6A16]">{p.progress}%</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedProjectId(p.id);
                      setIsCreateTaskOpen(true);
                    }}
                    leftIcon={<Plus className="w-3 h-3" />}
                  >
                    Add Task
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Team Workload & Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Workload Table */}
        <div className="rounded-lg border border-white/8 bg-[#0D0D0F] p-5 shadow-subtle lg:col-span-2">
          <div className="pb-3 border-b border-white/8 mb-4">
            <h3 className="text-xs font-bold text-[#F5F2EA] uppercase tracking-wider font-mono">
              Team Member Velocity
            </h3>
            <p className="text-xs text-[#8C8A84] mt-0.5">
              Task distribution across your initiative squad members.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#050505] text-zinc-400 uppercase text-[10px] font-mono border-y border-white/5">
                <tr>
                  <th className="py-2.5 px-3">Student</th>
                  <th className="py-2.5 px-3">Total</th>
                  <th className="py-2.5 px-3">Done</th>
                  <th className="py-2.5 px-3">Active</th>
                  <th className="py-2.5 px-3">Velocity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {memberPerformance.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-zinc-500">
                      No team members assigned yet.
                    </td>
                  </tr>
                ) : (
                  memberPerformance.map((m) => (
                    <tr key={m.id} className="hover:bg-[#141416]/60">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={m.name} size="xs" />
                          <div>
                            <span className="font-semibold text-[#F5F2EA] block">{m.name}</span>
                            <span className="text-[10px] text-zinc-500 font-mono">
                              {m.department || 'CSE'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono font-semibold text-zinc-300">{m.totalTasks}</td>
                      <td className="py-3 px-3 font-mono text-[#FFD400] font-semibold">{m.completedTasks}</td>
                      <td className="py-3 px-3 font-mono text-[#FF6A16] font-semibold">{m.inProgressTasks}</td>
                      <td className="py-3 px-3 w-36">
                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <ProgressBar progress={m.progress} size="sm" />
                          </div>
                          <span className="font-mono font-semibold text-zinc-300 text-[11px]">
                            {m.progress}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Milestones */}
        <div className="rounded-lg border border-white/8 bg-[#0D0D0F] p-5 shadow-subtle">
          <div className="pb-3 border-b border-white/8 mb-4 flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#F5F2EA] uppercase tracking-wider flex items-center gap-2 font-mono">
              <Calendar className="w-3.5 h-3.5 text-[#FF6A16]" />
              Sprint Deadlines
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
              <p className="text-xs text-zinc-500 py-6 text-center">No pending milestones.</p>
            ) : (
              upcomingDeadlines.map((t: any) => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTask(t)}
                  className="p-3 rounded-lg border border-white/5 bg-[#141416]/40 hover:border-white/10 hover:bg-[#141416] transition-all text-xs cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-medium text-[#F5F2EA] leading-snug group-hover:text-[#FF6A16] transition-colors truncate">
                      {t.title}
                    </p>
                    <PriorityBadge priority={t.priority} size="sm" />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-zinc-500 mt-2 pt-2 border-t border-white/5 font-mono">
                    <span>{t.assignedTo?.name || 'Unassigned'}</span>
                    {t.deadline && (
                      <span className="font-semibold text-zinc-300">
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

      {/* Task Creation Modal */}
      <TaskModal
        isOpen={isCreateTaskOpen}
        onClose={() => setIsCreateTaskOpen(false)}
        onSubmit={handleCreateTask}
        defaultProjectId={selectedProjectId}
        title="Assign New Deliverable"
      />

      {/* Task Detail Slide-over Drawer */}
      <TaskDetailDrawer
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        onStatusChange={handleStatusChange}
        canEdit={true}
      />
    </PageTransition>
  );
};
