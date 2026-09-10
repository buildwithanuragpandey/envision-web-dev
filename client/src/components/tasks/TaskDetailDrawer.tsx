import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  FolderKanban,
  User,
  Trash2,
  ExternalLink,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { Task, TaskPriority, TaskStatus } from '../../types';
import { Avatar } from '../common/Avatar';
import { StatusBadge, PriorityBadge } from '../common/Badge';
import { format, formatDistanceToNow, isPast, isToday, isTomorrow } from 'date-fns';
import { Link } from 'react-router-dom';

interface TaskDetailDrawerProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange?: (taskId: string, newStatus: TaskStatus) => Promise<void>;
  onDelete?: (taskId: string) => Promise<void>;
  canEdit?: boolean;
}

export const formatTaskDeadline = (deadlineDate?: string | Date | null) => {
  if (!deadlineDate) return null;
  const d = new Date(deadlineDate);
  if (isToday(d)) return { text: 'Due today', isOverdue: false, isUrgent: true };
  if (isTomorrow(d)) return { text: 'Due tomorrow', isOverdue: false, isUrgent: false };
  if (isPast(d)) {
    return {
      text: `Overdue by ${formatDistanceToNow(d)}`,
      isOverdue: true,
      isUrgent: true,
    };
  }
  return {
    text: `Due in ${formatDistanceToNow(d)} (${format(d, 'MMM dd')})`,
    isOverdue: false,
    isUrgent: false,
  };
};

export const TaskDetailDrawer: React.FC<TaskDetailDrawerProps> = ({
  task,
  isOpen,
  onClose,
  onStatusChange,
  onDelete,
  canEdit = true,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);

  if (!task) return null;

  const deadlineInfo = formatTaskDeadline(task.deadline);

  const handleStatusClick = async (newStatus: TaskStatus) => {
    if (!onStatusChange || task.status === newStatus || isUpdating) return;
    setIsUpdating(true);
    try {
      await onStatusChange(task.id, newStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-zinc-950/40 backdrop-blur-sm transition-opacity"
          />

          {/* Slide-over Drawer Panel */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 350 }}
              className="w-screen max-w-lg bg-white border-l border-zinc-200/80 shadow-2xl flex flex-col justify-between"
            >
              {/* Header */}
              <div className="p-6 border-b border-zinc-200/80 flex items-center justify-between bg-zinc-50/50">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs uppercase font-semibold text-zinc-400">
                    Task Details
                  </span>
                  <span className="text-zinc-300">•</span>
                  <span className="text-xs font-mono text-zinc-500">
                    ID: {task.id.slice(-6).toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {canEdit && onDelete && (
                    <button
                      type="button"
                      onClick={() => onDelete(task.id)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={onClose}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Title */}
                <div>
                  <h2 className="text-xl font-bold text-zinc-900 tracking-tight leading-snug">
                    {task.title}
                  </h2>
                </div>

                {/* Status Quick Progression Buttons */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-mono uppercase font-semibold text-zinc-400">
                    Status Progression
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['TODO', 'IN_PROGRESS', 'COMPLETED'] as TaskStatus[]).map((st) => {
                      const isActive = task.status === st;
                      return (
                        <button
                          key={st}
                          type="button"
                          disabled={!canEdit || isUpdating}
                          onClick={() => handleStatusClick(st)}
                          className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                            isActive
                              ? st === 'COMPLETED'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-sm'
                                : st === 'IN_PROGRESS'
                                ? 'bg-blue-50 text-blue-800 border-blue-300 shadow-sm'
                                : 'bg-zinc-100 text-zinc-900 border-zinc-300 shadow-sm'
                              : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
                          }`}
                        >
                          {st === 'COMPLETED' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                          {st === 'IN_PROGRESS' && <Clock className="w-3.5 h-3.5 text-blue-600" />}
                          <span>{st.replace('_', ' ')}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Metadata Properties List */}
                <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/50 p-4 space-y-3.5 text-xs">
                  {/* Project */}
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500 font-medium flex items-center gap-2">
                      <FolderKanban className="w-3.5 h-3.5 text-zinc-400" />
                      Project
                    </span>
                    {task.project ? (
                      <Link
                        to={`/projects/${task.project.id}`}
                        className="font-semibold text-zinc-900 hover:text-emerald-600 transition-colors flex items-center gap-1"
                      >
                        <span>{task.project.name}</span>
                        <ExternalLink className="w-3 h-3 text-zinc-400" />
                      </Link>
                    ) : (
                      <span className="text-zinc-400">Unassigned Project</span>
                    )}
                  </div>

                  {/* Assignee */}
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500 font-medium flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-zinc-400" />
                      Assignee
                    </span>
                    {task.assignedTo ? (
                      <div className="flex items-center gap-2">
                        <Avatar name={task.assignedTo.name} size="xs" />
                        <span className="font-semibold text-zinc-900">{task.assignedTo.name}</span>
                      </div>
                    ) : (
                      <span className="text-zinc-400 italic">Unassigned</span>
                    )}
                  </div>

                  {/* Priority */}
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500 font-medium flex items-center gap-2">
                      <AlertCircle className="w-3.5 h-3.5 text-zinc-400" />
                      Priority
                    </span>
                    <PriorityBadge priority={task.priority} size="sm" />
                  </div>

                  {/* Deadline */}
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500 font-medium flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                      Deadline
                    </span>
                    {deadlineInfo ? (
                      <span
                        className={`font-mono text-[11px] font-semibold px-2 py-0.5 rounded-md border ${
                          deadlineInfo.isOverdue
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : deadlineInfo.isUrgent
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-zinc-100 text-zinc-700 border-zinc-200'
                        }`}
                      >
                        {deadlineInfo.text}
                      </span>
                    ) : (
                      <span className="text-zinc-400">No deadline set</span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-mono uppercase font-semibold text-zinc-400">
                    Description
                  </label>
                  <div className="p-4 rounded-xl border border-zinc-200/80 bg-white text-zinc-800 text-xs leading-relaxed whitespace-pre-line">
                    {task.description || (
                      <span className="text-zinc-400 italic">No description provided for this deliverable.</span>
                    )}
                  </div>
                </div>

                {/* Completed info */}
                {task.completedAt && (
                  <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/60 flex items-center gap-2.5 text-xs text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      Completed on{' '}
                      <span className="font-semibold font-mono">
                        {format(new Date(task.completedAt), 'MMM dd, yyyy · h:mm a')}
                      </span>
                    </span>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-zinc-200/80 bg-zinc-50/80 flex items-center justify-between">
                <span className="text-[11px] font-mono text-zinc-400">
                  Created {format(new Date(task.createdAt), 'MMM dd, yyyy')}
                </span>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold rounded-xl transition-all shadow-sm"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
