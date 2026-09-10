import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

export interface CinematicFrameProps {
  frameNumber?: '01' | '02' | '03' | '04' | string;
  tag?: string;
  title?: string;
  subtitle?: string;
  imageSrc: string;
  aspectRatio?: 'video' | 'wide' | 'square' | 'portrait' | 'auto' | 'hero';
  className?: string;
  showTravellingLine?: boolean;
  slowPan?: boolean;
  onClick?: () => void;
  overlayContent?: React.ReactNode;
}

export const CinematicFrame: React.FC<CinematicFrameProps> = ({
  frameNumber,
  tag,
  title,
  subtitle,
  imageSrc,
  aspectRatio = 'video',
  className = '',
  showTravellingLine = true,
  slowPan = false,
  onClick,
  overlayContent,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const aspectClass = {
    video: 'aspect-video',
    wide: 'aspect-[21/9]',
    square: 'aspect-square',
    portrait: 'aspect-[4/5]',
    hero: 'aspect-[16/9] sm:aspect-[21/9]',
    auto: '',
  }[aspectRatio];

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative overflow-hidden rounded-lg border border-white/8 bg-[#0D0D0F] shadow-premium transition-all duration-500 hover:border-[#FF6A16]/40 hover:-translate-y-1 ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {/* Container with specified Aspect Ratio */}
      <div className={`relative w-full overflow-hidden ${aspectClass}`}>
        {/* Cinematic Image */}
        <img
          src={imageSrc}
          alt={title || tag || 'ClubFlow Cinematic Frame'}
          loading="lazy"
          className={`h-full w-full object-cover transition-transform duration-700 ease-out ${
            slowPan ? 'animate-slow-pan' : 'group-hover:scale-[1.03]'
          }`}
        />

        {/* Ambient Dark Vignette & Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/95 via-[#050505]/30 to-transparent opacity-85 group-hover:opacity-90 transition-opacity duration-500" />

        {/* Top Floating Technical Metadata Tag */}
        {(frameNumber || tag) && (
          <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#050505]/80 backdrop-blur-md border border-white/10 text-[10px] font-mono uppercase tracking-widest text-[#F5F2EA] font-semibold">
              {frameNumber && <span className="text-[#FF6A16] font-bold">{frameNumber}</span>}
              {frameNumber && tag && <span className="text-zinc-500">/</span>}
              {tag && <span>{tag}</span>}
            </span>
          </div>
        )}

        {/* Travelling Orange Light Line along top edge */}
        {showTravellingLine && (
          <div className="absolute top-0 left-0 right-0 h-[1.5px] overflow-hidden z-20 pointer-events-none">
            <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-[#FF6A16] to-transparent animate-travel-line opacity-75" />
          </div>
        )}

        {/* Custom Overlay Content if provided */}
        {overlayContent && (
          <div className="absolute inset-0 z-20 p-5 flex flex-col justify-end">
            {overlayContent}
          </div>
        )}

        {/* Default Title & Subtitle Caption */}
        {!overlayContent && (title || subtitle) && (
          <div className="absolute bottom-0 left-0 right-0 p-5 z-20 flex items-end justify-between gap-4">
            <div className="min-w-0">
              {title && (
                <h3 className="text-sm sm:text-base font-bold text-[#F5F2EA] tracking-tight group-hover:text-[#FF6A16] transition-colors line-clamp-1">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs text-[#8C8A84] mt-0.5 line-clamp-1 font-normal">
                  {subtitle}
                </p>
              )}
            </div>

            {onClick && (
              <div className="w-7 h-7 rounded-full bg-[#141416]/90 border border-white/10 text-[#F5F2EA] flex items-center justify-center shrink-0 group-hover:bg-[#FF6A16] group-hover:text-black group-hover:border-[#FF6A16] transition-all">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
