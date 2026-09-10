import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  BarChart3,
  Settings,
  ShieldAlert,
  Layers,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { RoleBadge } from '../common/Badge';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const { user, isAdmin, isProjectLead, isMember } = useAuth();

  const getNavItems = () => {
    if (isAdmin) {
      return [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Projects', path: '/projects', icon: FolderKanban },
        { name: 'Tasks', path: '/tasks', icon: CheckSquare },
        { name: 'Members', path: '/members', icon: Users },
        { name: 'Analytics', path: '/analytics', icon: BarChart3 },
        { name: 'Settings', path: '/settings', icon: Settings },
      ];
    }

    if (isProjectLead) {
      return [
        { name: 'Dashboard', path: '/lead/dashboard', icon: LayoutDashboard },
        { name: 'My Projects', path: '/projects', icon: FolderKanban },
        { name: 'Tasks', path: '/tasks', icon: CheckSquare },
        { name: 'Team', path: '/members', icon: Users },
        { name: 'Settings', path: '/settings', icon: Settings },
      ];
    }

    // Default Member
    return [
      { name: 'Dashboard', path: '/member/dashboard', icon: LayoutDashboard },
      { name: 'My Projects', path: '/projects', icon: FolderKanban },
      { name: 'My Tasks', path: '/tasks', icon: CheckSquare },
      { name: 'Settings', path: '/settings', icon: Settings },
    ];
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-full border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 gap-3 border-b border-slate-800/80 bg-slate-950/40">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
          <Layers className="w-5 h-5 font-bold" />
        </div>
        <div>
          <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
            Club<span className="text-brand-400">Flow</span>
          </span>
          <span className="text-[10px] text-slate-400 font-medium block uppercase tracking-wider">
            SaaS Platform
          </span>
        </div>
      </div>

      {/* Current User Pill */}
      {user && (
        <div className="p-4 mx-3 my-3 bg-slate-850 rounded-xl border border-slate-800">
          <div className="flex items-center gap-3">
            <img
              src={
                user.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=10b981&color=fff`
              }
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover border border-slate-700"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white truncate">{user.name}</p>
              <div className="mt-0.5">
                <RoleBadge role={user.role} size="sm" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20 font-semibold shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Role Scoped Indicator Footer */}
      <div className="p-4 border-t border-slate-800 text-xs text-slate-400 bg-slate-950/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-brand-400" />
          <span>RBAC Enforcement</span>
        </div>
        <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
          v1.0.0
        </span>
      </div>
    </aside>
  );
};
