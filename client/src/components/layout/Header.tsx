import React, { useState, useRef, useEffect } from 'react';
import { Menu, LogOut, User, Bell, Search, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { Avatar } from '../common/Avatar';

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
    <header className="h-16 bg-[#050506]/90 backdrop-blur-md border-b border-white/8 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-subtle">
      {/* Left: Mobile Menu & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-[#111114] transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 text-xs">
          <span className="font-mono text-zinc-500">workspace /</span>
          <span className="font-semibold text-[#F5F5F0] tracking-tight text-sm sm:text-base">
            {getPageTitle()}
          </span>
        </div>
      </div>

      {/* Right: Global Command Search & Profile */}
      <div className="flex items-center gap-3">
        {/* Command Palette Trigger Button */}
        <button
          onClick={onOpenCommandPalette}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#111114] hover:bg-[#16161A] border border-white/8 text-zinc-400 hover:text-zinc-200 transition-all text-xs group"
        >
          <Search className="w-3.5 h-3.5 text-zinc-500 group-hover:text-[#FF6814]" />
          <span className="font-medium text-zinc-400 group-hover:text-zinc-200">Quick search...</span>
          <kbd className="font-mono text-[10px] bg-[#0A0A0C] px-1.5 py-0.5 rounded border border-white/10 text-zinc-400 group-hover:text-[#FFDD00]">
            ⌘K
          </kbd>
        </button>

        {/* Notifications */}
        <button
          className="p-2 text-zinc-400 hover:text-white hover:bg-[#111114] rounded-lg transition-colors relative"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#FF6814] rounded-full ring-2 ring-[#050506]" />
        </button>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-[#111114] transition-all border border-transparent hover:border-white/8"
          >
            <Avatar name={user?.name} src={user?.avatar} size="sm" />
            <ChevronDown className="w-3 h-3 text-zinc-400 hidden sm:block" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-[#0A0A0C] rounded-lg shadow-dropdown border border-white/10 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-xs">
              <div className="px-4 py-2.5 border-b border-white/8">
                <p className="font-bold text-[#F5F5F0] truncate">{user?.name}</p>
                <p className="text-[11px] text-zinc-500 truncate mt-0.5">{user?.email}</p>
              </div>

              <Link
                to="/settings"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-zinc-300 hover:bg-[#16161A] hover:text-white transition-colors"
              >
                <User className="w-3.5 h-3.5 text-zinc-400" />
                Account Settings
              </Link>

              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-rose-400 hover:bg-rose-950/30 transition-colors border-t border-white/8 font-medium"
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
