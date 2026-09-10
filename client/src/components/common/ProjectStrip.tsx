import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

export interface ProjectStripItem {
  id: string;
  name: string;
  category?: string;
  progress?: number;
}

const defaultProjects: ProjectStripItem[] = [
  { id: '1', name: 'HACKATHON 2026', category: 'EVENT', progress: 82 },
  { id: '2', name: 'CLUB WEBSITE REDESIGN', category: 'WEB', progress: 67 },
  { id: '3', name: 'AI/ML WORKSHOP', category: 'BOOTCAMP', progress: 45 },
  { id: '4', name: 'OPEN SOURCE SPRINT', category: 'TOOLCHAIN', progress: 90 },
  { id: '5', name: 'TECHNICAL FEST EXPO', category: 'KEYNOTE', progress: 30 },
  { id: '6', name: 'PORTFOLIO WORKSHOP', category: 'COMMUNITY', progress: 100 },
];

interface ProjectStripProps {
  items?: ProjectStripItem[];
  className?: string;
}

export const ProjectStrip: React.FC<ProjectStripProps> = ({
  items = defaultProjects,
  className = '',
}) => {
  const renderItem = (item: ProjectStripItem, idx: number) => (
    <Link
      key={`${item.id}-${idx}`}
      to={`/projects`}
      className="inline-flex items-center gap-2.5 px-4 py-2 rounded-lg bg-[#0D0D0F] hover:bg-[#141416] border border-white/8 hover:border-[#FF6A16]/50 text-[#F5F2EA] transition-all group shrink-0"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A16] group-hover:scale-125 transition-transform" />
      {item.category && (
        <span className="font-mono text-[9px] uppercase font-bold text-[#FFD400]">
          {item.category}
        </span>
      )}
      <span className="text-xs font-bold tracking-tight text-[#F5F2EA] whitespace-nowrap">
        {item.name}
      </span>
      {item.progress !== undefined && (
        <span className="font-mono text-[10px] text-zinc-400">
          {item.progress}%
        </span>
      )}
      <ArrowRight className="w-3 h-3 text-zinc-500 group-hover:text-[#FF6A16] group-hover:translate-x-0.5 transition-all" />
    </Link>
  );

  return (
    <div
      className={`marquee-container relative w-full overflow-hidden flex items-center py-2 border-y border-white/8 bg-[#050505] ${className}`}
    >
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none" />

      {/* Repeating tracks */}
      <div className="flex items-center shrink-0 space-x-3 animate-marquee pl-3">
        {items.map((item, idx) => renderItem(item, idx))}
      </div>
      <div className="flex items-center shrink-0 space-x-3 animate-marquee pl-3" aria-hidden="true">
        {items.map((item, idx) => renderItem(item, idx))}
      </div>
    </div>
  );
};
