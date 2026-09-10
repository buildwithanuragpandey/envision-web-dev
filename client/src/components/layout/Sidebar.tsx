import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { RoleBadge } from '../common/Badge';
import { Avatar } from '../common/Avatar';
import { motion } from 'framer-motion';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const { user, isAdmin, isProjectLead, logout } = useAuth();
  const location = useLocation();

  const workspaceNav = [
    { name: 'Dashboard', path: isAdmin ? '/admin/dashboard' : isProjectLead ? '/lead/dashboard' : '/member/dashboard', icon: LayoutDashboard },
    { name: 'Projects', path: '/projects', icon: FolderKanban },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare },
  ];

  const managementNav = isAdmin
    ? [
        { name: 'Members', path: '/members', icon: Users },
        { name: 'Analytics', path: '/analytics', icon: BarChart3 },
      ]
    : isProjectLead
    ? [{ name: 'Team Roster', path: '/members', icon: Users }]
    : [];

  const systemNav = [
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const renderNavGroup = (title: string, items: typeof workspaceNav) => {
    if (items.length === 0) return null;
    return (
      <div className="space-y-1">
        <div className="px-3 pb-1.5 pt-3 text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-semibold">
          {title}
        </div>
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(`${item.path}/`));

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
              <span className="relative z-10 truncate">{item.name}</span>
            </NavLink>
          );
        })}
      </div>
    );
  };

  return (
    <aside className="w-64 bg-zinc-950 text-zinc-300 flex flex-col h-full border-r border-zinc-900 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-5 justify-between border-b border-zinc-900 bg-zinc-950">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white text-zinc-950 flex items-center justify-center font-bold text-xs shadow-sm shrink-0">
            <Layers className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="font-bold text-sm tracking-tight text-white flex items-center gap-1 leading-tight">
              Club<span className="text-zinc-400 font-normal">Flow</span>
            </div>
            <div className="text-[10px] text-zinc-500 truncate leading-tight mt-0.5">
              Club Operations Workspace
            </div>
          </div>
        </div>

        <span className="text-[9px] font-mono uppercase bg-zinc-900 text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-800">
          TECH CLUB
        </span>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-3 space-y-3 overflow-y-auto">
        {renderNavGroup('WORKSPACE', workspaceNav)}
        {renderNavGroup('MANAGEMENT', managementNav)}
        {renderNavGroup('SYSTEM', systemNav)}
      </nav>

      {/* Current User Bottom Section */}
      {user && (
        <div className="p-3 border-t border-zinc-900 bg-zinc-950/80">
          <div className="flex items-center justify-between p-2 rounded-xl hover:bg-zinc-900 transition-colors">
            <div className="flex items-center gap-2.5 min-w-0">
              <Avatar name={user.name} src={user.avatar} size="sm" className="shrink-0" />
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
