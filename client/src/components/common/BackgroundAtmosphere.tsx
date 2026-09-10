import React, { useRef, useEffect, useState } from 'react';

interface BackgroundAtmosphereProps {
  variant?: 'login' | 'hero' | 'subtle' | 'minimal';
  className?: string;
  showAmbientMesh?: boolean;
}

export const BackgroundAtmosphere: React.FC<BackgroundAtmosphereProps> = ({
  variant = 'subtle',
  className = '',
  showAmbientMesh = true,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches && videoRef.current) {
      videoRef.current.pause();
    }
  }, []);

  const opacityClass = {
    login: 'opacity-35',
    hero: 'opacity-18',
    subtle: 'opacity-10',
    minimal: 'opacity-6',
  }[variant];

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden select-none z-0 ${className}`}>
      {/* Video layer */}
      {!videoError && (
        <video
          ref={videoRef}
          src="/clubflow_orange_yellow_background.mp4"
          autoPlay
          muted
          loop
          playsInline
          onError={() => setVideoError(true)}
          className={`w-full h-full object-cover transition-opacity duration-1000 ${opacityClass}`}
        />
      )}

      {/* Atmospheric Ambient Glow Orbs (Orange #FF6814 & Yellow #FFDD00) */}
      {showAmbientMesh && (
        <>
          <div className="absolute -top-32 left-1/4 w-[600px] h-[450px] bg-[#FF6814]/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute top-1/3 -right-20 w-[500px] h-[380px] bg-[#FFDD00]/6 rounded-full blur-[130px] pointer-events-none" />
          <div className="absolute -bottom-20 left-10 w-[550px] h-[400px] bg-[#FF6814]/8 rounded-full blur-[140px] pointer-events-none" />
        </>
      )}

      {/* Dark overlay ensuring 100% UI contrast & readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030304]/60 via-[#030304]/85 to-[#030304]" />
    </div>
  );
};
