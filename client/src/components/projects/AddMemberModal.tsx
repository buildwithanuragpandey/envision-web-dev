import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Avatar } from '../common/Avatar';
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
      <div className="space-y-4 text-xs">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by student name or roll..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-[#111114] border border-white/8 rounded-lg text-[#F5F5F0] placeholder:text-zinc-600 focus-ring"
          />
        </div>

        {/* User list */}
        <div className="max-h-60 overflow-y-auto space-y-1.5 border border-white/8 rounded-lg p-2 bg-[#111114]">
          {isLoading ? (
            <p className="text-xs text-zinc-500 text-center py-4">Loading club directory...</p>
          ) : availableUsers.length === 0 ? (
            <p className="text-xs text-zinc-500 text-center py-4">
              {users.length > 0 ? 'No matching available students found' : 'No other active members'}
            </p>
          ) : (
            availableUsers.map((u) => (
              <div
                key={u.id}
                onClick={() => setSelectedUserId(u.id)}
                className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer border transition-all ${
                  selectedUserId === u.id
                    ? 'bg-[#16161A] border-[#FF6814]/50 shadow-glow-orange'
                    : 'bg-[#0A0A0C] border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar name={u.name} size="sm" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#F5F5F0] truncate">{u.name}</p>
                    <p className="text-[11px] text-zinc-500 truncate font-mono">{u.email}</p>
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
        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-white/8">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            disabled={!selectedUserId}
            isLoading={isSubmitting}
            leftIcon={<UserPlus className="w-3.5 h-3.5 text-black font-bold" />}
          >
            Add to Squad
          </Button>
        </div>
      </div>
    </Modal>
  );
};
