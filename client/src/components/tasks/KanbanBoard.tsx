import React from 'react';
import { Task, TaskStatus } from '../../types';
import { PriorityBadge } from '../common/Badge';
import { Avatar } from '../common/Avatar';
import { Calendar, CheckCircle2, Clock, ArrowRight, ArrowLeft, Edit2, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { formatTaskDeadline } from './TaskDetailDrawer';

interface KanbanBoardProps {
  tasks: Task[];
  onUpdateStatus: (taskId: string, newStatus: TaskStatus) => void;
  onSelectTask?: (task: Task) => void;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (taskId: string) => void;
  canManageTasks?: boolean;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  onUpdateStatus,
  onSelectTask,
  onEditTask,
  onDeleteTask,
  canManageTasks = false,
}) => {
  const { user } = useAuth();

  const columns: { id: TaskStatus; title: string; dotColor: string }[] = [
    { id: 'TODO', title: 'TO DO', dotColor: 'bg-zinc-500' },
    { id: 'IN_PROGRESS', title: 'IN PROGRESS', dotColor: 'bg-[#FF6814] shadow-glow-orange' },
    { id: 'COMPLETED', title: 'COMPLETED', dotColor: 'bg-[#FFDD00] shadow-glow-yellow' },
  ];

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((t) => t.status === status);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {columns.map((col) => {
        const columnTasks = getTasksByStatus(col.id);

        return (
          <div
            key={col.id}
            className="bg-[#070709] rounded-lg p-3.5 flex flex-col min-h-[500px] border border-white/5"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 px-1 mb-2 border-b border-white/5">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${col.dotColor}`} />
                <span className="font-bold text-xs uppercase tracking-wider text-zinc-300 font-mono">
                  {col.title}
                </span>
              </div>
              <span className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded bg-[#111114] text-zinc-400 border border-white/8">
                {columnTasks.length}
              </span>
            </div>

            {/* Task Cards Column */}
            <div className="flex-1 space-y-2.5 overflow-y-auto">
              <AnimatePresence mode="popLayout">
                {columnTasks.length === 0 ? (
                  <div className="h-32 flex items-center justify-center border border-dashed border-white/8 rounded-lg text-xs font-mono text-zinc-600">
                    No tasks in {col.title.toLowerCase()}
                  </div>
                ) : (
                  columnTasks.map((task) => {
                    const isAssignedToMe = task.assignedToId === user?.id;
                    const canChangeThisStatus = canManageTasks || isAssignedToMe;
                    const deadlineInfo = formatTaskDeadline(task.deadline);

                    return (
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        key={task.id}
                        className="bg-[#0D0D10] rounded-lg p-3.5 shadow-subtle border border-white/8 hover:border-[#FF6814]/40 hover:-translate-y-0.5 transition-all group"
                      >
                        {/* Clickable Card Body (Opens Drawer) */}
                        <div
                          onClick={() => onSelectTask?.(task)}
                          className="cursor-pointer"
                        >
                          {/* Project Tag & Priority */}
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="font-mono text-[10px] uppercase font-semibold text-zinc-400 bg-[#16161A] px-2 py-0.5 rounded truncate max-w-[140px] border border-white/5">
                              {task.project?.name || 'Project'}
                            </span>
                            <PriorityBadge priority={task.priority} size="sm" />
                          </div>

                          {/* Title */}
                          <h4 className="text-xs font-semibold text-[#F5F5F0] group-hover:text-[#FF6814] transition-colors leading-snug">
                            {task.title}
                          </h4>

                          {/* Description */}
                          {task.description && (
                            <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                              {task.description}
                            </p>
                          )}

                          {/* Deadline & Assignee */}
                          <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-400">
                            {deadlineInfo ? (
                              <div
                                className={`flex items-center gap-1 font-mono text-[10px] ${
                                  deadlineInfo.isOverdue
                                    ? 'text-rose-400 font-bold'
                                    : deadlineInfo.isUrgent
                                    ? 'text-[#FFDD00] font-semibold'
                                    : 'text-zinc-500'
                                }`}
                              >
                                <Calendar className="w-3 h-3" />
                                <span>{deadlineInfo.text}</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 text-zinc-600 font-mono text-[10px]">
                                <Clock className="w-3 h-3" />
                                <span>No deadline</span>
                              </div>
                            )}

                            {/* Assignee Initials Avatar */}
                            <div className="flex items-center gap-1.5" title={task.assignedTo?.name || 'Unassigned'}>
                              <Avatar name={task.assignedTo?.name} size="xs" />
                              <span className="text-[10px] text-zinc-400 font-medium truncate max-w-[70px]">
                                {task.assignedTo?.name?.split(' ')[0] || 'Unassigned'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Status Transition Action Buttons */}
                        <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between gap-1">
                          <div className="flex items-center gap-1">
                            {col.id === 'IN_PROGRESS' && canChangeThisStatus && (
                              <button
                                type="button"
                                onClick={() => onUpdateStatus(task.id, 'TODO')}
                                title="Move back to To Do"
                                className="p-1 rounded text-zinc-500 hover:text-white hover:bg-[#16161A] transition-colors"
                              >
                                <ArrowLeft className="w-3 h-3" />
                              </button>
                            )}
                            {col.id === 'COMPLETED' && canChangeThisStatus && (
                              <button
                                type="button"
                                onClick={() => onUpdateStatus(task.id, 'IN_PROGRESS')}
                                title="Move back to In Progress"
                                className="p-1 rounded text-zinc-500 hover:text-[#FF6814] hover:bg-[#16161A] transition-colors"
                              >
                                <ArrowLeft className="w-3 h-3" />
                              </button>
                            )}

                            {col.id === 'TODO' && canChangeThisStatus && (
                              <button
                                type="button"
                                onClick={() => onUpdateStatus(task.id, 'IN_PROGRESS')}
                                className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#16161A] hover:bg-[#202025] text-zinc-300 hover:text-white flex items-center gap-1 transition-colors border border-white/5"
                              >
                                <span>Start</span>
                                <ArrowRight className="w-2.5 h-2.5 text-[#FF6814]" />
                              </button>
                            )}
                            {col.id === 'IN_PROGRESS' && canChangeThisStatus && (
                              <button
                                type="button"
                                onClick={() => onUpdateStatus(task.id, 'COMPLETED')}
                                className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#16161A] hover:bg-[#202025] text-[#FFDD00] flex items-center gap-1 transition-colors border border-white/8"
                              >
                                <CheckCircle2 className="w-2.5 h-2.5" />
                                <span>Complete</span>
                              </button>
                            )}
                          </div>

                          {/* Edit / Delete */}
                          {canManageTasks && (
                            <div className="flex items-center gap-1">
                              {onEditTask && (
                                <button
                                  type="button"
                                  onClick={() => onEditTask(task)}
                                  className="p-1 text-zinc-500 hover:text-white rounded hover:bg-[#16161A]"
                                  title="Edit task"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>
                              )}
                              {onDeleteTask && (
                                <button
                                  type="button"
                                  onClick={() => onDeleteTask(task.id)}
                                  className="p-1 text-zinc-500 hover:text-rose-400 rounded hover:bg-rose-950/40"
                                  title="Delete task"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>
          </div>
        );
      })}
    </div>
  );
};
