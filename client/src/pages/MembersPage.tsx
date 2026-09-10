import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { userApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  Search,
  Plus,
  Filter,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  FolderKanban,
  Mail,
  Building,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { RoleBadge } from '../components/common/Badge';
import { Skeleton, EmptyState, ConfirmDialog } from '../components/common/CommonUI';
import { MemberModal } from '../components/members/MemberModal';
import { format } from 'date-fns';
import { useToast } from '../context/ToastContext';
import { User, UserRole } from '../types';

export const MembersPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const { success, error } = useToast();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<User | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ['users', search, roleFilter, statusFilter],
    queryFn: async () => {
      const res = await userApi.getUsers({
        search: search || undefined,
        role: roleFilter || undefined,
        isActive: statusFilter ? statusFilter === 'active' : undefined,
      });
      return res.data || [];
    },
  });

  const handleCreateMember = async (formData: any) => {
    try {
      await userApi.createUser(formData);
      success('Member Added', `Created account for ${formData.name}.`);
      refetch();
    } catch (err: any) {
      error('Failed to create member', err.response?.data?.error || 'Could not add member');
      throw err;
    }
  };

  const handleUpdateMember = async (formData: any) => {
    if (!editingMember) return;
    try {
      await userApi.updateUser(editingMember.id, formData);
      success('Member Updated', `Updated details for ${formData.name}.`);
      setEditingMember(null);
      refetch();
    } catch (err: any) {
      error('Update Failed', err.response?.data?.error || 'Could not update member');
      throw err;
    }
  };

  const handleDeleteMember = async () => {
    if (!deletingUserId) return;
    try {
      await userApi.deleteUser(deletingUserId);
      success('Member Removed', 'User account has been removed.');
      setDeletingUserId(null);
      refetch();
    } catch (err: any) {
      error('Delete Failed', err.response?.data?.error || 'Could not delete member');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Club Directory</h2>
          <p className="text-xs text-slate-500 mt-1">
            Browse members, manage permissions, assign roles, and view organizational involvement.
          </p>
        </div>
        {isAdmin && (
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsAddModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Member
          </Button>
        )}
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-subtle flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3 w-full">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search members by name, email, or department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
            />
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none bg-white font-medium text-slate-700"
          >
            <option value="">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="PROJECT_LEAD">Project Lead</option>
            <option value="MEMBER">Member</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none bg-white font-medium text-slate-700"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Members Table */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      ) : !users || users.length === 0 ? (
        <EmptyState
          icon={<Users className="w-8 h-8 text-slate-400" />}
          title="No members found"
          description="Try modifying your search criteria or add a new member."
          action={
            isAdmin ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsAddModalOpen(true)}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Add Member
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Member</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Department & Level</th>
                  <th className="py-3 px-4">Projects</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Joined Date</th>
                  {isAdmin && <th className="py-3 px-4 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* User Card */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            u.avatar ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              u.name
                            )}&background=10b981&color=fff`
                          }
                          alt={u.name}
                          className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 text-xs truncate">{u.name}</p>
                          <p className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-400" />
                            {u.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-3.5 px-4">
                      <RoleBadge role={u.role} size="sm" />
                    </td>

                    {/* Department & Year */}
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-800 block">
                        {u.department || 'General'}
                      </span>
                      <span className="text-[11px] text-slate-400">{u.year || 'Member'}</span>
                    </td>

                    {/* Projects Count */}
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md text-[11px]">
                        <FolderKanban className="w-3 h-3 text-slate-500" />
                        {u._count?.projectMembers || 0} projects
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {u.isActive ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                          <XCircle className="w-3 h-3 text-slate-400" />
                          Inactive
                        </span>
                      )}
                    </td>

                    {/* Joined Date */}
                    <td className="py-3.5 px-4 text-slate-500">
                      {format(new Date(u.createdAt), 'MMM dd, yyyy')}
                    </td>

                    {/* Actions */}
                    {isAdmin && (
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setEditingMember(u)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition-colors"
                            title="Edit Member"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingUserId(u.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
                            title="Delete Member"
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
      <MemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateMember}
        title="Add New Member"
      />

      <MemberModal
        isOpen={!!editingMember}
        onClose={() => setEditingMember(null)}
        onSubmit={handleUpdateMember}
        member={editingMember}
        title="Edit Member Details"
      />

      <ConfirmDialog
        isOpen={!!deletingUserId}
        onClose={() => setDeletingUserId(null)}
        onConfirm={handleDeleteMember}
        title="Delete Member Account"
        message="Are you sure you want to delete this user? This will remove their project memberships and task assignments."
        confirmText="Delete Account"
        variant="danger"
      />
    </div>
  );
};
