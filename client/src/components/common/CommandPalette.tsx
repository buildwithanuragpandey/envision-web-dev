import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { projectApi, taskApi, userApi } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import {
  Search,
  FolderKanban,
  CheckSquare,
  Users,
  Settings,
  LayoutDashboard,
  BarChart3,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { role, isAdmin } = useAuth();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch quick search datasets
  const { data: projects } = useQuery({
    queryKey: ['cmd-projects'],
    queryFn: async () => {
      const res = await projectApi.getProjects();
      return res.data || [];
    },
    enabled: isOpen,
  });

  const { data: tasks } = useQuery({
    queryKey: ['cmd-tasks'],
    queryFn: async () => {
      const res = await taskApi.getTasks();
      return res.data || [];
    },
    enabled: isOpen,
  });

  const { data: users } = useQuery({
    queryKey: ['cmd-users'],
    queryFn: async () => {
      const res = await userApi.getUsers();
      return res.data || [];
    },
    enabled: isOpen,
  });

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Static navigation actions based on role
  const getNavActions = () => {
    const actions = [];
    if (role === 'ADMIN') actions.push({ label: 'Go to Admin Dashboard', path: '/admin/dashboard', icon: LayoutDashboard });
    else if (role === 'PROJECT_LEAD') actions.push({ label: 'Go to Lead Dashboard', path: '/lead/dashboard', icon: LayoutDashboard });
    else actions.push({ label: 'Go to Member Workspace', path: '/member/dashboard', icon: LayoutDashboard });

    actions.push(
      { label: 'View All Projects', path: '/projects', icon: FolderKanban },
      { label: 'Task Center & Kanban Board', path: '/tasks', icon: CheckSquare },
      { label: 'Club Member Directory', path: '/members', icon: Users }
    );

    if (isAdmin || role === 'PROJECT_LEAD') {
      actions.push({ label: 'Analytics & Performance', path: '/analytics', icon: BarChart3 });
    }

    actions.push({ label: 'Account & Security Settings', path: '/settings', icon: Settings });
    return actions;
  };

  const navActions = getNavActions();

  // Filter items
  const cleanQ = query.trim().toLowerCase();

  const filteredNav = navActions.filter((a) => a.label.toLowerCase().includes(cleanQ));
  const filteredProjects = (projects || [])
    .filter((p) => p.name.toLowerCase().includes(cleanQ) || (p.description && p.description.toLowerCase().includes(cleanQ)))
    .slice(0, 4);
  const filteredTasks = (tasks || [])
    .filter((t) => t.title.toLowerCase().includes(cleanQ) || (t.description && t.description.toLowerCase().includes(cleanQ)))
    .slice(0, 4);
  const filteredUsers = (users || [])
    .filter((u) => u.name.toLowerCase().includes(cleanQ) || u.email.toLowerCase().includes(cleanQ))
    .slice(0, 4);

  // Flattened results for arrow navigation
  const allResults: Array<{ id: string; title: string; category: string; icon: any; action: () => void }> = [
    ...filteredNav.map((n) => ({
      id: `nav-${n.path}`,
      title: n.label,
      category: 'Navigation',
      icon: n.icon,
      action: () => {
        navigate(n.path);
        onClose();
      },
    })),
    ...filteredProjects.map((p) => ({
      id: `proj-${p.id}`,
      title: p.name,
      category: 'Projects',
      icon: FolderKanban,
      action: () => {
        navigate(`/projects/${p.id}`);
        onClose();
      },
    })),
    ...filteredTasks.map((t) => ({
      id: `task-${t.id}`,
      title: t.title,
      category: 'Tasks',
      icon: CheckSquare,
      action: () => {
        navigate('/tasks');
        onClose();
      },
    })),
    ...filteredUsers.map((u) => ({
      id: `user-${u.id}`,
      title: `${u.name} (${u.role})`,
      category: 'Members',
      icon: Users,
      action: () => {
        navigate('/members');
        onClose();
      },
    })),
  ];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, allResults.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + allResults.length) % Math.max(1, allResults.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (allResults[selectedIndex]) {
        allResults[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
          />

          {/* Modal Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="relative w-full max-w-xl bg-[#0A0A0C] rounded-lg shadow-dropdown border border-white/10 overflow-hidden z-10 text-[#F5F5F0]"
            onKeyDown={handleKeyDown}
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-4 py-3.5 border-b border-white/8 bg-[#050506]">
              <Search className="w-4 h-4 text-[#FF6814] shrink-0 mr-3" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder="Search projects, tasks, members, or navigate..."
                className="w-full bg-transparent text-sm text-[#F5F5F0] placeholder:text-zinc-500 focus:outline-none"
              />
              <span className="text-[10px] font-mono text-zinc-400 bg-[#111114] px-1.5 py-0.5 rounded border border-white/10 select-none">
                ESC
              </span>
            </div>

            {/* Results List */}
            <div className="max-h-80 overflow-y-auto p-2 space-y-1 text-xs">
              {allResults.length === 0 ? (
                <div className="py-8 text-center text-zinc-500 text-xs">
                  No matching results found for "{query}"
                </div>
              ) : (
                allResults.map((item, index) => {
                  const Icon = item.icon;
                  const isSelected = selectedIndex === index;

                  return (
                    <div
                      key={item.id}
                      onClick={item.action}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#16161A] text-[#F5F5F0] border border-[#FF6814]/40 shadow-glow-orange'
                          : 'text-zinc-300 hover:bg-[#111114] border border-transparent'
                      }`}
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            isSelected ? 'text-[#FF6814]' : 'text-zinc-500'
                          }`}
                        />
                        <span className="font-medium truncate">{item.title}</span>
                      </div>

                      <span
                        className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded ${
                          isSelected
                            ? 'bg-[#111114] text-[#FFDD00] border border-white/10'
                            : 'bg-[#111114] text-zinc-500'
                        }`}
                      >
                        {item.category}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Navigation Hints */}
            <div className="px-4 py-2 bg-[#050506] border-t border-white/8 flex items-center justify-between text-[11px] text-zinc-500">
              <div className="flex items-center space-x-3">
                <span>
                  <kbd className="font-mono bg-[#111114] text-zinc-300 px-1 rounded text-[10px] border border-white/5">
                    ↑
                  </kbd>{' '}
                  <kbd className="font-mono bg-[#111114] text-zinc-300 px-1 rounded text-[10px] border border-white/5">
                    ↓
                  </kbd>{' '}
                  Navigate
                </span>
                <span>
                  <kbd className="font-mono bg-[#111114] text-zinc-300 px-1 rounded text-[10px] border border-white/5">
                    ↵
                  </kbd>{' '}
                  Select
                </span>
              </div>
              <span className="font-mono text-[10px] text-zinc-500">ClubFlow OS</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
