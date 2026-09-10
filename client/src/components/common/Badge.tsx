import React from 'react';
import { TaskPriority, TaskStatus, ProjectStatus, UserRole } from '../../types';

interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'orange' | 'yellow' | 'neutral';
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className = '',
  size = 'md',
}) => {
  const variantStyles = {
    default: 'bg-[#16161A] text-[#F5F5F0] border-white/10',
    neutral: 'bg-[#111114] text-[#A1A1A1] border-white/8',
    orange: 'bg-[#2A1105] text-[#FF8540] border-[#FF6814]/30',
    yellow: 'bg-[#262104] text-[#FFDD00] border-[#FFDD00]/30',
    success: 'bg-[#0E2314] text-[#4ADE80] border-[#4ADE80]/30',
    warning: 'bg-[#262104] text-[#FFDD00] border-[#FFDD00]/30',
    danger: 'bg-[#2A0C0E] text-[#FF6B6B] border-[#FF6B6B]/30',
    info: 'bg-[#0C1E2E] text-[#60A5FA] border-[#60A5FA]/30',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[10px] font-medium tracking-tight rounded-md',
    md: 'px-2.5 py-0.5 text-xs font-medium tracking-tight rounded-md',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 border font-mono select-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};

export const StatusBadge: React.FC<{ status: TaskStatus | ProjectStatus; size?: 'sm' | 'md' }> = ({
  status,
  size = 'md',
}) => {
  switch (status) {
    case 'COMPLETED':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-[#0E2314] text-[#4ADE80] border border-[#4ADE80]/30 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80]" />
          Completed
        </span>
      );
    case 'IN_PROGRESS':
    case 'ACTIVE':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-[#2A1105] text-[#FF8540] border border-[#FF6814]/40 font-mono shadow-glow-orange">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF6814] animate-pulse" />
          {status === 'ACTIVE' ? 'Active' : 'In Progress'}
        </span>
      );
    case 'TODO':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-[#141418] text-[#A1A1A1] border border-white/10 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
          To Do
        </span>
      );
    case 'PLANNING':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-[#262104] text-[#FFDD00] border border-[#FFDD00]/30 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FFDD00]" />
          Planning
        </span>
      );
    case 'ARCHIVED':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-[#111114] text-[#686868] border border-white/6 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
          Archived
        </span>
      );
    default:
      return <Badge size={size}>{status}</Badge>;
  }
};

export const PriorityBadge: React.FC<{ priority: TaskPriority; size?: 'sm' | 'md' }> = ({
  priority,
  size = 'md',
}) => {
  switch (priority) {
    case 'URGENT':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-[#330C0E] text-[#FF4D4D] border border-[#FF4D4D]/40">
          <span className="w-1 h-1 rounded-full bg-[#FF4D4D]" />
          Urgent
        </span>
      );
    case 'HIGH':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-[#2A1105] text-[#FF8540] border border-[#FF6814]/40">
          <span className="w-1 h-1 rounded-full bg-[#FF6814]" />
          High
        </span>
      );
    case 'MEDIUM':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-[#262104] text-[#FFDD00] border border-[#FFDD00]/40">
          <span className="w-1 h-1 rounded-full bg-[#FFDD00]" />
          Medium
        </span>
      );
    case 'LOW':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium font-mono uppercase bg-[#141418] text-[#A1A1A1] border border-white/8">
          <span className="w-1 h-1 rounded-full bg-zinc-500" />
          Low
        </span>
      );
    default:
      return <Badge size={size}>{priority}</Badge>;
  }
};

export const RoleBadge: React.FC<{ role: UserRole; size?: 'sm' | 'md' }> = ({ role, size = 'md' }) => {
  switch (role) {
    case 'ADMIN':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold font-mono uppercase tracking-wider bg-[#1F0C05] text-[#FF6814] border border-[#FF6814]/40 shadow-glow-orange">
          Advisor / Admin
        </span>
      );
    case 'PROJECT_LEAD':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold font-mono uppercase tracking-wider bg-[#241F04] text-[#FFDD00] border border-[#FFDD00]/40">
          Project Lead
        </span>
      );
    case 'MEMBER':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold font-mono uppercase tracking-wider bg-[#141418] text-[#F5F5F0] border border-white/10">
          Member
        </span>
      );
    default:
      return <Badge size={size}>{role}</Badge>;
  }
};
