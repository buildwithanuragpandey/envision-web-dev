import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { taskApi, projectApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
  CheckSquare,
  Search,
  Plus,
  LayoutGrid,
  List,
  Filter,
  Calendar,
  Clock,
  Edit2,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { PriorityBadge, StatusBadge } from '../components/common/Badge';
import { Skeleton, EmptyState, ConfirmDialog } from '../components/common/CommonUI';
import { KanbanBoard } from '../components/tasks/KanbanBoard';
import { TaskModal } from '../components/tasks/TaskModal';
import { format } from 'date-fns';
import { useToast } from '../context/ToastContext';
import { Task, TaskStatus } from '../types';

export const TasksPage: React.FC = () => {
  const { user, isAdmin, isProjectLead } = useAuth();
  const { success, error } = useToast();

  const [search, setSearch] = useState('');
  const [projectIdFilter, setProjectIdFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dueFilter, setDueFilter] = useState('');
  const [assignedToMe, setAssignedToMe] = useState(false);
  const [viewMode, setViewMode] = useState<'board' | 'table'>('board');

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  // Fetch projects for filter dropdown
  const { data: projects } = useQuery({
    queryKey: ['projects-list'],
    queryFn: async () => {
      const res = await projectApi.getProjects();
      return res.data || [];
    },
  });

  // Fetch tasks
  const { data: tasks, isLoading, refetch } = useQuery({
    queryKey: ['tasks', search, projectIdFilter, priorityFilter, statusFilter, dueFilter, assignedToMe],
    queryFn: async () => {
      const res = await taskApi.getTasks({
        search: search || undefined,
        projectId: projectIdFilter || undefined,
        priority: priorityFilter || undefined,
        status: statusFilter || undefined,
        dueFilter: dueFilter || undefined,
        assignedToMe: assignedToMe || undefined,
      });
      return res.data || [];
    },
  });

  const handleCreateTask = async (formData: any) => {
    try {
      await taskApi.createTask(formData);
      success('Task Created', `Task "${formData.title}" created successfully.`);
      refetch();
    } catch (err: any) {
      error('Creation Failed', err.response?.data?.error || 'Failed to create task');
      throw err;
    }
  };

  const handleUpdateTask = async (formData: any) => {
    if (!editingTask) return;
    try {
      await taskApi.updateTask(editingTask.id, formData);
      success('Task Updated', `Task "${formData.title}" updated.`);
      setEditingTask(null);
      refetch();
    } catch (err: any) {
      error('Update Failed', err.response?.data?.error || 'Could not update task');
      throw err;
    }
  };

  const handleUpdateStatus = async (taskId: string, newStatus: TaskStatus) => {
    try {
      await taskApi.updateTaskStatus(taskId, newStatus);
      success('Status Updated', `Task status changed to ${newStatus}`);
      refetch();
    } catch (err: any) {
      error('Failed to update status', err.response?.data?.error || 'Could not update task');
    }
  };

  const handleDeleteTask = async () => {
    if (!deletingTaskId) return;
    try {
      await taskApi.deleteTask(deletingTaskId);
      success('Task Deleted', 'Task removed successfully.');
      setDeletingTaskId(null);
      refetch();
    } catch (err: any) {
      error('Delete Failed', err.response?.data?.error || 'Could not delete task');
    }
  };

  const canManage = isAdmin || isProjectLead;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Task Center</h2>
          <p className="text-xs text-slate-500 mt-1">
            Track individual work items, priorities, deadlines, and status across club initiatives.
          </p>
        </div>
        {canManage && (
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsCreateModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Create Task
          </Button>
        )}
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-subtle space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search tasks by title or details..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
            />
          </div>

          {/* View Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-end md:self-auto">
            <button
              onClick={() => setViewMode('board')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'board'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Kanban Board View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-slate-100 text-xs">
          {/* Project Filter */}
          <select
            value={projectIdFilter}
            onChange={(e) => setProjectIdFilter(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded-lg outline-none bg-white font-medium text-slate-700"
          >
            <option value="">All Projects</option>
            {projects?.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded-lg outline-none bg-white font-medium text-slate-700"
          >
            <option value="">All Priorities</option>
            <option value="URGENT">Urgent</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded-lg outline-none bg-white font-medium text-slate-700"
          >
            <option value="">All Statuses</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>

          {/* Due Filter */}
          <select
            value={dueFilter}
            onChange={(e) => setDueFilter(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded-lg outline-none bg-white font-medium text-slate-700"
          >
            <option value="">Any Deadline</option>
            <option value="overdue">Overdue</option>
            <option value="today">Due Today</option>
            <option value="upcoming">Upcoming</option>
          </select>

          {/* Assigned To Me Toggle */}
          <label className="flex items-center gap-2 px-3 py-1.5 border border-slate-300 rounded-lg cursor-pointer bg-white hover:bg-slate-50 transition-colors font-medium text-slate-700">
            <input
              type="checkbox"
              checked={assignedToMe}
              onChange={(e) => setAssignedToMe(e.target.checked)}
              className="rounded text-brand-600 focus:ring-brand-500 w-3.5 h-3.5"
            />
            <span>Assigned to me</span>
          </label>
        </div>
      </div>

      {/* Main Task Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-96 rounded-2xl" />
          <Skeleton className="h-96 rounded-2xl" />
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      ) : !tasks || tasks.length === 0 ? (
        <EmptyState
          icon={<CheckSquare className="w-8 h-8 text-slate-400" />}
          title="No tasks match the criteria"
          description="Adjust your search filters or create a new task."
          action={
            canManage ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsCreateModalOpen(true)}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Create Task
              </Button>
            ) : undefined
          }
        />
      ) : viewMode === 'board' ? (
        <KanbanBoard
          tasks={tasks}
          onUpdateStatus={handleUpdateStatus}
          onEditTask={(t) => setEditingTask(t)}
          onDeleteTask={(id) => setDeletingTaskId(id)}
          canManageTasks={canManage}
        />
      ) : (
        /* Table View */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Task</th>
                  <th className="py-3 px-4">Project</th>
                  <th className="py-3 px-4">Assignee</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Deadline</th>
                  <th className="py-3 px-4">Status</th>
                  {canManage && <th className="py-3 px-4 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tasks.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {t.title}
                      {t.description && (
                        <span className="block text-[11px] font-normal text-slate-500 line-clamp-1">
                          {t.description}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        {t.project?.name || 'Project'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <img
                          src={
                            t.assignedTo?.avatar ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              t.assignedTo?.name || 'U'
                            )}&background=10b981&color=fff`
                          }
                          alt={t.assignedTo?.name || 'U'}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="font-medium text-slate-700">
                          {t.assignedTo?.name || 'Unassigned'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <PriorityBadge priority={t.priority} size="sm" />
                    </td>
                    <td className="py-3 px-4">
                      {t.deadline ? (
                        <span
                          className={`font-medium ${
                            t.isOverdue
                              ? 'text-rose-600 font-bold'
                              : t.isDueToday
                              ? 'text-amber-600 font-bold'
                              : 'text-slate-600'
                          }`}
                        >
                          {format(new Date(t.deadline), 'MMM dd, yyyy')}
                          {t.isOverdue && ' (Overdue)'}
                          {t.isDueToday && ' (Today)'}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={t.status}
                        onChange={(e) => handleUpdateStatus(t.id, e.target.value as TaskStatus)}
                        disabled={!canManage && t.assignedToId !== user?.id}
                        className={`px-2.5 py-1 rounded-md text-xs font-semibold border outline-none cursor-pointer ${
                          t.status === 'COMPLETED'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : t.status === 'IN_PROGRESS'
                            ? 'bg-blue-50 text-blue-700 border-blue-300'
                            : 'bg-amber-50 text-amber-700 border-amber-300'
                        }`}
                      >
                        <option value="TODO">To Do</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                      </select>
                    </td>
                    {canManage && (
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setEditingTask(t)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingTaskId(t.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <TaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTask}
        title="Create New Task"
      />

      <TaskModal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        onSubmit={handleUpdateTask}
        task={editingTask}
        title="Edit Task Details"
      />

      <ConfirmDialog
        isOpen={!!deletingTaskId}
        onClose={() => setDeletingTaskId(null)}
        onConfirm={handleDeleteTask}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete Task"
        variant="danger"
      />
    </div>
  );
};
