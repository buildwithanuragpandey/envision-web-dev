import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Maximize2, Volume2, VolumeX } from 'lucide-react';

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
      className={`group relative overflow-hidden rounded-xl border border-zinc-200/80 bg-zinc-950 text-white shadow-subtle hover:border-zinc-300 transition-all cursor-pointer ${className}`}
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
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-black/20 opacity-80 group-hover:opacity-90 transition-opacity" />

            <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={toggleMute}
                className="p-1.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 backdrop-blur-sm border border-zinc-700/60 transition-colors"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <button
                type="button"
                onClick={togglePlay}
                className={`pointer-events-auto p-3.5 rounded-full bg-white/90 hover:bg-white text-zinc-950 shadow-xl backdrop-blur-md transition-all duration-200 transform ${
                  isPlaying ? 'opacity-0 group-hover:opacity-80 scale-90' : 'opacity-100 scale-100'
                }`}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
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
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent opacity-70 group-hover:opacity-85 transition-opacity" />
          </>
        )}

        {/* Content Caption Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
          {category && (
            <span className="inline-block text-[10px] font-mono uppercase font-semibold tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-md mb-1.5 backdrop-blur-sm">
              {category}
            </span>
          )}
          <h4 className="text-sm font-bold text-white tracking-tight leading-snug line-clamp-1">
            {title}
          </h4>
          {description && (
            <p className="text-xs text-zinc-300 line-clamp-1 mt-0.5 font-normal">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
