import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { User } from '../../types';
import { userApi } from '../../api/client';
import { Search, UserPlus } from 'lucide-react';
import { RoleBadge } from '../common/Badge';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMember: (userId: string) => Promise<void>;
  existingMemberIds: string[];
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({
  isOpen,
  onClose,
  onAddMember,
  existingMemberIds,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      userApi
        .getUsers({ isActive: true })
        .then((res) => {
          if (res.success && res.data) {
            setUsers(res.data);
          }
        })
        .finally(() => setIsLoading(false));
      setSelectedUserId(null);
      setSearch('');
    }
  }, [isOpen]);

  const availableUsers = users.filter(
    (u) =>
      !existingMemberIds.includes(u.id) &&
      (u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        (u.department && u.department.toLowerCase().includes(search.toLowerCase())))
  );

  const handleSubmit = async () => {
    if (!selectedUserId) return;
    setIsSubmitting(true);
    try {
      await onAddMember(selectedUserId);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Team Member" maxWidth="md">
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by name, email, or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
          />
        </div>

        {/* User list */}
        <div className="max-h-60 overflow-y-auto space-y-1.5 border border-slate-200 rounded-xl p-2 bg-slate-50">
          {isLoading ? (
            <p className="text-xs text-slate-400 text-center py-4">Loading members...</p>
          ) : availableUsers.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4">
              {users.length > 0 ? 'No matching available members found' : 'No other active members'}
            </p>
          ) : (
            availableUsers.map((u) => (
              <div
                key={u.id}
                onClick={() => setSelectedUserId(u.id)}
                className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer border transition-all ${
                  selectedUserId === u.id
                    ? 'bg-brand-50/80 border-brand-500 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={
                      u.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=10b981&color=fff`
                    }
                    alt={u.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-900 truncate">{u.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{u.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <RoleBadge role={u.role} size="sm" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="outline" size="md" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleSubmit}
            disabled={!selectedUserId}
            isLoading={isSubmitting}
            leftIcon={<UserPlus className="w-4 h-4" />}
          >
            Add to Team
          </Button>
        </div>
      </div>
    </Modal>
  );
};
