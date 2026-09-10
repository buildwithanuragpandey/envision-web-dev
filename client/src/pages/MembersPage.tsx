import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { userApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  FolderKanban,
  Mail,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { RoleBadge } from '../components/common/Badge';
import { Skeleton, EmptyState, ConfirmDialog } from '../components/common/CommonUI';
import { PageTransition } from '../components/common/PageTransition';
import { MemberModal } from '../components/members/MemberModal';
import { format } from 'date-fns';
import { useToast } from '../context/ToastContext';
import { User } from '../types';

export const MembersPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const { success, error } = useToast();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');

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
    <PageTransition>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-zinc-200/80">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-zinc-400">
            Community & Team
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight mt-1">
            Club Directory
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Browse members, manage permissions, assign roles, and view organizational involvement.
          </p>
        </div>

        {isAdmin && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Add Member
          </Button>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-zinc-200/80 shadow-subtle flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-3 w-full">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search members by name, email, or department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3.5 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400 focus-ring"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-1.5 text-xs border border-zinc-200 rounded-xl bg-zinc-50 font-medium text-zinc-700 outline-none"
          >
            <option value="">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="PROJECT_LEAD">Project Lead</option>
            <option value="MEMBER">Member</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs border border-zinc-200 rounded-xl bg-zinc-50 font-medium text-zinc-700 outline-none"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Members Table */}
      {isLoading ? (
        <div className="space-y-2.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      ) : !users || users.length === 0 ? (
        <EmptyState
          icon={<Users className="w-6 h-6 text-zinc-400" />}
          title="No members found"
          description="Adjust your search criteria or enroll a new contributor."
          action={
            isAdmin ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsAddModalOpen(true)}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
              >
                Add Member
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 text-zinc-500 uppercase text-[10px] font-mono border-b border-zinc-200/80">
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
              <tbody className="divide-y divide-zinc-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-zinc-50/60 transition-colors group">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            u.avatar ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              u.name
                            )}&background=18181b&color=fff`
                          }
                          alt={u.name}
                          className="w-8 h-8 rounded-lg object-cover ring-1 ring-zinc-200 shrink-0 group-hover:scale-105 transition-transform"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-zinc-900 text-xs truncate">{u.name}</p>
                          <p className="text-[11px] text-zinc-400 truncate flex items-center gap-1 font-mono">
                            <Mail className="w-3 h-3 text-zinc-400" />
                            {u.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <RoleBadge role={u.role} size="sm" />
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-medium text-zinc-800 block">
                        {u.department || 'General'}
                      </span>
                      <span className="text-[11px] text-zinc-400 font-mono">{u.year || 'Member'}</span>
                    </td>

                    <td className="py-3 px-4 font-semibold text-zinc-700">
                      <span className="inline-flex items-center gap-1 bg-zinc-100 px-2 py-0.5 rounded text-[11px] font-mono">
                        <FolderKanban className="w-3 h-3 text-zinc-500" />
                        {u._count?.projectMembers || 0} squads
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      {u.isActive ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                          <CheckCircle2 className="w-3 h-3" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full border border-zinc-200">
                          <XCircle className="w-3 h-3 text-zinc-400" />
                          Inactive
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-zinc-400 font-mono text-[11px]">
                      {format(new Date(u.createdAt), 'MMM dd, yyyy')}
                    </td>

                    {isAdmin && (
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setEditingMember(u)}
                            className="p-1.5 text-zinc-400 hover:text-zinc-800 rounded hover:bg-zinc-100 transition-colors"
                            title="Edit Member"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingUserId(u.id)}
                            className="p-1.5 text-zinc-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
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
    </PageTransition>
  );
};
