import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { dashboardApi } from '../api/client';
import {
  BarChart3,
  TrendingUp,
  FolderKanban,
  CheckSquare,
  Users,
  PieChart as PieIcon,
  ShieldCheck,
  AlertCircle,
  Clock,
  ArrowUpRight,
  Layers,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from 'recharts';
import { AnimatedCounter } from '../components/common/AnimatedCounter';
import { Skeleton } from '../components/common/CommonUI';

import type { Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface-900 border border-surface-700/80 rounded-lg px-3 py-2 shadow-xl text-xs text-surface-100">
        <p className="font-semibold text-surface-200">{label}</p>
        <p className="text-brand-400 font-mono mt-0.5">
          {payload[0].value} {payload[0].dataKey === 'count' ? 'items' : ''}
        </p>
      </div>
    );
  }
  return null;
};

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
        <Skeleton className="h-20 rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80 rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    );
  }

  const { kpis, priorityDistribution, departmentDistribution, projectProgressList } = data;

  const totalDeptCount = departmentDistribution.reduce((acc: number, d: any) => acc + d.count, 0);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Editorial Header */}
      <motion.div variants={itemVariants} className="border-b border-border pb-5">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-brand-500/10 text-brand-600 border border-brand-500/20">
            <TrendingUp className="w-3 h-3" />
            Performance Intelligence
          </span>
        </div>
        <h1 className="text-2xl font-bold text-surface-900 tracking-tight">
          Club Analytics & Insights
        </h1>
        <p className="text-sm text-surface-500 mt-1 max-w-2xl">
          Real-time telemetry across project deliverables, organizational velocity, and member department representation.
        </p>
      </motion.div>

      {/* KPI Metric Strip */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-0 border border-border rounded-xl p-5 hover:border-surface-300 transition-colors shadow-subtle">
          <div className="flex items-center justify-between text-xs font-semibold text-surface-500 uppercase tracking-wider">
            <span>Overall Completion</span>
            <CheckSquare className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-3xl font-bold font-mono tracking-tight text-surface-900">
              <AnimatedCounter value={kpis.clubCompletionRate} />
            </span>
            <span className="text-lg font-semibold text-surface-500">%</span>
          </div>
          <p className="text-xs text-surface-500 mt-1.5">
            {kpis.completedTasks} of {kpis.totalTasks} deliverables done
          </p>
        </div>

        <div className="bg-surface-0 border border-border rounded-xl p-5 hover:border-surface-300 transition-colors shadow-subtle">
          <div className="flex items-center justify-between text-xs font-semibold text-surface-500 uppercase tracking-wider">
            <span>Active Project Load</span>
            <FolderKanban className="w-4 h-4 text-brand-600" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold font-mono tracking-tight text-surface-900">
              <AnimatedCounter value={kpis.activeProjects} />
            </span>
          </div>
          <p className="text-xs text-surface-500 mt-1.5">
            Across {kpis.totalProjects} tracked club initiatives
          </p>
        </div>

        <div className="bg-surface-0 border border-border rounded-xl p-5 hover:border-surface-300 transition-colors shadow-subtle">
          <div className="flex items-center justify-between text-xs font-semibold text-surface-500 uppercase tracking-wider">
            <span>Active Engagement</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold font-mono tracking-tight text-surface-900">
              <AnimatedCounter value={kpis.activeMembers} />
            </span>
          </div>
          <p className="text-xs text-surface-500 mt-1.5">
            Out of {kpis.totalMembers} enrolled club members
          </p>
        </div>

        <div className="bg-surface-0 border border-border rounded-xl p-5 hover:border-surface-300 transition-colors shadow-subtle">
          <div className="flex items-center justify-between text-xs font-semibold text-surface-500 uppercase tracking-wider">
            <span>Overdue Deliverables</span>
            <AlertCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold font-mono tracking-tight text-rose-600">
              <AnimatedCounter value={kpis.overdueTasks} />
            </span>
          </div>
          <p className="text-xs text-surface-500 mt-1.5">
            {kpis.overdueTasks === 0 ? 'All milestones on schedule' : 'Requiring urgent attention'}
          </p>
        </div>
      </motion.div>

      {/* Charts Section */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Distribution */}
        <div className="bg-surface-0 border border-border rounded-xl p-6 shadow-subtle">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-surface-900">Department Representation</h2>
              <p className="text-xs text-surface-500 mt-0.5">Enrolled member allocation across academic majors</p>
            </div>
            <span className="text-xs font-mono text-surface-500">{totalDeptCount} Members</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={departmentDistribution}
                layout="vertical"
                margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(0,0,0,0.04)" />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis
                  dataKey="department"
                  type="category"
                  width={120}
                  tick={{ fontSize: 11, fill: '#334155' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-3">
            {departmentDistribution.map((d: any) => {
              const pct = totalDeptCount ? Math.round((d.count / totalDeptCount) * 100) : 0;
              return (
                <div key={d.department} className="flex items-center gap-1.5 text-xs text-surface-600 bg-surface-50 px-2.5 py-1 rounded-md border border-border/60">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="font-medium text-surface-700">{d.department}:</span>
                  <span className="font-mono text-surface-500">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="bg-surface-0 border border-border rounded-xl p-6 shadow-subtle">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-surface-900">Task Priority Breakdown</h2>
              <p className="text-xs text-surface-500 mt-0.5">Active deliverables organized by urgency rating</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={priorityDistribution}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.04)" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#334155' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={32}>
                  {priorityDistribution.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs text-surface-500">
            {priorityDistribution.map((p: any) => (
              <div key={p.name} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                <span className="font-medium text-surface-700">{p.name}</span>
                <span className="font-mono text-surface-400">({p.count})</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Project Momentum Summary Table */}
      <motion.div variants={itemVariants} className="bg-surface-0 border border-border rounded-xl p-6 shadow-subtle">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-surface-900">Initiative Momentum Matrix</h2>
            <p className="text-xs text-surface-500 mt-0.5">Progress and workload density for all active club initiatives</p>
          </div>
          <span className="text-xs font-mono text-surface-500">{projectProgressList.length} Initiatives</span>
        </div>

        <div className="divide-y divide-border">
          {projectProgressList.map((p: any) => (
            <div key={p.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-surface-50/50 px-2 rounded-lg transition-colors">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-surface-900">{p.name}</span>
                  <span className="text-[11px] font-mono text-surface-400">
                    {p.completedTasks}/{p.taskCount} tasks
                  </span>
                </div>
                <div className="w-full sm:max-w-md bg-surface-100 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div
                    className="bg-brand-500 h-full rounded-full transition-all duration-700"
                    style={{ width: `${p.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <div className="text-right">
                  <span className="font-mono font-semibold text-surface-900">{p.progress}%</span>
                  <span className="text-surface-400 ml-1">complete</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};
