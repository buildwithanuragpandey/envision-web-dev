import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi, projectApi, userApi } from '../api/client';
import {
  Users,
  FolderKanban,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Plus,
  ArrowUpRight,
  Activity,
  Calendar,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { ProgressBar, Skeleton } from '../components/common/CommonUI';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import { Link } from 'react-router-dom';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from 'recharts';
import { ProjectModal } from '../components/projects/ProjectModal';
import { MemberModal } from '../components/members/MemberModal';
import { format } from 'date-fns';
import { useToast } from '../context/ToastContext';

export const AdminDashboardPage: React.FC = () => {
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
      success('Project Created', `Project "${formData.name}" has been created successfully.`);
      refetch();
    } catch (err: any) {
      error('Creation Failed', err.response?.data?.error || 'Failed to create project');
      throw err;
    }
  };

  const handleAddMember = async (formData: any) => {
    try {
      await userApi.createUser(formData);
      success('Member Added', `Account for "${formData.name}" created successfully.`);
      refetch();
    } catch (err: any) {
      error('Failed to Add Member', err.response?.data?.error || 'Could not create member account');
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-80 rounded-2xl lg:col-span-2" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      </div>
    );
  }

  const { kpis, projectProgressList, taskStatusDistribution, priorityDistribution, upcomingDeadlines, recentActivities } =
    data;

  return (
    <div className="space-y-6">
      {/* Top Welcome & Quick Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-subtle">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Club Executive Overview
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time status, active project progress, and task fulfillment across all teams.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsAddMemberOpen(true)}
            leftIcon={<Users className="w-4 h-4" />}
          >
            Add Member
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsCreateProjectOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            New Project
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Members */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Members</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900">{kpis.totalMembers}</span>
            <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-md">
              {kpis.activeMembers} active
            </span>
          </div>
        </div>

        {/* Active Projects */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Projects</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <FolderKanban className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900">{kpis.activeProjects}</span>
            <span className="text-xs text-slate-500 font-medium">
              {kpis.completedProjects} completed
            </span>
          </div>
        </div>

        {/* Task Completion Rate */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Overall Completion</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900">{kpis.clubCompletionRate}%</span>
            <span className="text-xs text-slate-500 font-medium">
              {kpis.completedTasks}/{kpis.totalTasks} tasks
            </span>
          </div>
        </div>

        {/* Overdue & Pending */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Tasks</span>
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

      {/* Main Content Grid: Projects Progress & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Projects Progress Table */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-subtle lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Active Projects Progress</h3>
              <p className="text-xs text-slate-500">Calculated completion rates from completed tasks</p>
            </div>
            <Link
              to="/projects"
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              View all <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-4 mt-2">
            {projectProgressList.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No projects registered yet.</p>
            ) : (
              projectProgressList.map((p) => (
                <div
                  key={p.id}
                  className="p-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition-all"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0">
                      <Link
                        to={`/projects/${p.id}`}
                        className="text-sm font-semibold text-slate-900 hover:text-brand-600 transition-colors truncate block"
                      >
                        {p.name}
                      </Link>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
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
                  <ProgressBar progress={p.progress} showText={true} size="md" />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Task Distribution Donut Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-subtle flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Task Status Distribution</h3>
            <p className="text-xs text-slate-500 mb-2">Breakdown of all club deliverables</p>

            <div className="h-52 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskStatusDistribution}
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="count"
                  >
                    {taskStatusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center">
            {taskStatusDistribution.map((item) => (
              <div key={item.name} className="p-2 rounded-lg bg-slate-50">
                <div className="text-[11px] text-slate-500 font-medium">{item.name}</div>
                <div className="text-sm font-bold text-slate-900 mt-0.5">{item.count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lower Grid: Upcoming Deadlines & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Deadlines */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-subtle">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand-600" />
                Upcoming Task Deadlines
              </h3>
              <p className="text-xs text-slate-500">Ordered by nearest target dates</p>
            </div>
            <Link
              to="/tasks"
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              All tasks <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {upcomingDeadlines.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No pending deadlines.</p>
            ) : (
              upcomingDeadlines.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-all text-xs"
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <p className="font-semibold text-slate-900 truncate">{t.title}</p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {t.project?.name} • Assigned to {t.assignedTo?.name || 'Unassigned'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <PriorityBadge priority={t.priority} size="sm" />
                    {t.deadline && (
                      <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                        {format(new Date(t.deadline), 'MMM dd')}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-subtle">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-600" />
                Recent Club Activity
              </h3>
              <p className="text-xs text-slate-500">Live audit log of changes and updates</p>
            </div>
          </div>

          <div className="space-y-3">
            {recentActivities.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No recent activity logged.</p>
            ) : (
              recentActivities.map((log) => (
                <div key={log.id} className="flex items-start gap-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-brand-500 mt-1.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-800 font-medium leading-tight">{log.description}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
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
    </div>
  );
};
