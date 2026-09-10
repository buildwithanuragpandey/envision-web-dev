import React, { useState, useRef, useEffect } from 'react';
import { Menu, LogOut, User, Bell, Search, ChevronDown, Command } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';

interface HeaderProps {
  onToggleMobileMenu: () => void;
  onOpenCommandPalette: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu, onOpenCommandPalette }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format breadcrumb title
  const getPageTitle = () => {
    const p = location.pathname;
    if (p.includes('/admin/dashboard')) return 'Executive Dashboard';
    if (p.includes('/lead/dashboard')) return 'Project Lead Hub';
    if (p.includes('/member/dashboard')) return 'My Workspace';
    if (p.startsWith('/projects/') && p !== '/projects') return 'Project Overview';
    if (p.includes('/projects')) return 'Club Projects';
    if (p.includes('/tasks')) return 'Task Management';
    if (p.includes('/members')) return 'Club Directory';
    if (p.includes('/analytics')) return 'Analytics & Insights';
    if (p.includes('/settings')) return 'Account Settings';
    return 'ClubFlow';
  };

  return (
    <header className="h-16 bg-white/90 backdrop-blur-md border-b border-zinc-200/80 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-subtle">
      {/* Left: Mobile Menu & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-lg text-zinc-600 hover:bg-zinc-100 transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 text-xs">
          <span className="font-mono text-zinc-400">workspace /</span>
          <span className="font-bold text-zinc-900 tracking-tight text-sm sm:text-base">
            {getPageTitle()}
          </span>
        </div>
      </div>

      {/* Right: Global Command Search & Profile */}
      <div className="flex items-center gap-3">
        {/* Command Palette Trigger Button */}
        <button
          onClick={onOpenCommandPalette}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200/80 border border-zinc-200/80 text-zinc-600 transition-all text-xs group"
        >
          <Search className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-700" />
          <span className="font-medium text-zinc-600">Quick search...</span>
          <kbd className="font-mono text-[10px] bg-white px-1.5 py-0.5 rounded border border-zinc-200 text-zinc-400 group-hover:text-zinc-700 shadow-2xs">
            ⌘K
          </kbd>
        </button>

        {/* Notifications */}
        <button
          className="p-2 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 rounded-xl transition-colors relative"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-emerald-500 rounded-full ring-2 ring-white" />
        </button>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-zinc-100 transition-all border border-transparent hover:border-zinc-200"
          >
            <img
              src={
                user?.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user?.name || 'User'
                )}&background=18181b&color=fff`
              }
              alt={user?.name}
              className="w-7 h-7 rounded-lg object-cover ring-1 ring-zinc-200"
            />
            <ChevronDown className="w-3 h-3 text-zinc-400 hidden sm:block" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-dropdown border border-zinc-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-xs">
              <div className="px-4 py-2.5 border-b border-zinc-100">
                <p className="font-bold text-zinc-900 truncate">{user?.name}</p>
                <p className="text-[11px] text-zinc-500 truncate mt-0.5">{user?.email}</p>
              </div>

              <Link
                to="/settings"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
              >
                <User className="w-3.5 h-3.5 text-zinc-400" />
                Account Settings
              </Link>

              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-rose-600 hover:bg-rose-50 transition-colors border-t border-zinc-100 font-medium"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
