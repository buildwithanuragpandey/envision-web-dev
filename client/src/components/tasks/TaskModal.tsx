import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Task, Project, User, TaskPriority, TaskStatus } from '../../types';
import { projectApi, userApi } from '../../api/client';
import { useToast } from '../../context/ToastContext';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  task?: Task | null;
  defaultProjectId?: string;
  title: string;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  task,
  defaultProjectId,
  title,
}) => {
  const { error } = useToast();
  const [taskTitle, setTaskTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState(defaultProjectId || '');
  const [assignedToId, setAssignedToId] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
  const [status, setStatus] = useState<TaskStatus>('TODO');
  const [deadline, setDeadline] = useState('');

  const [projects, setProjects] = useState<Project[]>([]);
  const [projectMembers, setProjectMembers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Load projects
      projectApi
        .getProjects()
        .then((res) => {
          if (res.success && res.data) {
            setProjects(res.data);
            if (!projectId && res.data.length > 0) {
              setProjectId(defaultProjectId || res.data[0].id);
            }
          }
        })
        .catch(console.error);

      if (task) {
        setTaskTitle(task.title || '');
        setDescription(task.description || '');
        setProjectId(task.projectId || defaultProjectId || '');
        setAssignedToId(task.assignedToId || '');
        setPriority(task.priority || 'MEDIUM');
        setStatus(task.status || 'TODO');
        setDeadline(task.deadline ? task.deadline.split('T')[0] : '');
      } else {
        setTaskTitle('');
        setDescription('');
        setProjectId(defaultProjectId || '');
        setAssignedToId('');
        setPriority('MEDIUM');
        setStatus('TODO');
        setDeadline(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
      }
    }
  }, [isOpen, task, defaultProjectId]);

  // Load project members whenever projectId changes
  useEffect(() => {
    if (projectId) {
      projectApi
        .getMembers(projectId)
        .then((res) => {
          if (res.success && res.data) {
            setProjectMembers(res.data);
          }
        })
        .catch(() => {
          // If fallback, load general users
          userApi.getUsers({ isActive: true }).then((res) => {
            if (res.success && res.data) setProjectMembers(res.data);
          });
        });
    }
  }, [projectId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) {
      error('Validation Error', 'Task title is required');
      return;
    }
    if (!projectId) {
      error('Validation Error', 'Please select a project');
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit({
        title: taskTitle.trim(),
        description: description.trim() || undefined,
        projectId,
        assignedToId: assignedToId || undefined,
        priority,
        status,
        deadline: deadline ? new Date(deadline).toISOString() : undefined,
      });
      onClose();
    } catch (err: any) {
      error('Operation Failed', err.response?.data?.error || 'Could not save task');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Task Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="e.g. Implement OAuth2 login flow"
            className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
          />
        </div>

        {/* Project Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Project <span className="text-rose-500">*</span>
          </label>
          <select
            required
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            disabled={!!defaultProjectId && !task}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none bg-white disabled:bg-slate-100"
          >
            <option value="">-- Select Project --</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.status})
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Description
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Outline task details, acceptance criteria, or relevant links..."
            className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
          />
        </div>

        {/* Assignee & Priority */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Assignee
            </label>
            <select
              value={assignedToId}
              onChange={(e) => setAssignedToId(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none bg-white"
            >
              <option value="">-- Unassigned --</option>
              {projectMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.department || m.role})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none bg-white"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>
        </div>

        {/* Status & Deadline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none bg-white"
            >
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Target Deadline
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none bg-white"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
          <Button type="button" variant="outline" size="md" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="md" isLoading={isLoading}>
            {task ? 'Save Changes' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
