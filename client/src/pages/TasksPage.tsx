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
  Edit2,
  Trash2,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { PriorityBadge } from '../components/common/Badge';
import { Avatar } from '../components/common/Avatar';
import { Skeleton, EmptyState, ConfirmDialog } from '../components/common/CommonUI';
import { PageTransition } from '../components/common/PageTransition';
import { KanbanBoard } from '../components/tasks/KanbanBoard';
import { TaskModal } from '../components/tasks/TaskModal';
import { TaskDetailDrawer, formatTaskDeadline } from '../components/tasks/TaskDetailDrawer';
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

  // Modal & Drawer states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [inspectingTask, setInspectingTask] = useState<Task | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  const { data: projects } = useQuery({
    queryKey: ['projects-list'],
    queryFn: async () => {
      const res = await projectApi.getProjects();
      return res.data || [];
    },
  });

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
      success('Task Created', `Deliverable "${formData.title}" created.`);
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
      success('Task Updated', `Deliverable "${formData.title}" updated.`);
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
      success('Status Updated', `Task moved to ${newStatus.replace('_', ' ')}`);
      refetch();
      if (inspectingTask && inspectingTask.id === taskId) {
        setInspectingTask({ ...inspectingTask, status: newStatus });
      }
    } catch (err: any) {
      error('Failed to update status', err.response?.data?.error || 'Could not update task');
    }
  };

  const handleDeleteTask = async () => {
    if (!deletingTaskId) return;
    try {
      await taskApi.deleteTask(deletingTaskId);
      success('Task Deleted', 'Deliverable removed successfully.');
      setDeletingTaskId(null);
      if (inspectingTask && inspectingTask.id === deletingTaskId) {
        setInspectingTask(null);
      }
      refetch();
    } catch (err: any) {
      error('Delete Failed', err.response?.data?.error || 'Could not delete task');
    }
  };

  const canManage = isAdmin || isProjectLead;

  return (
    <PageTransition>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-white/8">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#FF6A16] font-bold">
            SPRINT EXECUTION • WORKSPACE
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F2EA] tracking-tight mt-1.5">
            Deliverables & Task Board
          </h1>
          <p className="text-xs text-[#8C8A84] mt-1">
            Interactive Kanban workflow, priority tracking, and milestone deadline management.
          </p>
        </div>

        {canManage && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5 text-black font-bold" />}
          >
            Create Task
          </Button>
        )}
      </div>

      {/* Filter Strip */}
      <div className="bg-[#0D0D0F] p-4 rounded-xl border border-white/8 shadow-subtle space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-3.5 h-3.5 text-[#8C8A84] absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search deliverables by keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3.5 py-1.5 text-xs bg-[#141416] border border-white/8 rounded-lg text-[#F5F2EA] placeholder:text-[#8C8A84] focus-ring"
            />
          </div>

          {/* View Switcher */}
          <div className="flex items-center gap-1 bg-[#141416] p-1 rounded-lg self-end md:self-auto border border-white/5">
            <button
              onClick={() => setViewMode('board')}
              className={`p-1.5 rounded-md text-xs font-semibold transition-all ${
                viewMode === 'board'
                  ? 'bg-[#1C1C20] text-[#FF6A16] shadow-sm'
                  : 'text-[#8C8A84] hover:text-[#F5F2EA]'
              }`}
              title="Kanban Board View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md text-xs font-semibold transition-all ${
                viewMode === 'table'
                  ? 'bg-[#1C1C20] text-[#FF6A16] shadow-sm'
                  : 'text-[#8C8A84] hover:text-[#F5F2EA]'
              }`}
              title="Table View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Filter Selects */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5 text-xs">
          <select
            value={projectIdFilter}
            onChange={(e) => setProjectIdFilter(e.target.value)}
            className="px-2.5 py-1 text-xs border border-white/8 rounded-lg bg-[#141416] font-medium text-[#F5F2EA] outline-none"
          >
            <option value="">All Projects</option>
            {projects?.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-2.5 py-1 text-xs border border-white/8 rounded-lg bg-[#141416] font-medium text-[#F5F2EA] outline-none"
          >
            <option value="">All Priorities</option>
            <option value="URGENT">Urgent</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1 text-xs border border-white/8 rounded-lg bg-[#141416] font-medium text-[#F5F2EA] outline-none"
          >
            <option value="">All Statuses</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>

          <select
            value={dueFilter}
            onChange={(e) => setDueFilter(e.target.value)}
            className="px-2.5 py-1 text-xs border border-white/8 rounded-lg bg-[#141416] font-medium text-[#F5F2EA] outline-none"
          >
            <option value="">Any Deadline</option>
            <option value="overdue">Overdue</option>
            <option value="today">Due Today</option>
            <option value="upcoming">Upcoming</option>
          </select>

          <label className="flex items-center gap-1.5 px-2.5 py-1 border border-white/8 rounded-lg cursor-pointer bg-[#141416] hover:bg-[#1C1C20] transition-colors font-medium text-[#F5F2EA] text-xs">
            <input
              type="checkbox"
              checked={assignedToMe}
              onChange={(e) => setAssignedToMe(e.target.checked)}
              className="rounded text-[#FF6A16] focus:ring-[#FF6A16] w-3 h-3 bg-[#050505]"
            />
            <span>Assigned to me</span>
          </label>
        </div>
      </div>

      {/* Main Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-96 rounded-lg" />
          <Skeleton className="h-96 rounded-lg" />
          <Skeleton className="h-96 rounded-lg" />
        </div>
      ) : !tasks || tasks.length === 0 ? (
        <EmptyState
          icon={<CheckSquare className="w-6 h-6 text-[#FF6814]" />}
          title="No deliverables found"
          description="Try adjusting your filter criteria or assign a new task."
          action={
            canManage ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsCreateModalOpen(true)}
                leftIcon={<Plus className="w-3.5 h-3.5 text-black font-bold" />}
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
          onSelectTask={(t) => setInspectingTask(t)}
          onEditTask={(t) => setEditingTask(t)}
          onDeleteTask={(id) => setDeletingTaskId(id)}
          canManageTasks={canManage}
        />
      ) : (
        <div className="bg-[#0D0D0F] rounded-xl border border-white/8 shadow-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#050505] text-[#8C8A84] uppercase text-[10px] font-mono border-b border-white/8">
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
              <tbody className="divide-y divide-white/5">
                {tasks.map((t) => {
                  const deadlineInfo = formatTaskDeadline(t.deadline);
                  return (
                    <tr
                      key={t.id}
                      onClick={() => setInspectingTask(t)}
                      className="hover:bg-[#141416]/60 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4 font-semibold text-[#F5F2EA]">
                        {t.title}
                        {t.description && (
                          <span className="block text-[11px] font-normal text-[#8C8A84] line-clamp-1">
                            {t.description}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-medium text-[#F5F2EA]">
                        <span className="bg-[#141416] border border-white/5 px-2 py-0.5 rounded text-[11px] font-mono">
                          {t.project?.name || 'Project'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Avatar name={t.assignedTo?.name} size="xs" />
                          <span className="text-[#F5F2EA]">
                            {t.assignedTo?.name || 'Unassigned'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <PriorityBadge priority={t.priority} size="sm" />
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px]">
                        {deadlineInfo ? (
                          <span
                            className={`font-semibold ${
                              deadlineInfo.isOverdue
                                ? 'text-rose-400'
                                : deadlineInfo.isUrgent
                                ? 'text-[#FFD400]'
                                : 'text-[#8C8A84]'
                            }`}
                          >
                            {deadlineInfo.text}
                          </span>
                        ) : (
                          <span className="text-zinc-600">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={t.status}
                          onChange={(e) => handleUpdateStatus(t.id, e.target.value as TaskStatus)}
                          disabled={!canManage && t.assignedToId !== user?.id}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold border border-white/10 bg-[#141416] text-[#F5F2EA] outline-none cursor-pointer"
                        >
                          <option value="TODO">To Do</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="COMPLETED">Completed</option>
                        </select>
                      </td>
                      {canManage && (
                        <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => setEditingTask(t)}
                              className="p-1.5 text-[#8C8A84] hover:text-[#F5F2EA] rounded hover:bg-[#141416]"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingTaskId(t.id)}
                              className="p-1.5 text-[#8C8A84] hover:text-rose-400 rounded hover:bg-rose-950/40"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Task Creation Modal */}
      <TaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTask}
        title="Create New Deliverable"
      />

      {/* Task Edit Modal */}
      <TaskModal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        onSubmit={handleUpdateTask}
        task={editingTask}
        title="Edit Deliverable Details"
      />

      {/* Slide-over Task Detail Drawer */}
      <TaskDetailDrawer
        task={inspectingTask}
        isOpen={!!inspectingTask}
        onClose={() => setInspectingTask(null)}
        onStatusChange={handleUpdateStatus}
        onDelete={async (id) => {
          setDeletingTaskId(id);
        }}
        canEdit={canManage || inspectingTask?.assignedToId === user?.id}
      />

      {/* Confirm Deletion Dialog */}
      <ConfirmDialog
        isOpen={!!deletingTaskId}
        onClose={() => setDeletingTaskId(null)}
        onConfirm={handleDeleteTask}
        title="Delete Deliverable"
        message="Are you sure you want to delete this deliverable? This action cannot be undone."
        confirmText="Delete Deliverable"
        variant="danger"
      />
    </PageTransition>
  );
};
