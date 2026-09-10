import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { User, UserRole } from '../../types';
import { useToast } from '../../context/ToastContext';

interface MemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  member?: User | null;
  title: string;
}

export const MemberModal: React.FC<MemberModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  member,
  title,
}) => {
  const { error } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('MEMBER');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('');
  const [avatar, setAvatar] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (member) {
        setName(member.name || '');
        setEmail(member.email || '');
        setPassword('');
        setRole(member.role || 'MEMBER');
        setDepartment(member.department || '');
        setYear(member.year || '');
        setAvatar(member.avatar || '');
        setIsActive(member.isActive !== undefined ? member.isActive : true);
      } else {
        setName('');
        setEmail('');
        setPassword('Password123!');
        setRole('MEMBER');
        setDepartment('CSE');
        setYear('3rd Year');
        setAvatar('');
        setIsActive(true);
      }
    }
  }, [isOpen, member]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      error('Validation Error', 'Name and email are required');
      return;
    }
    if (!member && !password.trim()) {
      error('Validation Error', 'Password is required for new accounts');
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role,
        department: department.trim() || undefined,
        year: year.trim() || undefined,
        avatar: avatar.trim() || undefined,
        isActive,
        ...(password.trim() ? { password: password.trim() } : {}),
      });
      onClose();
    } catch (err: any) {
      error('Operation Failed', err.response?.data?.error || 'Could not save member details');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="md">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Name */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1 font-mono">
            Full Name <span className="text-[#FF6814]">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Anurag Pandey"
            className="w-full px-3.5 py-2 text-xs bg-[#111114] border border-white/8 rounded-lg text-[#F5F5F0] placeholder:text-zinc-600 focus-ring"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1 font-mono">
            College Email Address <span className="text-[#FF6814]">*</span>
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. anurag@clubflow.local"
            className="w-full px-3.5 py-2 text-xs bg-[#111114] border border-white/8 rounded-lg text-[#F5F5F0] placeholder:text-zinc-600 focus-ring"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1 font-mono">
            {member ? 'Reset Password (optional)' : 'Password *'}
          </label>
          <input
            type="password"
            required={!member}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={member ? 'Leave blank to retain existing password' : 'Min 6 characters'}
            className="w-full px-3.5 py-2 text-xs bg-[#111114] border border-white/8 rounded-lg text-[#F5F5F0] placeholder:text-zinc-600 focus-ring"
          />
        </div>

        {/* Role & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1 font-mono">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full px-3 py-2 text-xs border border-white/8 rounded-lg bg-[#111114] text-zinc-300 focus-ring"
            >
              <option value="MEMBER">Member</option>
              <option value="PROJECT_LEAD">Project Lead</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1 font-mono">
              Account Status
            </label>
            <select
              value={isActive ? 'active' : 'inactive'}
              onChange={(e) => setIsActive(e.target.value === 'active')}
              className="w-full px-3 py-2 text-xs border border-white/8 rounded-lg bg-[#111114] text-zinc-300 focus-ring"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive / Deactivated</option>
            </select>
          </div>
        </div>

        {/* Department & Year */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1 font-mono">
              Department
            </label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g. Computer Science"
              className="w-full px-3.5 py-2 text-xs bg-[#111114] border border-white/8 rounded-lg text-[#F5F5F0] placeholder:text-zinc-600 focus-ring"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1 font-mono">
              Year / Academic Level
            </label>
            <input
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="e.g. 3rd Year"
              className="w-full px-3.5 py-2 text-xs bg-[#111114] border border-white/8 rounded-lg text-[#F5F5F0] placeholder:text-zinc-600 focus-ring"
            />
          </div>
        </div>

        {/* Avatar URL */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1 font-mono">
            Avatar Image URL (optional)
          </label>
          <input
            type="url"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            placeholder="https://..."
            className="w-full px-3.5 py-2 text-xs bg-[#111114] border border-white/8 rounded-lg text-[#F5F5F0] placeholder:text-zinc-600 focus-ring"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-white/8 mt-6">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={isLoading}>
            {member ? 'Save Changes' : 'Enroll Member'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
