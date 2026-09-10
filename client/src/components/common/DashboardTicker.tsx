import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

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
      <div className="flex items-center space-x-2.5 px-3 py-1 rounded-full bg-[#111114] hover:bg-[#16161A] border border-white/8 text-zinc-300 transition-all text-xs cursor-pointer group">
        <span className="w-1.5 h-1.5 rounded-full bg-[#FF6814] shrink-0 group-hover:scale-125 transition-transform shadow-glow-orange" />
        {item.category && (
          <span className="font-mono text-[10px] uppercase font-bold text-[#FFDD00]">
            {item.category}
          </span>
        )}
        <span className="font-medium text-[#F5F5F0] whitespace-nowrap">{item.label}</span>
        {item.link && (
          <ArrowRight className="w-3 h-3 text-zinc-500 group-hover:text-[#FF6814] group-hover:translate-x-0.5 transition-transform" />
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
      className={`marquee-container relative w-full overflow-hidden flex items-center py-1.5 border-y border-white/8 bg-[#050506]/80 ${className}`}
    >
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#030304] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#030304] to-transparent z-10 pointer-events-none" />

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
