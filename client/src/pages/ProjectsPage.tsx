import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { projectApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
  FolderKanban,
  Search,
  Plus,
  LayoutGrid,
  List,
  Calendar,
  Users,
  CheckCircle2,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { StatusBadge } from '../components/common/Badge';
import { ProgressBar, Skeleton, EmptyState } from '../components/common/CommonUI';
import { ProjectModal } from '../components/projects/ProjectModal';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useToast } from '../context/ToastContext';
import { ProjectStatus } from '../types';

export const ProjectsPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const { success, error } = useToast();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data: projects, isLoading, refetch } = useQuery({
    queryKey: ['projects', search, statusFilter],
    queryFn: async () => {
      const res = await projectApi.getProjects({
        search: search || undefined,
        status: statusFilter || undefined,
      });
      return res.data || [];
    },
  });

  const handleCreateProject = async (formData: any) => {
    try {
      await projectApi.createProject(formData);
      success('Project Created', `Project "${formData.name}" has been created successfully.`);
      refetch();
    } catch (err: any) {
      error('Creation Failed', err.response?.data?.error || 'Failed to create project');
      throw err;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Club Projects</h2>
          <p className="text-xs text-slate-500 mt-1">
            Browse active initiatives, milestones, lead appointments, and team rosters.
          </p>
        </div>
        {isAdmin && (
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsCreateModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            New Project
          </Button>
        )}
      </div>

      {/* Filters & Search Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-subtle flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3 w-full">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search projects by name or keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
            />
          </div>

          {/* Status Dropdown */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none bg-white font-medium text-slate-700"
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="PLANNING">Planning</option>
              <option value="COMPLETED">Completed</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-end md:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'grid'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
            title="Grid View"
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

      {/* Projects List Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-64 rounded-2xl" />
          ))}
        </div>
      ) : !projects || projects.length === 0 ? (
        <EmptyState
          icon={<FolderKanban className="w-8 h-8 text-slate-400" />}
          title="No projects found"
          description="Try adjusting your search filters or create a new project."
          action={
            isAdmin ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsCreateModalOpen(true)}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Create First Project
              </Button>
            ) : undefined
          }
        />
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-brand-500/40 hover:shadow-card transition-all duration-200 p-6 flex flex-col justify-between group"
            >
              <div>
                {/* Header Tag */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <StatusBadge status={p.status} size="sm" />
                  {p.startDate && (
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(p.startDate), 'MMM yyyy')}
                    </span>
                  )}
                </div>

                {/* Name */}
                <Link
                  to={`/projects/${p.id}`}
                  className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition-colors block line-clamp-1 mb-2"
                >
                  {p.name}
                </Link>

                {/* Description */}
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                  {p.description || 'No description provided.'}
                </p>
              </div>

              {/* Progress & Meta Info */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
                  <span>Progress</span>
                  <span className="font-bold text-slate-900">{p.progress}%</span>
                </div>
                <ProgressBar progress={p.progress} size="md" />

                {/* Footer Lead and Members */}
                <div className="flex items-center justify-between pt-2 text-xs">
                  <div className="flex items-center gap-2">
                    <img
                      src={
                        p.projectLead?.avatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          p.projectLead?.name || 'Lead'
                        )}&background=10b981&color=fff`
                      }
                      alt={p.projectLead?.name || 'Lead'}
                      className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200"
                    />
                    <span className="text-slate-700 font-medium truncate max-w-[100px]">
                      {p.projectLead?.name?.split(' ')[0] || 'No Lead'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {p.memberCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {p.completedTasks}/{p.totalTasks}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    to={`/projects/${p.id}`}
                    className="w-full py-2 bg-slate-50 hover:bg-brand-50 hover:text-brand-700 text-slate-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-slate-200/60 hover:border-brand-300"
                  >
                    <span>View Project</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Project</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Project Lead</th>
                  <th className="py-3 px-4">Team</th>
                  <th className="py-3 px-4">Tasks</th>
                  <th className="py-3 px-4">Progress</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {projects.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-4">
                      <Link
                        to={`/projects/${p.id}`}
                        className="font-bold text-slate-900 hover:text-brand-600 block truncate max-w-xs"
                      >
                        {p.name}
                      </Link>
                      <span className="text-[11px] text-slate-400 block truncate max-w-xs">
                        {p.description || 'No description'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={p.status} size="sm" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <img
                          src={
                            p.projectLead?.avatar ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              p.projectLead?.name || 'Lead'
                            )}&background=10b981&color=fff`
                          }
                          alt={p.projectLead?.name || 'Lead'}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="font-semibold text-slate-800">
                          {p.projectLead?.name || 'Unassigned'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">{p.memberCount} members</td>
                    <td className="py-3 px-4 font-medium text-slate-700">
                      {p.completedTasks}/{p.totalTasks}
                    </td>
                    <td className="py-3 px-4 w-36">
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <ProgressBar progress={p.progress} size="sm" />
                        </div>
                        <span className="font-semibold text-slate-700 text-[11px]">
                          {p.progress}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to={`/projects/${p.id}`}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-slate-700 text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1"
                      >
                        Details
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Project Creation Modal */}
      <ProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateProject}
        title="Create New Project"
      />
    </div>
  );
};
