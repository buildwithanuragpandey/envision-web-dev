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
      {/* Editorial Header with Visual Frame */}
      <div className="relative rounded-xl border border-white/8 bg-[#0D0D0F] overflow-hidden shadow-2xl mb-6">
        <div className="grid grid-cols-1 md:grid-cols-12 items-center">
          <div className="p-6 sm:p-8 md:col-span-8 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#FF6A16] font-semibold bg-[#141416] px-2.5 py-1 rounded border border-white/8">
                02 / INITIATIVES DIRECTORY
              </span>
              <span className="text-[11px] font-mono text-[#8C8A84]">
                ACTIVE SQUADS & WORKSPACES
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#F5F2EA] tracking-tight">
              Club Initiatives
            </h1>
            <p className="text-xs sm:text-sm text-[#8C8A84] leading-relaxed max-w-xl">
              Active engineering projects, technical workshops, hackathons, and committee milestones across our innovation lab.
            </p>

            {isAdmin && (
              <div className="pt-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsCreateModalOpen(true)}
                  leftIcon={<Plus className="w-3.5 h-3.5 text-black font-bold" />}
                >
                  Create New Initiative
                </Button>
              </div>
            )}
          </div>

          <div className="md:col-span-4 h-44 md:h-56 relative overflow-hidden border-t md:border-t-0 md:border-l border-white/8 group">
            <img
              src="/frames/02_corridor.jpg"
              alt="Club Corridor"
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0D0D0F] via-transparent to-transparent opacity-90" />
            <div className="absolute bottom-3 right-3 bg-[#050505]/80 backdrop-blur-md px-2.5 py-1 rounded border border-white/10 text-[10px] font-mono text-[#F5F2EA]">
              02 / CORRIDOR
            </div>
            <div className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-[#FF6A16] to-transparent animate-travel-line" />
          </div>
        </div>
      </div>

      {/* Filter & Search Controls */}
      <div className="bg-[#0D0D0F] p-3.5 rounded-xl border border-white/8 shadow-subtle flex flex-col md:flex-row items-center justify-between gap-3 mb-6">
        <div className="flex flex-1 items-center gap-3 w-full">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-[#8C8A84] absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search initiatives by name or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3.5 py-1.5 text-xs bg-[#141416] border border-white/8 rounded-lg text-[#F5F2EA] placeholder:text-[#8C8A84] focus-ring"
            />
          </div>

          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs border border-white/8 rounded-lg bg-[#141416] font-medium text-[#F5F2EA] outline-none cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="PLANNING">Planning</option>
            <option value="COMPLETED">Completed</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 bg-[#141416] p-1 rounded-lg self-end md:self-auto border border-white/5">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md text-xs font-semibold transition-all ${
              viewMode === 'grid'
                ? 'bg-[#1C1C20] text-[#FF6A16] shadow-sm border border-white/5'
                : 'text-[#8C8A84] hover:text-[#F5F2EA]'
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-md text-xs font-semibold transition-all ${
              viewMode === 'table'
                ? 'bg-[#1C1C20] text-[#FF6A16] shadow-sm border border-white/5'
                : 'text-[#8C8A84] hover:text-[#F5F2EA]'
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p) => (
            <div
              key={p.id}
              className="bg-[#0D0D0F] rounded-xl border border-white/8 hover:border-[#FF6A16]/50 transition-all p-5 flex flex-col justify-between group shadow-subtle hover:-translate-y-1 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF6A16]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <StatusBadge status={p.status} size="sm" />
                  {p.startDate && (
                    <span className="font-mono text-[10px] text-[#8C8A84] flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#8C8A84]" />
                      {format(new Date(p.startDate), 'MMM yyyy')}
                    </span>
                  )}
                </div>

                <Link
                  to={`/projects/${p.id}`}
                  className="text-sm font-bold text-[#F5F2EA] group-hover:text-[#FF6A16] transition-colors block line-clamp-1 mb-1.5"
                >
                  {p.name}
                </Link>

                <p className="text-xs text-[#8C8A84] line-clamp-2 leading-relaxed mb-4">
                  {p.description || 'No description provided.'}
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 space-y-3">
                <div className="flex items-center justify-between text-xs text-[#8C8A84] font-mono">
                  <span>Progress</span>
                  <span className="font-bold text-[#FF6A16]">{p.progress}%</span>
                </div>
                <ProgressBar progress={p.progress} size="sm" />

                <div className="flex items-center justify-between pt-2 text-xs">
                  <div className="flex items-center gap-2">
                    <Avatar name={p.projectLead?.name} size="xs" />
                    <span className="text-[#F5F2EA] font-medium text-[11px] truncate max-w-[100px]">
                      {p.projectLead?.name?.split(' ')[0] || 'Unassigned'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[#8C8A84] font-mono text-[11px]">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-[#8C8A84]" />
                      {p.memberCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-[#FFD400]" />
                      {p.completedTasks}/{p.totalTasks}
                    </span>
                  </div>
                </div>

                <div className="pt-1">
                  <Link
                    to={`/projects/${p.id}`}
                    className="w-full py-2 bg-[#141416] hover:bg-[#1C1C20] text-[#F5F2EA] hover:text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors border border-white/5 hover:border-[#FF6A16]/30 group-hover:bg-[#FF6A16]/10 group-hover:text-[#FF6A16]"
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
        <div className="bg-[#0D0D0F] rounded-xl border border-white/8 shadow-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#050505] text-[#8C8A84] uppercase text-[10px] font-mono border-b border-white/8">
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
                  <tr key={p.id} className="hover:bg-[#141416]/60 transition-colors">
                    <td className="py-3 px-4">
                      <Link
                        to={`/projects/${p.id}`}
                        className="font-bold text-[#F5F2EA] hover:text-[#FF6A16] block truncate max-w-xs"
                      >
                        {p.name}
                      </Link>
                      <span className="text-[11px] text-[#8C8A84] block truncate max-w-xs">
                        {p.description || 'No description'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={p.status} size="sm" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Avatar name={p.projectLead?.name} size="xs" />
                        <span className="font-medium text-[#F5F2EA]">
                          {p.projectLead?.name || 'Unassigned'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[#8C8A84]">{p.memberCount} members</td>
                    <td className="py-3 px-4 font-mono text-[#8C8A84]">
                      {p.completedTasks}/{p.totalTasks}
                    </td>
                    <td className="py-3 px-4 w-32">
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <ProgressBar progress={p.progress} size="sm" />
                        </div>
                        <span className="font-mono font-bold text-[#FF6A16] text-[10px]">
                          {p.progress}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to={`/projects/${p.id}`}
                        className="px-2.5 py-1 bg-[#141416] hover:bg-[#1C1C20] text-[#F5F2EA] hover:text-white text-[11px] font-bold rounded-lg transition-colors inline-flex items-center gap-1 border border-white/5 hover:border-[#FF6A16]/30"
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
