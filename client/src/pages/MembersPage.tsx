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
  X,
  Calendar,
  Building,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { RoleBadge } from '../components/common/Badge';
import { Avatar } from '../components/common/Avatar';
import { Skeleton, EmptyState, ConfirmDialog } from '../components/common/CommonUI';
import { PageTransition } from '../components/common/PageTransition';
import { MemberModal } from '../components/members/MemberModal';
import { format } from 'date-fns';
import { useToast } from '../context/ToastContext';
import { User } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

export const MembersPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const { success, error } = useToast();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<User | null>(null);
  const [inspectingMember, setInspectingMember] = useState<User | null>(null);
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
      success('Member Enrolled', `Created account for ${formData.name}.`);
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
      if (inspectingMember && inspectingMember.id === editingMember.id) {
        setInspectingMember({ ...inspectingMember, ...formData });
      }
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
      if (inspectingMember && inspectingMember.id === deletingUserId) {
        setInspectingMember(null);
      }
      refetch();
    } catch (err: any) {
      error('Delete Failed', err.response?.data?.error || 'Could not delete member');
    }
  };

  return (
    <PageTransition>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-zinc-200/80">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">
            Club Community & Roster
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight mt-1.5">
            Club Directory
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Browse members, manage committee permissions, and view organizational involvement.
          </p>
        </div>

        {isAdmin && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Enroll Member
          </Button>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-zinc-200/80 shadow-subtle flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-3 w-full">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search members by name, email, or department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3.5 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900 placeholder:text-zinc-400 focus-ring"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-1.5 text-xs border border-zinc-200 rounded-lg bg-zinc-50 font-medium text-zinc-700 outline-none"
          >
            <option value="">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="PROJECT_LEAD">Project Lead</option>
            <option value="MEMBER">Member</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs border border-zinc-200 rounded-lg bg-zinc-50 font-medium text-zinc-700 outline-none"
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
          description="Adjust your search criteria or enroll a new member."
          action={
            isAdmin ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsAddModalOpen(true)}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
              >
                Enroll Member
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="bg-white rounded-xl border border-zinc-200/80 shadow-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 text-zinc-500 uppercase text-[10px] font-mono border-b border-zinc-200/80">
                <tr>
                  <th className="py-3 px-4">Member</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Department & Year</th>
                  <th className="py-3 px-4">Projects</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Joined Date</th>
                  {isAdmin && <th className="py-3 px-4 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {users.map((u) => (
                  <tr
                    key={u.id}
                    onClick={() => setInspectingMember(u)}
                    className="hover:bg-zinc-50/60 transition-colors group cursor-pointer"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={u.name} size="md" className="shrink-0" />
                        <div className="min-w-0">
                          <p className="font-bold text-zinc-900 text-xs truncate group-hover:text-emerald-700 transition-colors">
                            {u.name}
                          </p>
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
                      <span className="font-medium text-zinc-800 block truncate max-w-xs">
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
                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => setEditingMember(u)}
                            className="p-1.5 text-zinc-400 hover:text-zinc-800 rounded hover:bg-zinc-100 transition-colors"
                            title="Edit Member"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
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

      {/* Member Inspection Slide-over Drawer */}
      <AnimatePresence>
        {inspectingMember && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setInspectingMember(null)}
              className="absolute inset-0 bg-zinc-950/40 backdrop-blur-sm"
            />
            <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 350 }}
                className="w-screen max-w-md bg-white border-l border-zinc-200/80 shadow-2xl p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
                    <span className="font-mono text-xs uppercase font-semibold text-zinc-400">
                      Member Profile
                    </span>
                    <button
                      type="button"
                      onClick={() => setInspectingMember(null)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="pt-6 flex flex-col items-center text-center space-y-2">
                    <Avatar name={inspectingMember.name} size="xl" />
                    <h3 className="text-lg font-bold text-zinc-900 mt-2">{inspectingMember.name}</h3>
                    <RoleBadge role={inspectingMember.role} size="sm" />
                    <p className="text-xs text-zinc-400 font-mono">{inspectingMember.email}</p>
                  </div>

                  <div className="mt-6 rounded-xl bg-zinc-50 border border-zinc-200/70 p-4 space-y-3 text-xs">
                    <div className="flex justify-between">
                      <span className="text-zinc-500 font-medium">Department</span>
                      <span className="font-semibold text-zinc-800">
                        {inspectingMember.department || 'Not set'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500 font-medium">Academic Level</span>
                      <span className="font-semibold text-zinc-800">
                        {inspectingMember.year || 'Not set'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500 font-medium">Enrolled Squads</span>
                      <span className="font-semibold text-zinc-800 font-mono">
                        {inspectingMember._count?.projectMembers || 0} initiatives
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500 font-medium">Account Status</span>
                      <span className="font-semibold text-emerald-600">
                        {inspectingMember.isActive ? 'Active Member' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingMember(inspectingMember);
                      }}
                      className="px-3.5 py-1.5 rounded-lg border border-zinc-200 hover:border-zinc-300 bg-white text-zinc-800 text-xs font-semibold"
                    >
                      Edit Account
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setInspectingMember(null)}
                    className="px-4 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold rounded-lg ml-auto shadow-sm"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <MemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateMember}
        title="Enroll New Member"
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
        title="Remove Member Account"
        message="Are you sure you want to delete this user? This will remove their project memberships and task assignments."
        confirmText="Delete Account"
        variant="danger"
      />
    </PageTransition>
  );
};
