import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/client';
import {
  BarChart3,
  TrendingUp,
  FolderKanban,
  CheckSquare,
  Users,
  PieChart as PieIcon,
  ShieldCheck,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Skeleton } from '../components/common/CommonUI';

export const AnalyticsPage: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['analytics-overview'],
    queryFn: async () => {
      const res = await dashboardApi.getAdminDashboard();
      return res.data;
    },
  });

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-28 rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-80 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      </div>
    );
  }

  const { kpis, taskStatusDistribution, priorityDistribution, departmentDistribution, projectProgressList } =
    data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-subtle">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Club Analytics & Insights
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Quantitative metrics on project deliverables, team workload, and department representation.
        </p>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Overall Completion Rate
          </div>
          <div className="mt-3 text-3xl font-extrabold text-slate-900">
            {kpis.clubCompletionRate}%
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {kpis.completedTasks} of {kpis.totalTasks} tasks fulfilled
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Active Project Load
          </div>
          <div className="mt-3 text-3xl font-extrabold text-slate-900">{kpis.activeProjects}</div>
          <p className="text-[11px] text-slate-500 mt-1">
            Across {kpis.totalProjects} total club projects
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Active Member Engagement
          </div>
          <div className="mt-3 text-3xl font-extrabold text-slate-900">{kpis.activeMembers}</div>
          <p className="text-[11px] text-slate-500 mt-1">
            Out of {kpis.totalMembers} enrolled club members
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Overdue Deliverables
          </div>
          <div className="mt-3 text-3xl font-extrabold text-rose-600">{kpis.overdueTasks}</div>
          <p className="text-[11px] text-slate-500 mt-1">Requiring expedited completion</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Participation Bar Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-subtle">
          <h3 className="text-base font-bold text-slate-900 mb-1">Department Representation</h3>
          <p className="text-xs text-slate-500 mb-4">Member distribution by academic major</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentDistribution} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" allowDecimals={false} />
                <YAxis dataKey="department" type="category" width={110} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" fill="#10B981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Breakdown Bar Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-subtle">
          <h3 className="text-base font-bold text-slate-900 mb-1">Task Priority Distribution</h3>
          <p className="text-xs text-slate-500 mb-4">Work breakdown across urgency tiers</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityDistribution}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {priorityDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
