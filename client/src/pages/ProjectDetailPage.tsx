import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { projectApi, taskApi } from '../api/client';
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
  ArrowLeft,
  LayoutGrid,
  List,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import { Avatar } from '../components/common/Avatar';
import { ProgressBar, Skeleton, ConfirmDialog } from '../components/common/CommonUI';
import { PageTransition } from '../components/common/PageTransition';
import { KanbanBoard } from '../components/tasks/KanbanBoard';
import { TaskModal } from '../components/tasks/TaskModal';
import { TaskDetailDrawer } from '../components/tasks/TaskDetailDrawer';
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

  // Modal & Drawer states
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);
  const [isDeleteProjectOpen, setIsDeleteProjectOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [inspectingTask, setInspectingTask] = useState<Task | null>(null);
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
        <Skeleton className="h-44 rounded-lg" />
        <Skeleton className="h-96 rounded-lg" />
      </div>
    );
  }

  const isLead = project.projectLeadId === user?.id;
  const canManageProject = isAdmin || isLead;

  // Project handlers
  const handleUpdateProject = async (formData: any) => {
    try {
      await projectApi.updateProject(project.id, formData);
      success('Project Updated', 'Initiative details have been saved.');
      refetch();
    } catch (err: any) {
      error('Update Failed', err.response?.data?.error || 'Could not update project');
      throw err;
    }
  };

  const handleDeleteProject = async () => {
    try {
      await projectApi.deleteProject(project.id);
      success('Project Deleted', `Initiative "${project.name}" has been deleted.`);
      navigate('/projects');
    } catch (err: any) {
      error('Delete Failed', err.response?.data?.error || 'Could not delete project');
    }
  };

  // Task handlers
  const handleCreateTask = async (formData: any) => {
    try {
      await taskApi.createTask(formData);
      success('Task Created', `Deliverable "${formData.title}" created.`);
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
      success('Task Updated', `Deliverable "${formData.title}" updated.`);
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
      success('Status Updated', `Task moved to ${newStatus.replace('_', ' ')}`);
      refetch();
      if (inspectingTask && inspectingTask.id === taskId) {
        setInspectingTask({ ...inspectingTask, status: newStatus });
      }
    } catch (err: any) {
      error('Failed to update status', err.response?.data?.error || 'Could not change task status');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await taskApi.deleteTask(taskId);
      success('Task Deleted', 'Deliverable removed successfully.');
      if (inspectingTask && inspectingTask.id === taskId) {
        setInspectingTask(null);
      }
      refetch();
    } catch (err: any) {
      error('Delete Failed', err.response?.data?.error || 'Could not delete task');
    }
  };

  // Member handlers
  const handleAddMember = async (userId: string) => {
    try {
      await projectApi.addMember(project.id, userId);
      success('Member Added', 'Student added to the initiative squad.');
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
      success('Member Removed', 'Student removed from the squad.');
      setRemovingMemberId(null);
      refetch();
    } catch (err: any) {
      error('Failed to remove member', err.response?.data?.error || 'Could not remove member');
    }
  };

  const handleLeadChange = async (newLeadId: string) => {
    try {
      await projectApi.setProjectLead(project.id, newLeadId || null);
      success('Project Lead Updated', 'New squad lead assigned.');
      refetch();
    } catch (err: any) {
      error('Failed to change lead', err.response?.data?.error || 'Could not update lead');
    }
  };

  const memberIds = project.members?.map((m) => m.id) || [];

  return (
    <PageTransition>
      {/* Back Navigation */}
      <div className="flex items-center justify-between mb-4">
        <Link
          to="/projects"
          className="text-xs font-semibold text-[#8C8A84] hover:text-[#FF6A16] flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Initiatives
        </Link>
        <span className="font-mono text-[10px] uppercase tracking-widest text-[#FF6A16] font-bold">
          03 / WORKSPACE
        </span>
      </div>

      {/* Editorial Project Header & Frame Visual */}
      <div className="bg-[#0D0D0F] rounded-xl border border-white/8 shadow-2xl overflow-hidden mb-6">
        <div className="p-6 sm:p-8 border-b border-white/8">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="font-mono text-[10px] uppercase font-bold text-[#FFD400] bg-[#141416] px-2.5 py-1 rounded border border-white/8">
                  INITIATIVE • {project.status}
                </span>
                <span className="text-xs font-mono text-[#8C8A84]">
                  {project.startDate && format(new Date(project.startDate), 'MMM dd, yyyy')}
                  {project.endDate && ` — ${format(new Date(project.endDate), 'MMM dd, yyyy')}`}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#F5F2EA] tracking-tight">
                {project.name}
              </h1>

              <p className="text-xs sm:text-sm text-[#8C8A84] leading-relaxed">
                {project.description || 'Active technical initiative in our innovation lab.'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              {canManageProject && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditProjectOpen(true)}
                    leftIcon={<Edit2 className="w-3.5 h-3.5" />}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setIsCreateTaskOpen(true)}
                    leftIcon={<Plus className="w-3.5 h-3.5 text-black font-bold" />}
                  >
                    Add Task
                  </Button>
                </>
              )}
              {isAdmin && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setIsDeleteProjectOpen(true)}
                  title="Delete Project"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Large Cinematic Frame Container */}
        <div className="relative h-56 sm:h-72 w-full overflow-hidden group">
          <img
            src="/frames/03_workspace.jpg"
            alt="Innovation Workspace"
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0F] via-transparent to-transparent opacity-90" />
          <div className="absolute bottom-4 left-6 z-10 flex items-center gap-3">
            <span className="bg-[#050505]/80 backdrop-blur-md px-3 py-1 rounded border border-white/10 text-[10px] font-mono font-bold text-[#FFD400]">
              LIVE WORKSPACE
            </span>
            <span className="text-xs font-mono text-[#F5F2EA] drop-shadow-md">
              {project.completedTasks}/{project.totalTasks} DELIVERABLES SHIPPED
            </span>
          </div>
          <div className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-[#FF6A16] to-transparent animate-travel-line" />
        </div>

        {/* Under-Image Metadata Strip (Active, Progress, Lead, Deadline) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-white/8 bg-[#0D0D0F] border-t border-white/8 text-xs">
          <div className="p-4 sm:p-5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#8C8A84] font-bold block">Status</span>
              <span className="text-sm font-bold text-[#FFD400] font-mono mt-0.5 block">{project.status}</span>
            </div>
            <span className="text-2xl font-bold font-mono text-[#FF6A16]">{project.progress}%</span>
          </div>

          <div className="p-4 sm:p-5">
            <span className="text-[10px] font-mono uppercase text-[#8C8A84] font-bold block">Project Lead</span>
            <div className="flex items-center gap-2 mt-1">
              <Avatar name={project.projectLead?.name} size="xs" />
              <span className="font-semibold text-[#F5F2EA] text-xs truncate">
                {project.projectLead?.name || 'Unassigned'}
              </span>
            </div>
          </div>

          <div className="p-4 sm:p-5">
            <span className="text-[10px] font-mono uppercase text-[#8C8A84] font-bold block">Deadline</span>
            <span className="font-semibold text-[#F5F2EA] font-mono text-xs mt-1 block">
              {project.endDate ? format(new Date(project.endDate), 'dd MMM yyyy') : 'Open Milestone'}
            </span>
          </div>

          <div className="p-4 sm:p-5">
            <span className="text-[10px] font-mono uppercase text-[#8C8A84] font-bold block">Squad Collaborators</span>
            <span className="font-bold text-[#F5F2EA] text-xs mt-1 block">
              {project.members?.length || 0} Student Members
            </span>
          </div>
        </div>

        {/* Project Progress Horizontal Bar */}
        <div className="p-5 sm:p-6 bg-[#141416]/50 border-t border-white/5 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#8C8A84] font-mono">
            <span className="font-bold uppercase tracking-wider text-[10px] text-[#F5F2EA]">PROJECT MOMENTUM & PROGRESS</span>
            <span className="font-bold text-[#FF6A16]">{project.progress}% Complete</span>
          </div>
          <ProgressBar progress={project.progress} size="md" />
        </div>
      </div>

      {/* Tabs Header */}
      <div className="flex items-center justify-between border-b border-white/8 bg-[#0D0D0F] px-6 rounded-xl shadow-subtle mb-6">
        <div className="flex space-x-6">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`py-3.5 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
              activeTab === 'tasks'
                ? 'border-[#FF6A16] text-[#F5F2EA]'
                : 'border-transparent text-[#8C8A84] hover:text-[#F5F2EA]'
            }`}
          >
            Tasks ({project.tasks?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`py-3.5 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
              activeTab === 'team'
                ? 'border-[#FF6A16] text-[#F5F2EA]'
                : 'border-transparent text-[#8C8A84] hover:text-[#F5F2EA]'
            }`}
          >
            Squad Roster ({project.members?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3.5 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
              activeTab === 'overview'
                ? 'border-[#FF6A16] text-[#F5F2EA]'
                : 'border-transparent text-[#8C8A84] hover:text-[#F5F2EA]'
            }`}
          >
            Milestones & Priorities
          </button>
        </div>

        {activeTab === 'tasks' && (
          <div className="flex items-center gap-1 bg-[#141416] p-1 rounded-lg border border-white/5">
            <button
              onClick={() => setTaskViewMode('board')}
              className={`p-1.5 rounded-md text-xs font-semibold transition-all ${
                taskViewMode === 'board'
                  ? 'bg-[#1C1C20] text-[#FF6A16] shadow-sm'
                  : 'text-[#8C8A84] hover:text-[#F5F2EA]'
              }`}
              title="Kanban Board"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTaskViewMode('table')}
              className={`p-1.5 rounded-md text-xs font-semibold transition-all ${
                taskViewMode === 'table'
                  ? 'bg-[#1C1C20] text-[#FF6A16] shadow-sm'
                  : 'text-[#8C8A84] hover:text-[#F5F2EA]'
              }`}
              title="Table View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Tab 1: Tasks */}
      {activeTab === 'tasks' && (
        <div>
          {taskViewMode === 'board' ? (
            <KanbanBoard
              tasks={project.tasks || []}
              onUpdateStatus={handleUpdateTaskStatus}
              onSelectTask={(t) => setInspectingTask(t)}
              onEditTask={(t) => setEditingTask(t)}
              onDeleteTask={handleDeleteTask}
              canManageTasks={canManageProject}
            />
          ) : (
            <div className="bg-[#0D0D0F] rounded-xl border border-white/8 shadow-subtle overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#050505] text-[#8C8A84] uppercase text-[10px] font-mono border-b border-white/8">
                    <tr>
                      <th className="py-3 px-4">Task</th>
                      <th className="py-3 px-4">Assignee</th>
                      <th className="py-3 px-4">Priority</th>
                      <th className="py-3 px-4">Deadline</th>
                      <th className="py-3 px-4">Status</th>
                      {canManageProject && <th className="py-3 px-4 text-right">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {(!project.tasks || project.tasks.length === 0) ? (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-[#8C8A84] font-mono">
                          No deliverables created yet in this initiative.
                        </td>
                      </tr>
                    ) : (
                      project.tasks.map((t) => (
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
                          <td className="py-3 px-4 text-[#8C8A84] font-mono text-[11px]">
                            {t.deadline ? format(new Date(t.deadline), 'MMM dd, yyyy') : '-'}
                          </td>
                          <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                            <select
                              value={t.status}
                              onChange={(e) =>
                                handleUpdateTaskStatus(t.id, e.target.value as TaskStatus)
                              }
                              disabled={!canManageProject && t.assignedToId !== user?.id}
                              className="px-2.5 py-1 rounded-lg text-xs font-semibold border border-white/10 bg-[#141416] text-[#F5F2EA] outline-none cursor-pointer"
                            >
                              <option value="TODO">To Do</option>
                              <option value="IN_PROGRESS">In Progress</option>
                              <option value="COMPLETED">Completed</option>
                            </select>
                          </td>
                          {canManageProject && (
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
                                  onClick={() => handleDeleteTask(t.id)}
                                  className="p-1.5 text-[#8C8A84] hover:text-rose-400 rounded hover:bg-rose-950/40"
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

      {/* Tab 2: Team Roster */}
      {activeTab === 'team' && (
        <div className="bg-[#0D0D0F] rounded-xl border border-white/8 shadow-subtle p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#8C8A84]">
                SQUAD ROSTER
              </span>
              <h3 className="text-base font-bold text-[#F5F2EA] tracking-tight mt-0.5">
                Active Student Collaborators
              </h3>
            </div>
            {canManageProject && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsAddMemberOpen(true)}
                leftIcon={<UserPlus className="w-3.5 h-3.5 text-black font-bold" />}
              >
                Add Member
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {project.memberStats?.map((member) => (
              <div
                key={member.id}
                className="p-4 rounded-xl border border-white/8 bg-[#141416]/50 hover:border-[#FF6A16]/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar name={member.name} size="md" />
                      <div className="min-w-0">
                        <p className="font-semibold text-[#F5F2EA] text-xs truncate flex items-center gap-1">
                          {member.name}
                          {project.projectLeadId === member.id && (
                            <span className="text-[9px] font-mono bg-[#FF6A16] text-black px-1.5 py-0.2 rounded font-bold uppercase">
                              Lead
                            </span>
                          )}
                        </p>
                        <p className="text-[11px] text-[#8C8A84] truncate font-mono">{member.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 text-[11px] font-mono text-[#8C8A84] space-y-0.5">
                    <p>{member.department || 'General'}</p>
                    <p>{member.year || 'Member'}</p>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-white/5">
                  <div className="flex items-center justify-between text-xs text-[#8C8A84] font-mono mb-1.5">
                    <span>Deliverables</span>
                    <span className="font-bold text-[#FF6A16]">
                      {member.completedTasks}/{member.totalTasks} ({member.progress}%)
                    </span>
                  </div>
                  <ProgressBar progress={member.progress} size="sm" />

                  {canManageProject && (
                    <div className="mt-3 pt-2 flex items-center justify-between text-xs border-t border-white/5">
                      {isAdmin && project.projectLeadId !== member.id && (
                        <button
                          type="button"
                          onClick={() => handleLeadChange(member.id)}
                          className="text-[11px] font-medium text-zinc-300 hover:text-[#FFD400] flex items-center gap-1"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          Set as Lead
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setRemovingMemberId(member.id)}
                        className="text-[11px] font-medium text-rose-400 hover:text-rose-300 ml-auto flex items-center gap-1"
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

      {/* Tab 3: Milestones */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#0D0D0F] rounded-xl border border-white/8 shadow-subtle p-6">
            <h3 className="text-xs font-bold text-[#F5F2EA] uppercase tracking-wider font-mono mb-4">Milestone Schedule</h3>
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#141416] border border-white/5 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-[#F5F2EA] block">Inception & Approval</span>
                  <span className="text-[#8C8A84]">Initiative charter approved</span>
                </div>
                <span className="font-mono text-[#F5F2EA] font-semibold">
                  {project.startDate ? format(new Date(project.startDate), 'MMM dd, yyyy') : '-'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#141416] border border-white/5 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-[#F5F2EA] block">Target Deliverable Wrap-Up</span>
                  <span className="text-[#8C8A84]">Showcase presentation</span>
                </div>
                <span className="font-mono text-[#FF6A16] font-semibold">
                  {project.endDate ? format(new Date(project.endDate), 'MMM dd, yyyy') : 'Open'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#0D0D0F] rounded-xl border border-white/8 shadow-subtle p-6">
            <h3 className="text-xs font-bold text-[#F5F2EA] uppercase tracking-wider font-mono mb-4">Priority Distribution</h3>
            <div className="space-y-2.5 text-xs">
              {['URGENT', 'HIGH', 'MEDIUM', 'LOW'].map((priority) => {
                const count = project.tasks?.filter((t) => t.priority === priority).length || 0;
                return (
                  <div key={priority} className="flex items-center justify-between p-2.5 rounded-xl bg-[#141416] border border-white/5">
                    <PriorityBadge priority={priority as any} size="sm" />
                    <span className="font-mono font-bold text-[#F5F2EA]">{count} Deliverables</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Slide-over Task Detail Drawer */}
      <TaskDetailDrawer
        task={inspectingTask}
        isOpen={!!inspectingTask}
        onClose={() => setInspectingTask(null)}
        onStatusChange={handleUpdateTaskStatus}
        onDelete={handleDeleteTask}
        canEdit={canManageProject || inspectingTask?.assignedToId === user?.id}
      />

      {/* Modals */}
      <ProjectModal
        isOpen={isEditProjectOpen}
        onClose={() => setIsEditProjectOpen(false)}
        onSubmit={handleUpdateProject}
        project={project}
        title="Edit Initiative"
      />

      <TaskModal
        isOpen={isCreateTaskOpen}
        onClose={() => setIsCreateTaskOpen(false)}
        onSubmit={handleCreateTask}
        defaultProjectId={project.id}
        title="Create New Deliverable"
      />

      <TaskModal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        onSubmit={handleUpdateTask}
        task={editingTask}
        defaultProjectId={project.id}
        title="Edit Deliverable Details"
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
        title="Delete Initiative"
        message={`Are you sure you want to delete "${project.name}"? This action cannot be undone.`}
        confirmText="Delete Project"
        variant="danger"
      />

      <ConfirmDialog
        isOpen={!!removingMemberId}
        onClose={() => setRemovingMemberId(null)}
        onConfirm={handleRemoveMember}
        title="Remove Member from Squad"
        message="Are you sure you want to remove this student from the squad?"
        confirmText="Remove Member"
        variant="danger"
      />
    </PageTransition>
  );
};
