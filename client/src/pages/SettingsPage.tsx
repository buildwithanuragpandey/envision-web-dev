import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/client';
import { Button } from '../components/common/Button';
import { RoleBadge } from '../components/common/Badge';
import { User, Lock, ShieldCheck, Mail, Building, KeyRound, Sparkles } from 'lucide-react';
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
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-subtle">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Account & Security</h2>
        <p className="text-xs text-slate-500 mt-1">
          Manage your personal details, role credentials, and account settings.
        </p>
      </div>

      {/* Account Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-6 space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <img
            src={
              avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                name || 'User'
              )}&background=10b981&color=fff`
            }
            alt={name}
            className="w-16 h-16 rounded-2xl object-cover ring-4 ring-slate-100"
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">{user?.name}</h3>
              <RoleBadge role={user?.role || 'MEMBER'} size="sm" />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
            <p className="text-[11px] text-brand-600 font-medium mt-1">
              Active Member of ClubFlow
            </p>
          </div>
        </div>

        {/* Profile Update Form */}
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Personal Information
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Display Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Department
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Computer Science"
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Year / Level
              </label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="e.g. Junior (3rd Year)"
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Avatar URL
              </label>
              <input
                type="url"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://..."
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button type="submit" variant="primary" size="md" isLoading={isUpdatingProfile}>
              Save Profile Details
            </Button>
          </div>
        </form>
      </div>

      {/* Password Update Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-6">
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <KeyRound className="w-5 h-5 text-brand-600" />
            <h4 className="text-sm font-bold text-slate-900">Change Password</h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Current Password
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                New Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button type="submit" variant="secondary" size="md" isLoading={isUpdatingPassword}>
              Update Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
