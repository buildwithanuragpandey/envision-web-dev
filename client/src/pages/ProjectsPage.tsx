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
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { StatusBadge } from '../components/common/Badge';
import { Avatar } from '../components/common/Avatar';
import { ProgressBar, Skeleton, EmptyState } from '../components/common/CommonUI';
import { PageTransition } from '../components/common/PageTransition';
import { ProjectModal } from '../components/projects/ProjectModal';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useToast } from '../context/ToastContext';

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
      success('Project Created', `Initiative "${formData.name}" created successfully.`);
      refetch();
    } catch (err: any) {
      error('Creation Failed', err.response?.data?.error || 'Failed to create project');
      throw err;
    }
  };

  return (
    <PageTransition>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-white/8">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">
            CLUB INITIATIVES
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F5F0] tracking-tight mt-1.5">
            Club Projects
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Active committee initiatives, project lead appointments, and deliverable progression.
          </p>
        </div>

        {isAdmin && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5 text-black font-bold" />}
          >
            New Project
          </Button>
        )}
      </div>

      {/* Filter & Search Controls */}
      <div className="bg-[#0A0A0C] p-3 rounded-lg border border-white/8 shadow-subtle flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-3 w-full">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search initiatives..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3.5 py-1.5 text-xs bg-[#111114] border border-white/8 rounded-lg text-[#F5F5F0] placeholder:text-zinc-500 focus-ring"
            />
          </div>

          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs border border-white/8 rounded-lg bg-[#111114] font-medium text-zinc-300 outline-none"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="PLANNING">Planning</option>
            <option value="COMPLETED">Completed</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 bg-[#111114] p-1 rounded-lg self-end md:self-auto border border-white/5">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md text-xs font-semibold transition-all ${
              viewMode === 'grid'
                ? 'bg-[#16161A] text-[#FF6814] shadow-sm border border-white/5'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-md text-xs font-semibold transition-all ${
              viewMode === 'table'
                ? 'bg-[#16161A] text-[#FF6814] shadow-sm border border-white/5'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
            title="Table View"
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Projects Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-56 rounded-lg" />
          ))}
        </div>
      ) : !projects || projects.length === 0 ? (
        <EmptyState
          icon={<FolderKanban className="w-6 h-6 text-[#FF6814]" />}
          title="No initiatives found"
          description="Adjust your search criteria or create a project."
          action={
            isAdmin ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsCreateModalOpen(true)}
                leftIcon={<Plus className="w-3.5 h-3.5 text-black font-bold" />}
              >
                Create Project
              </Button>
            ) : undefined
          }
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => (
            <div
              key={p.id}
              className="bg-[#0A0A0C] rounded-lg border border-white/8 hover:border-[#FF6814]/40 transition-all p-5 flex flex-col justify-between group shadow-subtle hover:-translate-y-0.5"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <StatusBadge status={p.status} size="sm" />
                  {p.startDate && (
                    <span className="font-mono text-[10px] text-zinc-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-zinc-500" />
                      {format(new Date(p.startDate), 'MMM yyyy')}
                    </span>
                  )}
                </div>

                <Link
                  to={`/projects/${p.id}`}
                  className="text-sm font-semibold text-[#F5F5F0] group-hover:text-[#FF6814] transition-colors block line-clamp-1 mb-1.5"
                >
                  {p.name}
                </Link>

                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-4">
                  {p.description || 'No description provided.'}
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 space-y-2.5">
                <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                  <span>Progress</span>
                  <span className="font-bold text-[#FF6814]">{p.progress}%</span>
                </div>
                <ProgressBar progress={p.progress} size="sm" />

                <div className="flex items-center justify-between pt-2 text-xs">
                  <div className="flex items-center gap-2">
                    <Avatar name={p.projectLead?.name} size="xs" />
                    <span className="text-zinc-300 font-medium text-[11px] truncate max-w-[100px]">
                      {p.projectLead?.name?.split(' ')[0] || 'Unassigned'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-zinc-500 font-mono text-[11px]">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {p.memberCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {p.completedTasks}/{p.totalTasks}
                    </span>
                  </div>
                </div>

                <div className="pt-1">
                  <Link
                    to={`/projects/${p.id}`}
                    className="w-full py-1.5 bg-[#111114] hover:bg-[#16161A] text-zinc-300 hover:text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors border border-white/5 hover:border-white/10"
                  >
                    <span>Open Workspace</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-[#0A0A0C] rounded-lg border border-white/8 shadow-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#050506] text-zinc-400 uppercase text-[10px] font-mono border-b border-white/8">
                <tr>
                  <th className="py-3 px-4">Initiative</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Project Lead</th>
                  <th className="py-3 px-4">Squad</th>
                  <th className="py-3 px-4">Tasks</th>
                  <th className="py-3 px-4">Progress</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {projects.map((p) => (
                  <tr key={p.id} className="hover:bg-[#111114]/60">
                    <td className="py-3 px-4">
                      <Link
                        to={`/projects/${p.id}`}
                        className="font-semibold text-[#F5F5F0] hover:text-[#FF6814] block truncate max-w-xs"
                      >
                        {p.name}
                      </Link>
                      <span className="text-[11px] text-zinc-500 block truncate max-w-xs">
                        {p.description || 'No description'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={p.status} size="sm" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Avatar name={p.projectLead?.name} size="xs" />
                        <span className="font-medium text-zinc-300">
                          {p.projectLead?.name || 'Unassigned'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-zinc-400">{p.memberCount} members</td>
                    <td className="py-3 px-4 font-mono text-zinc-400">
                      {p.completedTasks}/{p.totalTasks}
                    </td>
                    <td className="py-3 px-4 w-32">
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <ProgressBar progress={p.progress} size="sm" />
                        </div>
                        <span className="font-mono font-semibold text-[#FF6814] text-[10px]">
                          {p.progress}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to={`/projects/${p.id}`}
                        className="px-2.5 py-1 bg-[#111114] hover:bg-[#16161A] text-zinc-300 hover:text-white text-[11px] font-semibold rounded-lg transition-colors inline-flex items-center gap-1 border border-white/5"
                      >
                        Workspace
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

      {/* Create Modal */}
      <ProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateProject}
        title="Create New Initiative"
      />
    </PageTransition>
  );
};
