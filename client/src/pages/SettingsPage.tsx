import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/client';
import { Button } from '../components/common/Button';
import { RoleBadge } from '../components/common/Badge';
import { User, Lock, ShieldCheck, Mail, Building, KeyRound, Sparkles, CheckCircle2 } from 'lucide-react';
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
      className="space-y-8 max-w-4xl"
    >
      {/* Editorial Header */}
      <div className="border-b border-border pb-5">
        <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Account & Security</h1>
        <p className="text-sm text-surface-500 mt-1">
          Manage your personal information, role credentials, and access configuration.
        </p>
      </div>

      {/* Profile Overview Banner */}
      <div className="bg-surface-0 rounded-xl border border-border p-6 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={
              avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                name || 'User'
              )}&background=10b981&color=fff`
            }
            alt={name}
            className="w-16 h-16 rounded-xl object-cover ring-2 ring-surface-100 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-base font-bold text-surface-900">{user?.name}</h2>
              <RoleBadge role={user?.role || 'MEMBER'} size="sm" />
            </div>
            <p className="text-xs text-surface-500 font-mono mt-0.5">{user?.email}</p>
            <div className="flex items-center gap-2 mt-2 text-xs text-surface-600">
              <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified Club Member
              </span>
              <span>•</span>
              <span>{user?.department || 'Department Unset'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Info Form */}
      <div className="bg-surface-0 rounded-xl border border-border p-6 shadow-subtle space-y-6">
        <div>
          <h3 className="text-base font-semibold text-surface-900">Personal Information</h3>
          <p className="text-xs text-surface-500 mt-0.5">
            Update your public member profile details across ClubFlow.
          </p>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-surface-700 uppercase tracking-wider mb-1.5">
                Display Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-surface-50/50 border border-border rounded-lg text-surface-900 focus:bg-surface-0 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-surface-700 uppercase tracking-wider mb-1.5">
                Department / Major
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Computer Science"
                className="w-full px-3.5 py-2 text-sm bg-surface-50/50 border border-border rounded-lg text-surface-900 focus:bg-surface-0 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-surface-700 uppercase tracking-wider mb-1.5">
                Academic Year / Level
              </label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="e.g. Junior (3rd Year)"
                className="w-full px-3.5 py-2 text-sm bg-surface-50/50 border border-border rounded-lg text-surface-900 focus:bg-surface-0 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-surface-700 uppercase tracking-wider mb-1.5">
                Avatar Image URL
              </label>
              <input
                type="url"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3.5 py-2 text-sm bg-surface-50/50 border border-border rounded-lg text-surface-900 focus:bg-surface-0 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end border-t border-border">
            <Button type="submit" variant="primary" size="md" isLoading={isUpdatingProfile}>
              Save Changes
            </Button>
          </div>
        </form>
      </div>

      {/* Security & Password */}
      <div className="bg-surface-0 rounded-xl border border-border p-6 shadow-subtle space-y-6">
        <div>
          <h3 className="text-base font-semibold text-surface-900">Security Credentials</h3>
          <p className="text-xs text-surface-500 mt-0.5">
            Update your authentication password to safeguard your account.
          </p>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-surface-700 uppercase tracking-wider mb-1.5">
                Current Password
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2 text-sm bg-surface-50/50 border border-border rounded-lg text-surface-900 focus:bg-surface-0 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-surface-700 uppercase tracking-wider mb-1.5">
                New Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full px-3.5 py-2 text-sm bg-surface-50/50 border border-border rounded-lg text-surface-900 focus:bg-surface-0 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-surface-700 uppercase tracking-wider mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                className="w-full px-3.5 py-2 text-sm bg-surface-50/50 border border-border rounded-lg text-surface-900 focus:bg-surface-0 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end border-t border-border">
            <Button type="submit" variant="secondary" size="md" isLoading={isUpdatingPassword}>
              Update Password
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};
