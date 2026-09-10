import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi, taskApi } from '../api/client';
import {
  FolderKanban,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  ArrowUpRight,
  TrendingUp,
  Calendar,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { ProgressBar, Skeleton } from '../components/common/CommonUI';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import { Link } from 'react-router-dom';
import { TaskModal } from '../components/tasks/TaskModal';
import { format } from 'date-fns';
import { useToast } from '../context/ToastContext';

export const ProjectLeadDashboardPage: React.FC = () => {
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-80 rounded-2xl" />
      </div>
    );
  }

  const { kpis, projectSummaries, memberPerformance, upcomingDeadlines } = data;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-subtle">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Project Lead Hub</h2>
          <p className="text-xs text-slate-500 mt-1">
            Track milestones, oversee your team deliverables, and dispatch tasks.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              setSelectedProjectId(projectSummaries[0]?.id);
              setIsCreateTaskOpen(true);
            }}
            leftIcon={<Plus className="w-4 h-4" />}
            disabled={projectSummaries.length === 0}
          >
            Create Task
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Led Projects */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Assigned Projects</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <FolderKanban className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900">{kpis.totalLedProjects}</span>
            <span className="text-xs text-brand-600 font-medium bg-brand-50 px-2 py-0.5 rounded-md">
              {kpis.activeProjects} active
            </span>
          </div>
        </div>

        {/* Team Members */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Team Members</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900">{kpis.totalTeamSize}</span>
            <span className="text-xs text-slate-500 font-medium">collaborators</span>
          </div>
        </div>

        {/* Progress % */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Team Completion</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900">{kpis.completionRate}%</span>
            <span className="text-xs text-slate-500 font-medium">
              {kpis.completedTasks}/{kpis.totalTasks} completed
            </span>
          </div>
        </div>

        {/* Overdue / Urgent */}
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
                On schedule
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Led Projects Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-subtle">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">My Led Projects</h3>
            <p className="text-xs text-slate-500">Projects under your active leadership</p>
          </div>
          <Link
            to="/projects"
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            All projects <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projectSummaries.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center col-span-2">
              No projects currently assigned to you as lead.
            </p>
          ) : (
            projectSummaries.map((p) => (
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
                    <span>Team: {p.memberCount} members</span>
                    <span>
                      {p.completed}/{p.taskCount} tasks ({p.progress}%)
                    </span>
                  </div>
                  <ProgressBar progress={p.progress} size="md" />

                  <div className="mt-3 flex items-center justify-between pt-2">
                    <Link
                      to={`/projects/${p.id}`}
                      className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                    >
                      Manage Project & Team <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedProjectId(p.id);
                        setIsCreateTaskOpen(true);
                      }}
                      leftIcon={<Plus className="w-3.5 h-3.5" />}
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

      {/* Team Workload & Upcoming Deadlines Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Workload Table */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-subtle lg:col-span-2">
          <h3 className="text-base font-bold text-slate-900 mb-1">Team Member Workload</h3>
          <p className="text-xs text-slate-500 mb-4">Task fulfillment per member across your projects</p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-semibold border-y border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Member</th>
                  <th className="py-2.5 px-3">Total Tasks</th>
                  <th className="py-2.5 px-3">Completed</th>
                  <th className="py-2.5 px-3">In Progress</th>
                  <th className="py-2.5 px-3">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {memberPerformance.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-slate-400">
                      No team members assigned yet.
                    </td>
                  </tr>
                ) : (
                  memberPerformance.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/60">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={
                              m.avatar ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                m.name
                              )}&background=10b981&color=fff`
                            }
                            alt={m.name}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <div>
                            <span className="font-semibold text-slate-900 block">{m.name}</span>
                            <span className="text-[10px] text-slate-400">
                              {m.department || 'General'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-800">{m.totalTasks}</td>
                      <td className="py-3 px-3 text-emerald-600 font-semibold">{m.completedTasks}</td>
                      <td className="py-3 px-3 text-blue-600 font-semibold">{m.inProgressTasks}</td>
                      <td className="py-3 px-3 w-36">
                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <ProgressBar progress={m.progress} size="sm" />
                          </div>
                          <span className="font-semibold text-slate-700 text-[11px]">
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

        {/* Urgent Deadlines */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-subtle">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-brand-600" />
            Upcoming Deadlines
          </h3>
          <p className="text-xs text-slate-500 mb-4">Milestones due soon across your projects</p>

          <div className="space-y-3">
            {upcomingDeadlines.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No pending milestones.</p>
            ) : (
              upcomingDeadlines.map((t) => (
                <div
                  key={t.id}
                  className="p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-all text-xs"
                >
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <p className="font-semibold text-slate-900 leading-snug">{t.title}</p>
                    <PriorityBadge priority={t.priority} size="sm" />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
                    <span>{t.assignedTo?.name || 'Unassigned'}</span>
                    {t.deadline && (
                      <span className="font-medium text-slate-700">
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
    </div>
  );
};
