import React, { useState } from 'react';

interface AvatarProps {
  name?: string;
  src?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showTooltip?: boolean;
}

const colorPalette = [
  { bg: 'bg-zinc-800 text-zinc-100 border-zinc-700' },
  { bg: 'bg-slate-800 text-slate-100 border-slate-700' },
  { bg: 'bg-emerald-900/80 text-emerald-200 border-emerald-800/80' },
  { bg: 'bg-blue-900/80 text-blue-200 border-blue-800/80' },
  { bg: 'bg-indigo-900/80 text-indigo-200 border-indigo-800/80' },
  { bg: 'bg-teal-900/80 text-teal-200 border-teal-800/80' },
  { bg: 'bg-neutral-800 text-neutral-100 border-neutral-700' },
];

export const getInitials = (name?: string): string => {
  if (!name || !name.trim()) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const getColorClass = (name?: string) => {
  if (!name) return colorPalette[0].bg;
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colorPalette.length;
  return colorPalette[index].bg;
};

const sizeClasses = {
  xs: 'w-5 h-5 text-[9px] rounded-md font-medium border',
  sm: 'w-7 h-7 text-[11px] rounded-lg font-semibold border',
  md: 'w-8 h-8 text-xs rounded-lg font-semibold border',
  lg: 'w-11 h-11 text-sm rounded-xl font-bold border',
  xl: 'w-16 h-16 text-lg rounded-2xl font-bold border',
};

export const Avatar: React.FC<AvatarProps> = ({
  name = 'User',
  src,
  size = 'md',
  className = '',
  showTooltip = false,
}) => {
  const [imageError, setImageError] = useState(false);
  const initials = getInitials(name);
  const colorClass = getColorClass(name);

  // If user provided a valid image and it has not errored, show the image
  if (src && !imageError && src.startsWith('http')) {
    return (
      <img
        src={src}
        alt={name}
        onError={() => setImageError(true)}
        title={showTooltip ? name : undefined}
        className={`${sizeClasses[size]} object-cover ${className}`}
      />
    );
  }

  // Otherwise, render clean Linear-grade initials avatar
  return (
    <div
      title={showTooltip ? name : undefined}
      className={`inline-flex items-center justify-center select-none font-mono tracking-wider ${sizeClasses[size]} ${colorClass} ${className}`}
    >
      {initials}
    </div>
  );
};
