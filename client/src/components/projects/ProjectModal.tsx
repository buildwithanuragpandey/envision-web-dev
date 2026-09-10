import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Project, User, ProjectStatus } from '../../types';
import { userApi } from '../../api/client';
import { useToast } from '../../context/ToastContext';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  project?: Project | null;
  title: string;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  project,
  title,
}) => {
  const { error } = useToast();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('ACTIVE');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [projectLeadId, setProjectLeadId] = useState('');
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingUsers, setIsFetchingUsers] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Fetch users for project lead and member assignment
      setIsFetchingUsers(true);
      userApi
        .getUsers({ isActive: true })
        .then((res) => {
          if (res.success && res.data) {
            setUsers(res.data);
          }
        })
        .catch((e) => console.error('Failed to fetch users:', e))
        .finally(() => setIsFetchingUsers(false));

      if (project) {
        setName(project.name || '');
        setDescription(project.description || '');
        setStatus(project.status || 'ACTIVE');
        setStartDate(project.startDate ? project.startDate.split('T')[0] : '');
        setEndDate(project.endDate ? project.endDate.split('T')[0] : '');
        setProjectLeadId(project.projectLeadId || '');
        setSelectedMemberIds(project.members?.map((m) => m.id) || []);
      } else {
        setName('');
        setDescription('');
        setStatus('ACTIVE');
        setStartDate(new Date().toISOString().split('T')[0]);
        setEndDate('');
        setProjectLeadId('');
        setSelectedMemberIds([]);
      }
    }
  }, [isOpen, project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      error('Validation Error', 'Project name is required');
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim() || undefined,
        status,
        startDate: startDate ? new Date(startDate).toISOString() : undefined,
        endDate: endDate ? new Date(endDate).toISOString() : undefined,
        projectLeadId: projectLeadId || undefined,
        memberIds: selectedMemberIds,
      });
      onClose();
    } catch (err: any) {
      error('Operation Failed', err.response?.data?.error || 'Could not save project');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMemberSelection = (userId: string) => {
    setSelectedMemberIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Project Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Autonomous Campus Rover"
            className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
          />
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
            placeholder="Briefly describe project objectives and key deliverables..."
            className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
          />
        </div>

        {/* Status & Project Lead */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Project Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ProjectStatus)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none bg-white"
            >
              <option value="PLANNING">Planning</option>
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Project Lead
            </label>
            <select
              value={projectLeadId}
              onChange={(e) => setProjectLeadId(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none bg-white"
            >
              <option value="">-- Assign Project Lead --</option>
              {users
                .filter((u) => u.role === 'PROJECT_LEAD' || u.role === 'ADMIN' || u.role === 'MEMBER')
                .map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role})
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Timeline Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              End Date / Target Deadline
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none bg-white"
            />
          </div>
        </div>

        {/* Initial Team Members (if creating) */}
        {!project && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Select Initial Team Members
            </label>
            <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-xl p-2 space-y-1 bg-slate-50">
              {isFetchingUsers ? (
                <p className="text-xs text-slate-400 p-2">Loading club directory...</p>
              ) : (
                users.map((u) => (
                  <label
                    key={u.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-white transition-colors cursor-pointer border border-transparent hover:border-slate-200"
                  >
                    <input
                      type="checkbox"
                      checked={selectedMemberIds.includes(u.id) || projectLeadId === u.id}
                      disabled={projectLeadId === u.id}
                      onChange={() => toggleMemberSelection(u.id)}
                      className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
                    />
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <img
                        src={
                          u.avatar ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=10b981&color=fff`
                        }
                        alt={u.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="text-xs font-medium text-slate-800 truncate">{u.name}</span>
                      <span className="text-[10px] text-slate-400">({u.department || u.role})</span>
                    </div>
                  </label>
                ))
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
          <Button type="button" variant="outline" size="md" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="md" isLoading={isLoading}>
            {project ? 'Save Changes' : 'Create Project'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
