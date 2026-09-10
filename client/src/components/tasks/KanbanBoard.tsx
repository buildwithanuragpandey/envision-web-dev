import React from 'react';
import { Task, TaskStatus } from '../../types';
import { PriorityBadge } from '../common/Badge';
import { Calendar, CheckCircle2, Clock, ArrowRight, ArrowLeft, MoreHorizontal, Edit2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../../context/AuthContext';

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

  const columns: { id: TaskStatus; title: string; color: string; borderAccent: string }[] = [
    { id: 'TODO', title: 'To Do', color: 'bg-amber-50 text-amber-700', borderAccent: 'border-t-amber-500' },
    { id: 'IN_PROGRESS', title: 'In Progress', color: 'bg-blue-50 text-blue-700', borderAccent: 'border-t-blue-500' },
    { id: 'COMPLETED', title: 'Completed', color: 'bg-emerald-50 text-emerald-700', borderAccent: 'border-t-emerald-500' },
  ];

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((t) => t.status === status);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map((col) => {
        const columnTasks = getTasksByStatus(col.id);

        return (
          <div
            key={col.id}
            className={`bg-slate-100/80 rounded-2xl p-4 flex flex-col min-h-[500px] border border-slate-200/80 border-t-4 ${col.borderAccent}`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-800 tracking-tight">{col.title}</span>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-white text-slate-600 shadow-sm border border-slate-200">
                  {columnTasks.length}
                </span>
              </div>
            </div>

            {/* Task List */}
            <div className="flex-1 space-y-3 overflow-y-auto">
              {columnTasks.length === 0 ? (
                <div className="h-40 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl text-xs text-slate-400 font-medium">
                  No tasks in {col.title.toLowerCase()}
                </div>
              ) : (
                columnTasks.map((task) => {
                  const isAssignedToMe = task.assignedToId === user?.id;
                  const canChangeThisStatus = canManageTasks || isAssignedToMe;

                  return (
                    <div
                      key={task.id}
                      className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 hover:shadow-card hover:border-slate-300 transition-all duration-200 group relative"
                    >
                      {/* Project Tag & Priority */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[11px] font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md truncate max-w-[130px]">
                          {task.project?.name || 'Project'}
                        </span>
                        <PriorityBadge priority={task.priority} size="sm" />
                      </div>

                      {/* Title */}
                      <h4 className="text-sm font-semibold text-slate-900 group-hover:text-brand-600 transition-colors leading-snug">
                        {task.title}
                      </h4>

                      {/* Description preview */}
                      {task.description && (
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {task.description}
                        </p>
                      )}

                      {/* Deadline & Meta */}
                      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        {task.deadline ? (
                          <div
                            className={`flex items-center gap-1.5 font-medium ${
                              task.isOverdue
                                ? 'text-rose-600'
                                : task.isDueToday
                                ? 'text-amber-600'
                                : 'text-slate-500'
                            }`}
                          >
                            <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>
                              {format(new Date(task.deadline), 'MMM dd')}
                              {task.isOverdue && ' (Overdue)'}
                              {task.isDueToday && ' (Today)'}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-slate-400">
                            <Clock className="w-3.5 h-3.5" />
                            <span>No deadline</span>
                          </div>
                        )}

                        {/* Assignee */}
                        <div className="flex items-center gap-1.5" title={task.assignedTo?.name || 'Unassigned'}>
                          <img
                            src={
                              task.assignedTo?.avatar ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                task.assignedTo?.name || 'U'
                              )}&background=10b981&color=fff`
                            }
                            alt={task.assignedTo?.name || 'Unassigned'}
                            className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-200"
                          />
                          <span className="text-[11px] text-slate-600 font-medium truncate max-w-[80px]">
                            {task.assignedTo?.name?.split(' ')[0] || 'Unassigned'}
                          </span>
                        </div>
                      </div>

                      {/* Status Transition & Action Controls */}
                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1">
                          {/* Previous stage button */}
                          {col.id === 'IN_PROGRESS' && canChangeThisStatus && (
                            <button
                              onClick={() => onUpdateStatus(task.id, 'TODO')}
                              title="Move back to To Do"
                              className="p-1 rounded text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                            >
                              <ArrowLeft className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {col.id === 'COMPLETED' && canChangeThisStatus && (
                            <button
                              onClick={() => onUpdateStatus(task.id, 'IN_PROGRESS')}
                              title="Move back to In Progress"
                              className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            >
                              <ArrowLeft className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Next stage button */}
                          {col.id === 'TODO' && canChangeThisStatus && (
                            <button
                              onClick={() => onUpdateStatus(task.id, 'IN_PROGRESS')}
                              title="Start working (Move to In Progress)"
                              className="px-2 py-1 rounded-md text-[11px] font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 flex items-center gap-1 transition-colors"
                            >
                              <span>Start</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                          {col.id === 'IN_PROGRESS' && canChangeThisStatus && (
                            <button
                              onClick={() => onUpdateStatus(task.id, 'COMPLETED')}
                              title="Mark as completed"
                              className="px-2 py-1 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 flex items-center gap-1 transition-colors"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Complete</span>
                            </button>
                          )}
                        </div>

                        {/* Edit & Delete for Managers */}
                        {canManageTasks && (
                          <div className="flex items-center gap-1">
                            {onEditTask && (
                              <button
                                onClick={() => onEditTask(task)}
                                className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition-colors"
                                title="Edit task"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {onDeleteTask && (
                              <button
                                onClick={() => onDeleteTask(task.id)}
                                className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
                                title="Delete task"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
