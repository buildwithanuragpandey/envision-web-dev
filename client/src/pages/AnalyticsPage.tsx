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
      className="space-y-6 text-[#F5F2EA]"
    >
      {/* Editorial Header with Frame 04 Halo Visual */}
      <motion.div variants={itemVariants} className="relative rounded-xl border border-white/8 bg-[#0D0D0F] overflow-hidden shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-12 items-center">
          <div className="p-6 sm:p-8 md:col-span-7 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#FFD400] font-semibold bg-[#141416] px-2.5 py-1 rounded border border-white/8">
                04 / TELEMETRY WORKSPACE
              </span>
              <span className="text-[11px] font-mono text-[#8C8A84]">
                PERFORMANCE INTELLIGENCE
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#F5F2EA] tracking-tight">
              Club Telemetry & Analytics
            </h1>
            <p className="text-xs sm:text-sm text-[#8C8A84] leading-relaxed max-w-lg">
              Real-time telemetry across project deliverable velocity, resource allocation, and squad completion momentum.
            </p>
          </div>

          <div className="md:col-span-5 h-48 md:h-64 relative overflow-hidden border-t md:border-t-0 md:border-l border-white/8 group">
            <img
              src="/frames/04_halo.jpg"
              alt="Halo Innovation Center"
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0D0D0F] via-transparent to-transparent opacity-90" />
            <div className="absolute bottom-3 right-3 bg-[#050505]/80 backdrop-blur-md px-2.5 py-1 rounded border border-white/10 text-[10px] font-mono text-[#F5F2EA]">
              04 / HALO
            </div>
            <div className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-[#FF6A16] to-transparent animate-travel-line" />
          </div>
        </div>
      </motion.div>

      {/* KPI Metric Strip */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-[#0D0D0F] border border-white/8 rounded-xl p-5 hover:border-[#FF6A16]/30 transition-colors shadow-subtle">
          <div className="flex items-center justify-between text-[10px] font-mono font-semibold text-[#8C8A84] uppercase tracking-wider">
            <span>Overall Completion</span>
            <CheckSquare className="w-4 h-4 text-[#FFD400]" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-bold font-mono tracking-tight text-[#FF6A16]">
              <AnimatedCounter value={kpis.clubCompletionRate} />
            </span>
            <span className="text-lg font-semibold text-[#8C8A84]">%</span>
          </div>
          <p className="text-xs text-[#8C8A84] mt-1 font-mono">
            {kpis.completedTasks} of {kpis.totalTasks} deliverables fulfilled
          </p>
        </div>

        <div className="bg-[#0D0D0F] border border-white/8 rounded-xl p-5 hover:border-[#FF6A16]/30 transition-colors shadow-subtle">
          <div className="flex items-center justify-between text-[10px] font-mono font-semibold text-[#8C8A84] uppercase tracking-wider">
            <span>Active Initiatives</span>
            <FolderKanban className="w-4 h-4 text-[#FF6A16]" />
          </div>
          <div className="mt-2">
            <span className="text-3xl font-bold font-mono tracking-tight text-[#F5F2EA]">
              <AnimatedCounter value={kpis.activeProjects} />
            </span>
          </div>
          <p className="text-xs text-[#8C8A84] mt-1 font-mono">
            Across {kpis.totalProjects} tracked club projects
          </p>
        </div>

        <div className="bg-[#0D0D0F] border border-white/8 rounded-xl p-5 hover:border-[#FF6A16]/30 transition-colors shadow-subtle">
          <div className="flex items-center justify-between text-[10px] font-mono font-semibold text-[#8C8A84] uppercase tracking-wider">
            <span>Active Contributors</span>
            <Users className="w-4 h-4 text-[#FFD400]" />
          </div>
          <div className="mt-2">
            <span className="text-3xl font-bold font-mono tracking-tight text-[#F5F2EA]">
              <AnimatedCounter value={kpis.activeMembers} />
            </span>
          </div>
          <p className="text-xs text-[#8C8A84] mt-1 font-mono">
            Out of {kpis.totalMembers} enrolled students
          </p>
        </div>

        <div className="bg-[#0D0D0F] border border-white/8 rounded-xl p-5 hover:border-[#FF6A16]/30 transition-colors shadow-subtle">
          <div className="flex items-center justify-between text-[10px] font-mono font-semibold text-[#8C8A84] uppercase tracking-wider">
            <span>Overdue Deliverables</span>
            <AlertCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-2">
            <span className="text-3xl font-bold font-mono tracking-tight text-rose-400">
              <AnimatedCounter value={kpis.overdueTasks} />
            </span>
          </div>
          <p className="text-xs text-[#8C8A84] mt-1 font-mono">
            {kpis.overdueTasks === 0 ? 'All milestones on schedule' : 'Requiring team focus'}
          </p>
        </div>
      </motion.div>

      {/* Charts Section */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Department Distribution */}
        <div className="bg-[#0D0D0F] border border-white/8 rounded-xl p-6 shadow-subtle">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-bold text-[#F5F2EA]">Department Representation</h2>
              <p className="text-xs text-[#8C8A84] mt-0.5">Enrolled member allocation across academic departments</p>
            </div>
            <span className="text-xs font-mono text-[#FFD400] bg-[#141416] px-2.5 py-1 rounded border border-white/8">{totalDeptCount} Students</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={departmentDistribution}
                layout="vertical"
                margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: '#8C8A84' }} axisLine={false} tickLine={false} />
                <YAxis
                  dataKey="department"
                  type="category"
                  width={120}
                  tick={{ fontSize: 11, fill: '#F5F2EA' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#FF6A16" radius={[0, 4, 4, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap gap-2.5">
            {departmentDistribution.map((d: any) => {
              const pct = totalDeptCount ? Math.round((d.count / totalDeptCount) * 100) : 0;
              return (
                <div key={d.department} className="flex items-center gap-1.5 text-xs text-[#F5F2EA] bg-[#141416] px-2.5 py-1 rounded border border-white/5">
                  <span className="w-2 h-2 rounded-full bg-[#FF6A16]" />
                  <span className="font-medium text-[#F5F2EA]">{d.department}:</span>
                  <span className="font-mono text-[#FFD400]">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="bg-[#0D0D0F] border border-white/8 rounded-xl p-6 shadow-subtle">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-bold text-[#F5F2EA]">Task Priority Breakdown</h2>
              <p className="text-xs text-[#8C8A84] mt-0.5">Active deliverables organized by urgency rating</p>
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
                  tick={{ fontSize: 11, fill: '#F5F2EA' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#8C8A84' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={32}>
                  {priorityDistribution.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={priorityColorMap[entry.name] || '#FF6A16'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-[#8C8A84]">
            {priorityDistribution.map((p: any) => (
              <div key={p.name} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: priorityColorMap[p.name] || '#FF6A16' }} />
                <span className="font-medium text-[#F5F2EA]">{p.name}</span>
                <span className="font-mono text-[#8C8A84]">({p.count})</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Project Momentum Summary Table */}
      <motion.div variants={itemVariants} className="bg-[#0D0D0F] border border-white/8 rounded-xl p-6 shadow-subtle">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-[#F5F2EA]">Initiative Velocity Matrix</h2>
            <p className="text-xs text-[#8C8A84] mt-0.5">Progress and workload density for all active club initiatives</p>
          </div>
          <span className="text-xs font-mono text-[#FFD400] bg-[#141416] px-2.5 py-1 rounded border border-white/8">{projectProgressList.length} Initiatives</span>
        </div>

        <div className="divide-y divide-white/5">
          {projectProgressList.map((p: any) => (
            <div key={p.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#141416]/60 px-2 rounded-lg transition-colors">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#F5F2EA]">{p.name}</span>
                  <span className="text-[11px] font-mono text-[#8C8A84]">
                    {p.completedTasks}/{p.taskCount} tasks
                  </span>
                </div>
                <div className="w-full sm:max-w-md mt-2">
                  <ProgressBar progress={p.progress} size="sm" />
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <div className="text-right">
                  <span className="font-mono font-bold text-[#FF6A16]">{p.progress}%</span>
                  <span className="text-[#8C8A84] ml-1">complete</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};
