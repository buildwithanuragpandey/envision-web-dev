import React from 'react';
import { Task, TaskStatus } from '../../types';
import { PriorityBadge } from '../common/Badge';
import { Calendar, CheckCircle2, Clock, ArrowRight, ArrowLeft, Edit2, Trash2, Layers } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface KanbanBoardProps {
  tasks: Task[];
  onUpdateStatus: (taskId: string, newStatus: TaskStatus) => void;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (taskId: string) => void;
  canManageTasks?: boolean;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  onUpdateStatus,
  onEditTask,
  onDeleteTask,
  canManageTasks = false,
}) => {
  const { user } = useAuth();

  const columns: { id: TaskStatus; title: string; dotColor: string }[] = [
    { id: 'TODO', title: 'To Do', dotColor: 'bg-zinc-400' },
    { id: 'IN_PROGRESS', title: 'In Progress', dotColor: 'bg-blue-500 animate-pulse' },
    { id: 'COMPLETED', title: 'Completed', dotColor: 'bg-emerald-500' },
  ];

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((t) => t.status === status);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {columns.map((col) => {
        const columnTasks = getTasksByStatus(col.id);

        return (
          <div
            key={col.id}
            className="bg-zinc-100/60 rounded-2xl p-3.5 flex flex-col min-h-[500px] border border-zinc-200/70"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 px-1 mb-2 border-b border-zinc-200/60">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${col.dotColor}`} />
                <span className="font-bold text-xs uppercase tracking-wider text-zinc-800">
                  {col.title}
                </span>
              </div>
              <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white text-zinc-600 border border-zinc-200 shadow-2xs">
                {columnTasks.length}
              </span>
            </div>

            {/* Task Cards Column with Framer Motion layout */}
            <div className="flex-1 space-y-2.5 overflow-y-auto">
              <AnimatePresence mode="popLayout">
                {columnTasks.length === 0 ? (
                  <div className="h-36 flex items-center justify-center border border-dashed border-zinc-300/80 rounded-xl text-xs font-mono text-zinc-400">
                    No tasks in {col.title.toLowerCase()}
                  </div>
                ) : (
                  columnTasks.map((task) => {
                    const isAssignedToMe = task.assignedToId === user?.id;
                    const canChangeThisStatus = canManageTasks || isAssignedToMe;

                    return (
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        key={task.id}
                        className="bg-white rounded-xl p-3.5 shadow-subtle border border-zinc-200/80 hover:border-zinc-300 hover:shadow-premium transition-all group"
                      >
                        {/* Project Tag & Priority */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="font-mono text-[10px] uppercase font-bold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded truncate max-w-[130px]">
                            {task.project?.name || 'Project'}
                          </span>
                          <PriorityBadge priority={task.priority} size="sm" />
                        </div>

                        {/* Title */}
                        <h4 className="text-xs font-bold text-zinc-900 group-hover:text-zinc-700 transition-colors leading-snug">
                          {task.title}
                        </h4>

                        {/* Description */}
                        {task.description && (
                          <p className="text-[11px] text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
                            {task.description}
                          </p>
                        )}

                        {/* Deadline & Assignee */}
                        <div className="mt-3 pt-2.5 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500">
                          {task.deadline ? (
                            <div
                              className={`flex items-center gap-1 font-mono text-[10px] ${
                                task.isOverdue
                                  ? 'text-rose-600 font-bold'
                                  : task.isDueToday
                                  ? 'text-amber-600 font-bold'
                                  : 'text-zinc-500'
                              }`}
                            >
                              <Calendar className="w-3 h-3" />
                              <span>
                                {format(new Date(task.deadline), 'MMM dd')}
                                {task.isOverdue && ' (Overdue)'}
                                {task.isDueToday && ' (Today)'}
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-zinc-400 font-mono text-[10px]">
                              <Clock className="w-3 h-3" />
                              <span>Open</span>
                            </div>
                          )}

                          {/* Assignee Avatar */}
                          <div className="flex items-center gap-1.5" title={task.assignedTo?.name || 'Unassigned'}>
                            <img
                              src={
                                task.assignedTo?.avatar ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  task.assignedTo?.name || 'U'
                                )}&background=18181b&color=fff`
                              }
                              alt={task.assignedTo?.name || 'Unassigned'}
                              className="w-5 h-5 rounded-full object-cover ring-1 ring-zinc-200"
                            />
                            <span className="text-[10px] text-zinc-600 font-medium truncate max-w-[70px]">
                              {task.assignedTo?.name?.split(' ')[0] || 'Unassigned'}
                            </span>
                          </div>
                        </div>

                        {/* Status Transition Action Buttons */}
                        <div className="mt-2.5 pt-2 border-t border-zinc-100 flex items-center justify-between gap-1">
                          <div className="flex items-center gap-1">
                            {col.id === 'IN_PROGRESS' && canChangeThisStatus && (
                              <button
                                onClick={() => onUpdateStatus(task.id, 'TODO')}
                                title="Move back to To Do"
                                className="p-1 rounded text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
                              >
                                <ArrowLeft className="w-3 h-3" />
                              </button>
                            )}
                            {col.id === 'COMPLETED' && canChangeThisStatus && (
                              <button
                                onClick={() => onUpdateStatus(task.id, 'IN_PROGRESS')}
                                title="Move back to In Progress"
                                className="p-1 rounded text-zinc-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                              >
                                <ArrowLeft className="w-3 h-3" />
                              </button>
                            )}

                            {col.id === 'TODO' && canChangeThisStatus && (
                              <button
                                onClick={() => onUpdateStatus(task.id, 'IN_PROGRESS')}
                                className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-800 flex items-center gap-1 transition-colors"
                              >
                                <span>Start</span>
                                <ArrowRight className="w-2.5 h-2.5" />
                              </button>
                            )}
                            {col.id === 'IN_PROGRESS' && canChangeThisStatus && (
                              <button
                                onClick={() => onUpdateStatus(task.id, 'COMPLETED')}
                                className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 flex items-center gap-1 transition-colors border border-emerald-200/60"
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
                                  onClick={() => onEditTask(task)}
                                  className="p-1 text-zinc-400 hover:text-zinc-800 rounded hover:bg-zinc-100"
                                  title="Edit task"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>
                              )}
                              {onDeleteTask && (
                                <button
                                  onClick={() => onDeleteTask(task.id)}
                                  className="p-1 text-zinc-400 hover:text-rose-600 rounded hover:bg-rose-50"
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
