import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  BarChart3,
  Settings,
  ShieldCheck,
  Layers,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { RoleBadge } from '../common/Badge';
import { motion } from 'framer-motion';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const { user, isAdmin, isProjectLead, isMember, logout } = useAuth();
  const location = useLocation();

  const getNavItems = () => {
    if (isAdmin) {
      return [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Projects', path: '/projects', icon: FolderKanban },
        { name: 'Tasks', path: '/tasks', icon: CheckSquare },
        { name: 'Directory', path: '/members', icon: Users },
        { name: 'Analytics', path: '/analytics', icon: BarChart3 },
        { name: 'Settings', path: '/settings', icon: Settings },
      ];
    }

    if (isProjectLead) {
      return [
        { name: 'Dashboard', path: '/lead/dashboard', icon: LayoutDashboard },
        { name: 'My Projects', path: '/projects', icon: FolderKanban },
        { name: 'Tasks', path: '/tasks', icon: CheckSquare },
        { name: 'Team Roster', path: '/members', icon: Users },
        { name: 'Settings', path: '/settings', icon: Settings },
      ];
    }

    // Member
    return [
      { name: 'Dashboard', path: '/member/dashboard', icon: LayoutDashboard },
      { name: 'My Projects', path: '/projects', icon: FolderKanban },
      { name: 'My Tasks', path: '/tasks', icon: CheckSquare },
      { name: 'Settings', path: '/settings', icon: Settings },
    ];
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 bg-zinc-950 text-zinc-300 flex flex-col h-full border-r border-zinc-900 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 justify-between border-b border-zinc-900 bg-zinc-950">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-white text-zinc-950 flex items-center justify-center font-bold text-xs shadow-sm">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight text-white flex items-center gap-1">
              Club<span className="text-zinc-400 font-normal">Flow</span>
            </span>
          </div>
        </div>

        <span className="text-[10px] font-mono uppercase bg-zinc-900 text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-800">
          PROD
        </span>
      </div>

      {/* Main Navigation with Framer Motion sliding active indicator */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-widest text-zinc-500">
          Platform
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              className={`relative flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                isActive ? 'text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebarActive"
                  className="absolute inset-0 bg-zinc-900 rounded-xl border border-zinc-800 shadow-sm"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <Icon className="w-4 h-4 shrink-0 relative z-10" />
              <span className="relative z-10">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Current User Bottom Section */}
      {user && (
        <div className="p-3 border-t border-zinc-900 bg-zinc-950/60">
          <div className="flex items-center justify-between p-2 rounded-xl hover:bg-zinc-900 transition-colors">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={
                  user.avatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=18181b&color=fff`
                }
                alt={user.name}
                className="w-8 h-8 rounded-lg object-cover ring-1 ring-zinc-800 shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate leading-tight">{user.name}</p>
                <div className="mt-0.5">
                  <RoleBadge role={user.role} size="sm" />
                </div>
              </div>
            </div>

            <button
              onClick={() => logout()}
              className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};
