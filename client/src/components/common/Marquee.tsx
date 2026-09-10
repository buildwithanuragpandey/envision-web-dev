import React from 'react';

interface MarqueeProps {
  items: string[] | React.ReactNode[];
  reverse?: boolean;
  speed?: 'normal' | 'fast' | 'slow';
  separator?: string;
  className?: string;
  pauseOnHover?: boolean;
}

export const Marquee: React.FC<MarqueeProps> = ({
  items,
  reverse = false,
  speed = 'normal',
  separator = '•',
  className = '',
  pauseOnHover = true,
}) => {
  const animationClass = reverse
    ? 'animate-marquee-reverse'
    : speed === 'fast'
    ? 'animate-marquee-fast'
    : 'animate-marquee';

  const content = (
    <div className={`flex items-center shrink-0 space-x-6 ${animationClass}`}>
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center space-x-6">
          <span className="font-mono text-xs uppercase tracking-widest text-zinc-400 dark:text-zinc-500 font-medium whitespace-nowrap">
            {item}
          </span>
          <span className="text-zinc-300 dark:text-zinc-700 text-xs select-none">
            {separator}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div
      className={`marquee-container relative w-full overflow-hidden flex items-center py-2.5 ${className}`}
    >
      {/* Left/Right subtle fade gradients */}
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#fafafa] dark:from-[#090a0f] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#fafafa] dark:from-[#090a0f] to-transparent z-10 pointer-events-none" />

      {/* Repeating sets for seamless infinite loop */}
      {content}
      {content}
    </div>
  );
};
