import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi, taskApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
  FolderKanban,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  ArrowRight,
  TrendingUp,
  Calendar,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { ProgressBar, Skeleton } from '../components/common/CommonUI';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import { AnimatedCounter } from '../components/common/AnimatedCounter';
import { DashboardTicker, TickerItem } from '../components/common/DashboardTicker';
import { PageTransition } from '../components/common/PageTransition';
import { Link } from 'react-router-dom';
import { TaskModal } from '../components/tasks/TaskModal';
import { format } from 'date-fns';
import { useToast } from '../context/ToastContext';

export const ProjectLeadDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>(undefined);

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
      success('Task Created', `Task "${formData.title}" assigned successfully.`);
      refetch();
    } catch (err: any) {
      error('Creation Failed', err.response?.data?.error || 'Failed to create task');
      throw err;
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

  const { kpis, projectSummaries, memberPerformance, upcomingDeadlines } = data;

  const tickerItems: TickerItem[] = [
    { id: '1', category: 'INITIATIVES', label: `${kpis.totalLedProjects} projects under your leadership` },
    { id: '2', category: 'TEAM', label: `${kpis.totalTeamSize} collaborators in active squads` },
    { id: '3', category: 'VELOCITY', label: `Deliverable completion at ${kpis.completionRate}%` },
  ];

  return (
    <PageTransition>
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-zinc-200/80">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-zinc-400">
            Project Leadership Hub
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight mt-1">
            Welcome back, {user?.name?.split(' ')[0] || 'Lead'}
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Oversee team deliverables, dispatch sprint milestones, and monitor workload.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setSelectedProjectId(projectSummaries[0]?.id);
              setIsCreateTaskOpen(true);
            }}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            disabled={projectSummaries.length === 0}
          >
            Create Task
          </Button>
        </div>
      </div>

      {/* Activity Ticker */}
      <DashboardTicker items={tickerItems} className="-mx-4 sm:-mx-8 rounded-none" />

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-mono uppercase tracking-wider">Assigned Projects</span>
            <FolderKanban className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-zinc-900">
              <AnimatedCounter value={kpis.totalLedProjects} />
            </span>
            <span className="text-[11px] font-mono text-zinc-500">
              {kpis.activeProjects} active
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-mono uppercase tracking-wider">Team Size</span>
            <Users className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-zinc-900">
              <AnimatedCounter value={kpis.totalTeamSize} />
            </span>
            <span className="text-[11px] font-mono text-zinc-500">collaborators</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-mono uppercase tracking-wider">Fulfillment</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-zinc-900">
              <AnimatedCounter value={kpis.completionRate} suffix="%" />
            </span>
            <span className="text-[11px] font-mono text-zinc-500">
              {kpis.completedTasks}/{kpis.totalTasks} tasks
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-mono uppercase tracking-wider">Open Tasks</span>
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

      {/* Led Projects Section */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-subtle">
        <div className="flex items-center justify-between mb-5">
          <div>
            <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-zinc-400">
              LEADERSHIP
            </span>
            <h3 className="text-base font-bold text-zinc-900 tracking-tight mt-0.5">
              My Led Initiatives
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
          {projectSummaries.length === 0 ? (
            <p className="text-xs text-zinc-400 py-6 text-center col-span-2">
              No projects currently assigned to you as lead.
            </p>
          ) : (
            projectSummaries.map((p) => (
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
                    <span>{p.memberCount} members</span>
                    <span>
                      {p.completed}/{p.taskCount} tasks ({p.progress}%)
                    </span>
                  </div>
                  <ProgressBar progress={p.progress} size="sm" />

                  <div className="mt-4 flex items-center justify-between pt-1">
                    <Link
                      to={`/projects/${p.id}`}
                      className="text-xs font-semibold text-zinc-900 hover:text-zinc-600 flex items-center gap-1"
                    >
                      <span>Manage Squad</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
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
              </div>
            ))
          )}
        </div>
      </div>

      {/* Team Workload & Upcoming Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workload Table */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-subtle lg:col-span-2">
          <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-zinc-400">
            PERFORMANCE
          </span>
          <h3 className="text-base font-bold text-zinc-900 tracking-tight mt-0.5 mb-4">
            Team Workload & Velocity
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 text-zinc-500 uppercase text-[10px] font-mono border-y border-zinc-200/80">
                <tr>
                  <th className="py-2.5 px-3">Collaborator</th>
                  <th className="py-2.5 px-3">Total Tasks</th>
                  <th className="py-2.5 px-3">Completed</th>
                  <th className="py-2.5 px-3">In Progress</th>
                  <th className="py-2.5 px-3">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {memberPerformance.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-zinc-400">
                      No team members assigned yet.
                    </td>
                  </tr>
                ) : (
                  memberPerformance.map((m) => (
                    <tr key={m.id} className="hover:bg-zinc-50/60">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={
                              m.avatar ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                m.name
                              )}&background=18181b&color=fff`
                            }
                            alt={m.name}
                            className="w-7 h-7 rounded-lg object-cover ring-1 ring-zinc-200"
                          />
                          <div>
                            <span className="font-bold text-zinc-900 block">{m.name}</span>
                            <span className="text-[10px] text-zinc-400 font-mono">
                              {m.department || 'General'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono font-semibold text-zinc-800">{m.totalTasks}</td>
                      <td className="py-3 px-3 font-mono text-emerald-600 font-semibold">{m.completedTasks}</td>
                      <td className="py-3 px-3 font-mono text-blue-600 font-semibold">{m.inProgressTasks}</td>
                      <td className="py-3 px-3 w-36">
                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <ProgressBar progress={m.progress} size="sm" />
                          </div>
                          <span className="font-mono font-semibold text-zinc-700 text-[11px]">
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
        <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-subtle">
          <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-zinc-400">
            DEADLINES
          </span>
          <h3 className="text-base font-bold text-zinc-900 tracking-tight mt-0.5 flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-zinc-700" />
            Milestones Due Soon
          </h3>

          <div className="space-y-3">
            {upcomingDeadlines.length === 0 ? (
              <p className="text-xs text-zinc-400 py-6 text-center">No pending milestones.</p>
            ) : (
              upcomingDeadlines.map((t) => (
                <div
                  key={t.id}
                  className="p-3 rounded-xl border border-zinc-100 hover:border-zinc-200 transition-all text-xs"
                >
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <p className="font-semibold text-zinc-900 leading-snug">{t.title}</p>
                    <PriorityBadge priority={t.priority} size="sm" />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-zinc-500 mt-2 pt-2 border-t border-zinc-100 font-mono">
                    <span>{t.assignedTo?.name || 'Unassigned'}</span>
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

      {/* Task Modal */}
      <TaskModal
        isOpen={isCreateTaskOpen}
        onClose={() => setIsCreateTaskOpen(false)}
        onSubmit={handleCreateTask}
        defaultProjectId={selectedProjectId}
        title="Create & Assign Task"
      />
    </PageTransition>
  );
};
