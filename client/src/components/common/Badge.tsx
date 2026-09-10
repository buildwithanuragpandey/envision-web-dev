import React from 'react';
import { TaskPriority, TaskStatus, ProjectStatus, UserRole } from '../../types';

interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'neutral';
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
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    neutral: 'bg-slate-100 text-slate-600 border-slate-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs font-medium',
    md: 'px-2.5 py-1 text-xs font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
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
        <Badge variant="success" size={size}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Completed
        </Badge>
      );
    case 'IN_PROGRESS':
    case 'ACTIVE':
      return (
        <Badge variant="info" size={size}>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          {status === 'ACTIVE' ? 'Active' : 'In Progress'}
        </Badge>
      );
    case 'TODO':
      return (
        <Badge variant="warning" size={size}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          To Do
        </Badge>
      );
    case 'PLANNING':
      return (
        <Badge variant="purple" size={size}>
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
          Planning
        </Badge>
      );
    case 'ARCHIVED':
      return (
        <Badge variant="neutral" size={size}>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          Archived
        </Badge>
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
        <Badge variant="danger" size={size}>
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          Urgent
        </Badge>
      );
    case 'HIGH':
      return (
        <Badge variant="warning" size={size}>
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
          High
        </Badge>
      );
    case 'MEDIUM':
      return (
        <Badge variant="info" size={size}>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          Medium
        </Badge>
      );
    case 'LOW':
      return (
        <Badge variant="neutral" size={size}>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          Low
        </Badge>
      );
    default:
      return <Badge size={size}>{priority}</Badge>;
  }
};

export const RoleBadge: React.FC<{ role: UserRole; size?: 'sm' | 'md' }> = ({ role, size = 'md' }) => {
  switch (role) {
    case 'ADMIN':
      return (
        <Badge variant="purple" size={size}>
          Admin
        </Badge>
      );
    case 'PROJECT_LEAD':
      return (
        <Badge variant="info" size={size}>
          Project Lead
        </Badge>
      );
    case 'MEMBER':
      return (
        <Badge variant="success" size={size}>
          Member
        </Badge>
      );
    default:
      return <Badge size={size}>{role}</Badge>;
  }
};
