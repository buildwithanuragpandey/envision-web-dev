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
  AlertCircle,
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
import { Skeleton, ProgressBar } from '../components/common/CommonUI';

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
      <div className="bg-[#0A0A0C] border border-white/10 rounded-lg px-3 py-2 shadow-xl text-xs text-[#F5F5F0]">
        <p className="font-semibold text-zinc-300">{label}</p>
        <p className="text-[#FF6814] font-mono mt-0.5">
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
        <Skeleton className="h-20 rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80 rounded-lg" />
          <Skeleton className="h-80 rounded-lg" />
        </div>
      </div>
    );
  }

  const { kpis, priorityDistribution, departmentDistribution, projectProgressList } = data;

  const totalDeptCount = departmentDistribution.reduce((acc: number, d: any) => acc + d.count, 0);

  // Priority color map using Brand Orange & Yellow
  const priorityColorMap: Record<string, string> = {
    URGENT: '#ef4444',
    HIGH: '#FF6814',
    MEDIUM: '#FFDD00',
    LOW: '#71717a',
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 text-[#F5F5F0]"
    >
      {/* Editorial Header */}
      <motion.div variants={itemVariants} className="border-b border-white/8 pb-4">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#111114] text-[#FFDD00] border border-white/10">
            <TrendingUp className="w-3 h-3 text-[#FFDD00]" />
            PERFORMANCE INTELLIGENCE
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F5F0] tracking-tight">
          Club Analytics & Insights
        </h1>
        <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
          Real-time telemetry across project deliverables, organizational velocity, and member department representation.
        </p>
      </motion.div>

      {/* KPI Metric Strip */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-[#0A0A0C] border border-white/8 rounded-lg p-5 hover:border-[#FF6814]/30 transition-colors shadow-subtle">
          <div className="flex items-center justify-between text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-wider">
            <span>Overall Completion</span>
            <CheckSquare className="w-4 h-4 text-[#FFDD00]" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-bold font-mono tracking-tight text-[#FF6814]">
              <AnimatedCounter value={kpis.clubCompletionRate} />
            </span>
            <span className="text-lg font-semibold text-zinc-500">%</span>
          </div>
          <p className="text-xs text-zinc-500 mt-1 font-mono">
            {kpis.completedTasks} of {kpis.totalTasks} deliverables fulfilled
          </p>
        </div>

        <div className="bg-[#0A0A0C] border border-white/8 rounded-lg p-5 hover:border-[#FF6814]/30 transition-colors shadow-subtle">
          <div className="flex items-center justify-between text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-wider">
            <span>Active Initiatives</span>
            <FolderKanban className="w-4 h-4 text-[#FF6814]" />
          </div>
          <div className="mt-2">
            <span className="text-3xl font-bold font-mono tracking-tight text-[#F5F5F0]">
              <AnimatedCounter value={kpis.activeProjects} />
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-1 font-mono">
            Across {kpis.totalProjects} tracked club projects
          </p>
        </div>

        <div className="bg-[#0A0A0C] border border-white/8 rounded-lg p-5 hover:border-[#FF6814]/30 transition-colors shadow-subtle">
          <div className="flex items-center justify-between text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-wider">
            <span>Active Contributors</span>
            <Users className="w-4 h-4 text-[#FFDD00]" />
          </div>
          <div className="mt-2">
            <span className="text-3xl font-bold font-mono tracking-tight text-[#F5F5F0]">
              <AnimatedCounter value={kpis.activeMembers} />
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-1 font-mono">
            Out of {kpis.totalMembers} enrolled students
          </p>
        </div>

        <div className="bg-[#0A0A0C] border border-white/8 rounded-lg p-5 hover:border-[#FF6814]/30 transition-colors shadow-subtle">
          <div className="flex items-center justify-between text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-wider">
            <span>Overdue Deliverables</span>
            <AlertCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-2">
            <span className="text-3xl font-bold font-mono tracking-tight text-rose-400">
              <AnimatedCounter value={kpis.overdueTasks} />
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-1 font-mono">
            {kpis.overdueTasks === 0 ? 'All milestones on schedule' : 'Requiring team focus'}
          </p>
        </div>
      </motion.div>

      {/* Charts Section */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Department Distribution */}
        <div className="bg-[#0A0A0C] border border-white/8 rounded-lg p-6 shadow-subtle">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-bold text-[#F5F5F0]">Department Representation</h2>
              <p className="text-xs text-zinc-400 mt-0.5">Enrolled member allocation across academic departments</p>
            </div>
            <span className="text-xs font-mono text-[#FFDD00] bg-[#111114] px-2 py-0.5 rounded border border-white/5">{totalDeptCount} Students</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={departmentDistribution}
                layout="vertical"
                margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: '#71717a' }} axisLine={false} tickLine={false} />
                <YAxis
                  dataKey="department"
                  type="category"
                  width={120}
                  tick={{ fontSize: 11, fill: '#a1a1aa' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#FF6814" radius={[0, 4, 4, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap gap-2.5">
            {departmentDistribution.map((d: any) => {
              const pct = totalDeptCount ? Math.round((d.count / totalDeptCount) * 100) : 0;
              return (
                <div key={d.department} className="flex items-center gap-1.5 text-xs text-zinc-300 bg-[#111114] px-2.5 py-1 rounded border border-white/5">
                  <span className="w-2 h-2 rounded-full bg-[#FF6814]" />
                  <span className="font-medium text-zinc-300">{d.department}:</span>
                  <span className="font-mono text-[#FFDD00]">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="bg-[#0A0A0C] border border-white/8 rounded-lg p-6 shadow-subtle">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-bold text-[#F5F5F0]">Task Priority Breakdown</h2>
              <p className="text-xs text-zinc-400 mt-0.5">Active deliverables organized by urgency rating</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={priorityDistribution}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#a1a1aa' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#71717a' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={32}>
                  {priorityDistribution.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={priorityColorMap[entry.name] || '#FF6814'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-zinc-400">
            {priorityDistribution.map((p: any) => (
              <div key={p.name} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: priorityColorMap[p.name] || '#FF6814' }} />
                <span className="font-medium text-zinc-300">{p.name}</span>
                <span className="font-mono text-zinc-500">({p.count})</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Project Momentum Summary Table */}
      <motion.div variants={itemVariants} className="bg-[#0A0A0C] border border-white/8 rounded-lg p-6 shadow-subtle">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-[#F5F5F0]">Initiative Velocity Matrix</h2>
            <p className="text-xs text-zinc-400 mt-0.5">Progress and workload density for all active club initiatives</p>
          </div>
          <span className="text-xs font-mono text-[#FFDD00] bg-[#111114] px-2 py-0.5 rounded border border-white/5">{projectProgressList.length} Initiatives</span>
        </div>

        <div className="divide-y divide-white/5">
          {projectProgressList.map((p: any) => (
            <div key={p.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#111114]/60 px-2 rounded-lg transition-colors">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#F5F5F0]">{p.name}</span>
                  <span className="text-[11px] font-mono text-zinc-500">
                    {p.completedTasks}/{p.taskCount} tasks
                  </span>
                </div>
                <div className="w-full sm:max-w-md mt-2">
                  <ProgressBar progress={p.progress} size="sm" />
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <div className="text-right">
                  <span className="font-mono font-semibold text-[#FF6814]">{p.progress}%</span>
                  <span className="text-zinc-500 ml-1">complete</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};
