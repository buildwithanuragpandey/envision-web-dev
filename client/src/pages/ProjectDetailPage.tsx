import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { projectApi, taskApi, userApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
  FolderKanban,
  Calendar,
  Users,
  CheckSquare,
  Plus,
  Edit2,
  Trash2,
  UserPlus,
  UserMinus,
  UserCheck,
  ShieldCheck,
  ArrowLeft,
  LayoutGrid,
  List,
  Clock,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { StatusBadge, PriorityBadge, RoleBadge } from '../components/common/Badge';
import { ProgressBar, Skeleton, ConfirmDialog } from '../components/common/CommonUI';
import { KanbanBoard } from '../components/tasks/KanbanBoard';
import { TaskModal } from '../components/tasks/TaskModal';
import { ProjectModal } from '../components/projects/ProjectModal';
import { AddMemberModal } from '../components/projects/AddMemberModal';
import { format } from 'date-fns';
import { useToast } from '../context/ToastContext';
import { Task, TaskStatus } from '../types';

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { success, error } = useToast();

  const [activeTab, setActiveTab] = useState<'tasks' | 'team' | 'overview'>('tasks');
  const [taskViewMode, setTaskViewMode] = useState<'board' | 'table'>('board');

  // Modal states
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);
  const [isDeleteProjectOpen, setIsDeleteProjectOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [removingMemberId, setRemovingMemberId] = useState<string | null>(null);

  const { data: project, isLoading, refetch } = useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      if (!id) throw new Error('Project ID required');
      const res = await projectApi.getProjectById(id);
      return res.data;
    },
    enabled: !!id,
  });

  if (isLoading || !project) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-44 rounded-2xl" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  const isLead = project.projectLeadId === user?.id;
  const canManageProject = isAdmin || isLead;

  // Project handlers
  const handleUpdateProject = async (formData: any) => {
    try {
      await projectApi.updateProject(project.id, formData);
      success('Project Updated', 'Project details have been updated.');
      refetch();
    } catch (err: any) {
      error('Update Failed', err.response?.data?.error || 'Could not update project');
      throw err;
    }
  };

  const handleDeleteProject = async () => {
    try {
      await projectApi.deleteProject(project.id);
      success('Project Deleted', `Project "${project.name}" has been deleted.`);
      navigate('/projects');
    } catch (err: any) {
      error('Delete Failed', err.response?.data?.error || 'Could not delete project');
    }
  };

  // Task handlers
  const handleCreateTask = async (formData: any) => {
    try {
      await taskApi.createTask(formData);
      success('Task Created', `Task "${formData.title}" created.`);
      refetch();
    } catch (err: any) {
      error('Failed to create task', err.response?.data?.error || 'Could not create task');
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

  const handleUpdateTaskStatus = async (taskId: string, newStatus: TaskStatus) => {
    try {
      await taskApi.updateTaskStatus(taskId, newStatus);
      success('Status Updated', `Task status changed to ${newStatus}`);
      refetch();
    } catch (err: any) {
      error('Failed to update status', err.response?.data?.error || 'Could not change task status');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await taskApi.deleteTask(taskId);
      success('Task Deleted', 'Task removed successfully.');
      refetch();
    } catch (err: any) {
      error('Delete Failed', err.response?.data?.error || 'Could not delete task');
    }
  };

  // Member handlers
  const handleAddMember = async (userId: string) => {
    try {
      await projectApi.addMember(project.id, userId);
      success('Member Added', 'New member joined the project team.');
      refetch();
    } catch (err: any) {
      error('Failed to add member', err.response?.data?.error || 'Could not add member');
      throw err;
    }
  };

  const handleRemoveMember = async () => {
    if (!removingMemberId) return;
    try {
      await projectApi.removeMember(project.id, removingMemberId);
      success('Member Removed', 'Member removed from project team.');
      setRemovingMemberId(null);
      refetch();
    } catch (err: any) {
      error('Failed to remove member', err.response?.data?.error || 'Could not remove member');
    }
  };

  const handleLeadChange = async (newLeadId: string) => {
    try {
      await projectApi.setProjectLead(project.id, newLeadId || null);
      success('Project Lead Updated', 'New project lead assigned.');
      refetch();
    } catch (err: any) {
      error('Failed to change lead', err.response?.data?.error || 'Could not update lead');
    }
  };

  const memberIds = project.members?.map((m) => m.id) || [];

  return (
    <div className="space-y-6">
      {/* Back Navigation */}
      <div className="flex items-center gap-2">
        <Link
          to="/projects"
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Projects
        </Link>
      </div>

      {/* Project Hero Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <StatusBadge status={project.status} size="md" />
              {project.startDate && (
                <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {format(new Date(project.startDate), 'MMM dd, yyyy')}
                  {project.endDate && ` - ${format(new Date(project.endDate), 'MMM dd, yyyy')}`}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {project.name}
            </h1>

            <p className="text-sm text-slate-600 leading-relaxed">
              {project.description || 'No detailed description specified.'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 self-start lg:self-center flex-shrink-0">
            {canManageProject && (
              <>
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setIsEditProjectOpen(true)}
                  leftIcon={<Edit2 className="w-4 h-4" />}
                >
                  Edit Project
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setIsCreateTaskOpen(true)}
                  leftIcon={<Plus className="w-4 h-4" />}
                >
                  Add Task
                </Button>
              </>
            )}
            {isAdmin && (
              <Button
                variant="danger"
                size="md"
                onClick={() => setIsDeleteProjectOpen(true)}
                title="Delete Project"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Progress Metric & Meta Highlights */}
        <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Progress Bar Item */}
          <div className="sm:col-span-2 bg-slate-50 p-4 rounded-xl border border-slate-200/60">
            <div className="flex items-center justify-between text-xs text-slate-600 font-semibold mb-2">
              <span>Overall Deliverable Progress</span>
              <span className="text-slate-900 font-bold">{project.progress}%</span>
            </div>
            <ProgressBar progress={project.progress} size="md" />
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
              <span>{project.completedTasks} completed</span>
              <span>{project.inProgressTasks} in progress</span>
              <span>{project.todoTasks} to do</span>
            </div>
          </div>

          {/* Project Lead Card */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 flex items-center gap-3">
            <img
              src={
                project.projectLead?.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  project.projectLead?.name || 'Lead'
                )}&background=10b981&color=fff`
              }
              alt={project.projectLead?.name || 'Lead'}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-white"
            />
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold text-brand-600 tracking-wider block">
                Project Lead
              </span>
              <p className="text-xs font-bold text-slate-900 truncate">
                {project.projectLead?.name || 'Unassigned'}
              </p>
              <p className="text-[10px] text-slate-400 truncate">{project.projectLead?.email}</p>
            </div>
          </div>

          {/* Team Size */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 flex items-center gap-3">
            <div className="p-2.5 bg-purple-100 text-purple-600 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Team Size
              </span>
              <p className="text-base font-extrabold text-slate-900">
                {project.members?.length || 0} Members
              </p>
              <span className="text-[10px] text-slate-500">{project.totalTasks} total tasks</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 rounded-2xl shadow-subtle">
        <div className="flex space-x-6">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`py-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
              activeTab === 'tasks'
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Tasks ({project.tasks?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`py-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
              activeTab === 'team'
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Team Formation ({project.members?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
              activeTab === 'overview'
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Milestones & Metrics
          </button>
        </div>

        {/* View Switcher for Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setTaskViewMode('board')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
                taskViewMode === 'board'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Kanban Board"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTaskViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
                taskViewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Tab 1: Tasks Content */}
      {activeTab === 'tasks' && (
        <div>
          {taskViewMode === 'board' ? (
            <KanbanBoard
              tasks={project.tasks || []}
              onUpdateStatus={handleUpdateTaskStatus}
              onEditTask={(t) => setEditingTask(t)}
              onDeleteTask={handleDeleteTask}
              canManageTasks={canManageProject}
            />
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Task</th>
                      <th className="py-3 px-4">Assignee</th>
                      <th className="py-3 px-4">Priority</th>
                      <th className="py-3 px-4">Deadline</th>
                      <th className="py-3 px-4">Status</th>
                      {canManageProject && <th className="py-3 px-4 text-right">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(!project.tasks || project.tasks.length === 0) ? (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-slate-400">
                          No tasks created yet in this project.
                        </td>
                      </tr>
                    ) : (
                      project.tasks.map((t) => (
                        <tr key={t.id} className="hover:bg-slate-50/60">
                          <td className="py-3 px-4 font-semibold text-slate-900">
                            {t.title}
                            {t.description && (
                              <span className="block text-[11px] font-normal text-slate-500 line-clamp-1">
                                {t.description}
                              </span>
                            )}
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
                          <td className="py-3 px-4 text-slate-600">
                            {t.deadline ? format(new Date(t.deadline), 'MMM dd, yyyy') : '-'}
                          </td>
                          <td className="py-3 px-4">
                            <select
                              value={t.status}
                              onChange={(e) =>
                                handleUpdateTaskStatus(t.id, e.target.value as TaskStatus)
                              }
                              disabled={!canManageProject && t.assignedToId !== user?.id}
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
                          {canManageProject && (
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => setEditingTask(t)}
                                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteTask(t.id)}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Team Formation Content */}
      {activeTab === 'team' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Project Team Roster</h3>
              <p className="text-xs text-slate-500">
                Form team, assign task workloads, and adjust team composition.
              </p>
            </div>
            {canManageProject && (
              <Button
                variant="primary"
                size="md"
                onClick={() => setIsAddMemberOpen(true)}
                leftIcon={<UserPlus className="w-4 h-4" />}
              >
                Add Member to Team
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {project.memberStats?.map((member) => (
              <div
                key={member.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-card transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={
                          member.avatar ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            member.name
                          )}&background=10b981&color=fff`
                        }
                        alt={member.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 text-xs truncate flex items-center gap-1">
                          {member.name}
                          {project.projectLeadId === member.id && (
                            <span className="text-[10px] bg-brand-100 text-brand-700 px-1.5 py-0.5 rounded font-semibold">
                              Lead
                            </span>
                          )}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">{member.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 text-[11px] text-slate-500 space-y-0.5">
                    <p>Dept: {member.department || 'General'}</p>
                    <p>Level: {member.year || 'Member'}</p>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs text-slate-600 font-medium mb-1.5">
                    <span>Task Progress</span>
                    <span className="font-bold text-slate-900">
                      {member.completedTasks}/{member.totalTasks} ({member.progress}%)
                    </span>
                  </div>
                  <ProgressBar progress={member.progress} size="sm" />

                  {/* Actions */}
                  {canManageProject && (
                    <div className="mt-3 pt-2 flex items-center justify-between">
                      {isAdmin && project.projectLeadId !== member.id && (
                        <button
                          onClick={() => handleLeadChange(member.id)}
                          className="text-[11px] font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          Set as Lead
                        </button>
                      )}
                      <button
                        onClick={() => setRemovingMemberId(member.id)}
                        className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 ml-auto flex items-center gap-1"
                      >
                        <UserMinus className="w-3.5 h-3.5" />
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Milestones & Metrics */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-6">
            <h3 className="text-base font-bold text-slate-900 mb-4">Milestone Schedule</h3>
            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 block">Project Inception</span>
                  <span className="text-slate-500">Initiative approved and lead appointed</span>
                </div>
                <span className="font-semibold text-slate-700">
                  {project.startDate ? format(new Date(project.startDate), 'MMM dd, yyyy') : '-'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 block">Target Deliverable Finalization</span>
                  <span className="text-slate-500">Scheduled milestone wrap-up & review</span>
                </div>
                <span className="font-semibold text-slate-700">
                  {project.endDate ? format(new Date(project.endDate), 'MMM dd, yyyy') : 'Open-ended'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-6">
            <h3 className="text-base font-bold text-slate-900 mb-4">Task Priority Breakdown</h3>
            <div className="space-y-3 text-xs">
              {['URGENT', 'HIGH', 'MEDIUM', 'LOW'].map((priority) => {
                const count = project.tasks?.filter((t) => t.priority === priority).length || 0;
                return (
                  <div key={priority} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50">
                    <PriorityBadge priority={priority as any} size="sm" />
                    <span className="font-bold text-slate-900">{count} Tasks</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <ProjectModal
        isOpen={isEditProjectOpen}
        onClose={() => setIsEditProjectOpen(false)}
        onSubmit={handleUpdateProject}
        project={project}
        title="Edit Project"
      />

      <TaskModal
        isOpen={isCreateTaskOpen}
        onClose={() => setIsCreateTaskOpen(false)}
        onSubmit={handleCreateTask}
        defaultProjectId={project.id}
        title="Create New Task"
      />

      <TaskModal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        onSubmit={handleUpdateTask}
        task={editingTask}
        defaultProjectId={project.id}
        title="Edit Task"
      />

      <AddMemberModal
        isOpen={isAddMemberOpen}
        onClose={() => setIsAddMemberOpen(false)}
        onAddMember={handleAddMember}
        existingMemberIds={memberIds}
      />

      <ConfirmDialog
        isOpen={isDeleteProjectOpen}
        onClose={() => setIsDeleteProjectOpen(false)}
        onConfirm={handleDeleteProject}
        title="Delete Project"
        message={`Are you sure you want to delete "${project.name}"? This action will permanently remove all associated tasks and cannot be undone.`}
        confirmText="Delete Project"
        variant="danger"
      />

      <ConfirmDialog
        isOpen={!!removingMemberId}
        onClose={() => setRemovingMemberId(null)}
        onConfirm={handleRemoveMember}
        title="Remove Member from Team"
        message="Are you sure you want to remove this member from the project team? Their assigned tasks in this project will be unassigned."
        confirmText="Remove Member"
        variant="danger"
      />
    </div>
  );
};
