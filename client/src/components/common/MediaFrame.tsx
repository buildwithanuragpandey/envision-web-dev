import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface MediaFrameProps {
  type?: 'video' | 'image';
  src: string;
  poster?: string;
  title: string;
  category?: string;
  description?: string;
  aspectRatio?: 'video' | 'wide' | 'square' | 'auto';
  autoPlayMuted?: boolean;
  className?: string;
  onClick?: () => void;
}

export const MediaFrame: React.FC<MediaFrameProps> = ({
  type = 'video',
  src,
  poster,
  title,
  category,
  description,
  aspectRatio = 'video',
  autoPlayMuted = false,
  className = '',
  onClick,
}) => {
  const [isPlaying, setIsPlaying] = useState(autoPlayMuted);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Pause video when scrolled out of viewport
  useEffect(() => {
    if (type !== 'video' || !containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting && videoRef.current && !videoRef.current.paused) {
            videoRef.current.pause();
            setIsPlaying(false);
          } else if (entry.isIntersecting && autoPlayMuted && videoRef.current && videoRef.current.paused) {
            videoRef.current.play().catch(() => {});
            setIsPlaying(true);
          }
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [type, autoPlayMuted]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const aspectClass = {
    video: 'aspect-video',
    wide: 'aspect-[21/9]',
    square: 'aspect-square',
    auto: '',
  }[aspectRatio];

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      className={`group relative overflow-hidden rounded-lg border border-white/8 bg-[#0A0A0C] text-[#F5F5F0] shadow-subtle hover:border-[#FF6814]/40 transition-all cursor-pointer ${className}`}
    >
      <div className={`relative w-full overflow-hidden ${aspectClass}`}>
        {type === 'video' ? (
          <>
            <video
              ref={videoRef}
              src={src}
              poster={poster}
              muted={isMuted}
              loop
              playsInline
              onLoadedData={() => setIsLoaded(true)}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />

            {/* Custom Overlay Controls */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#030304]/90 via-[#030304]/20 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

            <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={toggleMute}
                className="p-1.5 rounded-md bg-[#0A0A0C]/80 hover:bg-[#16161A] text-zinc-300 backdrop-blur-sm border border-white/10 transition-colors"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <button
                type="button"
                onClick={togglePlay}
                className={`pointer-events-auto p-3.5 rounded-full bg-[#FF6814] hover:bg-[#ff7d33] text-black shadow-glow-orange backdrop-blur-md transition-all duration-200 transform ${
                  isPlaying ? 'opacity-0 group-hover:opacity-80 scale-90' : 'opacity-100 scale-100'
                }`}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5 fill-black" />}
              </button>
            </div>
          </>
        ) : (
          <>
            <img
              src={src}
              alt={title}
              loading="lazy"
              onLoad={() => setIsLoaded(true)}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#030304]/90 via-[#030304]/20 to-transparent opacity-75 group-hover:opacity-90 transition-opacity" />
          </>
        )}

        {/* Content Caption Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
          {category && (
            <span className="inline-block text-[10px] font-mono uppercase font-semibold tracking-wider text-[#FFDD00] bg-[#111114] border border-white/10 px-2 py-0.5 rounded mb-1.5 backdrop-blur-sm">
              {category}
            </span>
          )}
          <h4 className="text-sm font-semibold text-[#F5F5F0] tracking-tight leading-snug line-clamp-1">
            {title}
          </h4>
          {description && (
            <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5 font-normal">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
