import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/client';
import { Button } from '../components/common/Button';
import { RoleBadge } from '../components/common/Badge';
import { Avatar } from '../components/common/Avatar';
import { CheckCircle2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const SettingsPage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const { success, error } = useToast();

  // Profile fields
  const [name, setName] = useState(user?.name || '');
  const [department, setDepartment] = useState(user?.department || '');
  const [year, setYear] = useState(user?.year || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    try {
      await authApi.updateProfile({
        name,
        department,
        year,
        avatar,
      });
      await refreshUser();
      success('Profile Updated', 'Your profile details have been successfully saved.');
    } catch (err: any) {
      error('Update Failed', err.response?.data?.error || 'Could not update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      error('Validation Error', 'New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      error('Validation Error', 'New password must be at least 6 characters');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      await authApi.changePassword({
        currentPassword,
        newPassword,
      });
      success('Password Changed', 'Your security password has been changed.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      error('Password Change Failed', err.response?.data?.error || 'Could not change password');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-4xl text-[#F5F5F0]"
    >
      {/* Editorial Header */}
      <div className="border-b border-white/8 pb-4">
        <span className="font-mono text-[10px] uppercase tracking-wider text-[#FF6A16] font-bold">
          SECURITY & PREFERENCES
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F2EA] tracking-tight mt-1">Account & Security</h1>
        <p className="text-xs text-[#8C8A84] mt-1">
          Manage your student credentials, role permissions, and authentication security.
        </p>
      </div>

      {/* Profile Overview Banner */}
      <div className="bg-[#0D0D0F] rounded-xl border border-white/8 p-6 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Avatar name={user?.name} src={avatar} size="xl" />
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-base font-bold text-[#F5F2EA]">{user?.name}</h2>
              <RoleBadge role={user?.role || 'MEMBER'} size="sm" />
            </div>
            <p className="text-xs text-[#8C8A84] font-mono mt-0.5">{user?.email}</p>
            <div className="flex items-center gap-2 mt-2 text-xs text-[#8C8A84]">
              <span className="inline-flex items-center gap-1 text-[#FFD400] font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#FFD400]" />
                Enrolled Club Member
              </span>
              <span>•</span>
              <span className="font-mono">{user?.department || 'Department Unset'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Info Form */}
      <div className="bg-[#0D0D0F] rounded-xl border border-white/8 p-6 shadow-subtle space-y-6">
        <div>
          <h3 className="text-sm font-bold text-[#F5F2EA]">Personal Information</h3>
          <p className="text-xs text-[#8C8A84] mt-0.5">
            Update your public member profile details across ClubFlow.
          </p>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#F5F2EA] uppercase tracking-wider mb-1.5 font-mono">
                Display Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-[#141416] border border-white/8 rounded-lg text-[#F5F2EA] placeholder:text-[#8C8A84] focus-ring"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#F5F2EA] uppercase tracking-wider mb-1.5 font-mono">
                Department / Major
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Computer Science"
                className="w-full px-3.5 py-2 text-xs bg-[#141416] border border-white/8 rounded-lg text-[#F5F2EA] placeholder:text-[#8C8A84] focus-ring"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#F5F2EA] uppercase tracking-wider mb-1.5 font-mono">
                Academic Year / Level
              </label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="e.g. 3rd Year"
                className="w-full px-3.5 py-2 text-xs bg-[#141416] border border-white/8 rounded-lg text-[#F5F2EA] placeholder:text-[#8C8A84] focus-ring"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#F5F2EA] uppercase tracking-wider mb-1.5 font-mono">
                Avatar Image URL (Optional)
              </label>
              <input
                type="url"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://..."
                className="w-full px-3.5 py-2 text-xs bg-[#141416] border border-white/8 rounded-lg text-[#F5F2EA] placeholder:text-[#8C8A84] focus-ring"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end border-t border-white/8">
            <Button type="submit" variant="primary" size="sm" isLoading={isUpdatingProfile}>
              Save Profile Changes
            </Button>
          </div>
        </form>
      </div>

      {/* Security & Password */}
      <div className="bg-[#0D0D0F] rounded-xl border border-white/8 p-6 shadow-subtle space-y-6">
        <div>
          <h3 className="text-sm font-bold text-[#F5F2EA]">Security Credentials</h3>
          <p className="text-xs text-[#8C8A84] mt-0.5">
            Update your authentication password to safeguard your account.
          </p>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#F5F2EA] uppercase tracking-wider mb-1.5 font-mono">
                Current Password
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2 text-xs bg-[#141416] border border-white/8 rounded-lg text-[#F5F2EA] placeholder:text-[#8C8A84] focus-ring"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#F5F2EA] uppercase tracking-wider mb-1.5 font-mono">
                New Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full px-3.5 py-2 text-xs bg-[#141416] border border-white/8 rounded-lg text-[#F5F2EA] placeholder:text-[#8C8A84] focus-ring"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#F5F2EA] uppercase tracking-wider mb-1.5 font-mono">
                Confirm Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                className="w-full px-3.5 py-2 text-xs bg-[#141416] border border-white/8 rounded-lg text-[#F5F2EA] placeholder:text-[#8C8A84] focus-ring"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end border-t border-white/8">
            <Button type="submit" variant="outline" size="sm" isLoading={isUpdatingPassword}>
              Update Password
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};
