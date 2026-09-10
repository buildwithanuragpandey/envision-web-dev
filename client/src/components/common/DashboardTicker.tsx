import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

export interface TickerItem {
  id: string;
  label: string;
  category?: string;
  link?: string;
  timestamp?: string;
}

interface DashboardTickerProps {
  items: TickerItem[];
  className?: string;
}

export const DashboardTicker: React.FC<DashboardTickerProps> = ({ items, className = '' }) => {
  if (!items || items.length === 0) return null;

  const renderItem = (item: TickerItem, idx: number) => {
    const Inner = (
      <div className="flex items-center space-x-2.5 px-3 py-1 rounded-full bg-zinc-100/80 hover:bg-zinc-200/80 border border-zinc-200/60 text-zinc-700 transition-all text-xs cursor-pointer group">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 group-hover:scale-125 transition-transform" />
        {item.category && (
          <span className="font-mono text-[10px] uppercase font-bold text-zinc-400">
            {item.category}
          </span>
        )}
        <span className="font-medium text-zinc-800 whitespace-nowrap">{item.label}</span>
        {item.link && (
          <ArrowRight className="w-3 h-3 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
        )}
      </div>
    );

    if (item.link) {
      return (
        <Link key={`${item.id}-${idx}`} to={item.link}>
          {Inner}
        </Link>
      );
    }

    return <div key={`${item.id}-${idx}`}>{Inner}</div>;
  };

  return (
    <div
      className={`marquee-container relative w-full overflow-hidden flex items-center py-1.5 border-y border-zinc-200/60 bg-zinc-50/50 ${className}`}
    >
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-zinc-50 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-zinc-50 to-transparent z-10 pointer-events-none" />

      {/* Repeating tracks */}
      <div className="flex items-center shrink-0 space-x-4 animate-marquee pl-4">
        {items.map((item, idx) => renderItem(item, idx))}
      </div>
      <div className="flex items-center shrink-0 space-x-4 animate-marquee pl-4" aria-hidden="true">
        {items.map((item, idx) => renderItem(item, idx))}
      </div>
    </div>
  );
};
