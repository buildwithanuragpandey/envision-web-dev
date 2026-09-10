import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface CarouselSlide {
  id: string;
  frameNumber: string;
  category: string;
  title: string;
  subtitle: string;
  imageSrc: string;
  link: string;
  metricLabel: string;
  metricValue: string;
}

export const defaultCarouselSlides: CarouselSlide[] = [
  {
    id: 'events',
    frameNumber: '01',
    category: 'CLUB EVENTS',
    title: 'HackFest 2026 – Hackathon Sprint',
    subtitle: '36-hour technical marathon with live mentor channels and code judging.',
    imageSrc: '/frames/01_lobby.jpg',
    link: '/projects',
    metricLabel: 'VELOCITY',
    metricValue: '82%',
  },
  {
    id: 'projects',
    frameNumber: '02',
    category: 'CORE INITIATIVES',
    title: 'Club Website & Operational Systems',
    subtitle: 'Production infrastructure, role permissions, and student workspace redesign.',
    imageSrc: '/frames/02_corridor.jpg',
    link: '/projects',
    metricLabel: 'TASKS',
    metricValue: '18 / 24 Done',
  },
  {
    id: 'workshops',
    frameNumber: '03',
    category: 'TECHNICAL LABS',
    title: 'Web Dev & Cloud Architecture Lab',
    subtitle: 'Hands-on full-stack development, modern deployment pipelines, and APIs.',
    imageSrc: '/frames/03_workspace.jpg',
    link: '/projects',
    metricLabel: 'SQUAD',
    metricValue: '12 Students',
  },
  {
    id: 'innovation',
    frameNumber: '04',
    category: 'INNOVATION HUB',
    title: 'Open Source Intelligence & Tools',
    subtitle: 'Collaborative student utility toolchains and open-source contribution sprints.',
    imageSrc: '/frames/04_halo.jpg',
    link: '/projects',
    metricLabel: 'COMMUNITY',
    metricValue: 'Live Sync',
  },
];

interface CinematicCarouselProps {
  slides?: CarouselSlide[];
  autoPlayIntervalMs?: number;
}

export const CinematicCarousel: React.FC<CinematicCarouselProps> = ({
  slides = defaultCarouselSlides,
  autoPlayIntervalMs = 6000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, autoPlayIntervalMs);
    return () => clearInterval(interval);
  }, [isPaused, slides.length, autoPlayIntervalMs]);

  const currentSlide = slides[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative overflow-hidden rounded-lg border border-white/8 bg-[#0D0D0F] shadow-premium select-none group"
    >
      <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            {/* Background Image */}
            <img
              src={currentSlide.imageSrc}
              alt={currentSlide.title}
              className="w-full h-full object-cover"
            />

            {/* Dark Editorial Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/95 via-[#050505]/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/30" />

            {/* Content Layer */}
            <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between z-10">
              {/* Top Bar Metadata */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-[#050505]/80 backdrop-blur-md border border-white/10 text-[10px] font-mono uppercase tracking-widest text-[#F5F2EA] font-semibold flex items-center gap-1.5">
                    <span className="text-[#FF6A16] font-bold">{currentSlide.frameNumber}</span>
                    <span className="text-zinc-500">/</span>
                    <span>{currentSlide.category}</span>
                  </span>

                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#141416]/80 backdrop-blur-md text-[10px] font-mono text-[#FFD400] border border-white/5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFD400] animate-pulse" />
                    {currentSlide.metricLabel}: {currentSlide.metricValue}
                  </span>
                </div>

                {/* Progress Indicator Dots */}
                <div className="flex items-center gap-1.5 bg-[#050505]/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                  {slides.map((s, idx) => (
                    <button
                      key={s.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-1.5 rounded-full transition-all ${
                        idx === currentIndex
                          ? 'w-6 bg-[#FF6A16]'
                          : 'w-1.5 bg-white/20 hover:bg-white/40'
                      }`}
                      title={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Bottom Content Area */}
              <div className="max-w-xl">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#F5F2EA] tracking-tight leading-tight">
                  {currentSlide.title}
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-[#8C8A84] leading-relaxed line-clamp-2">
                  {currentSlide.subtitle}
                </p>

                <div className="mt-4 flex items-center gap-3">
                  <Link
                    to={currentSlide.link}
                    className="btn-brand text-xs px-4 py-2 rounded-lg inline-flex items-center gap-1.5 group/btn"
                  >
                    <span>Explore Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Manual Left/Right Controls */}
        <div className="absolute right-4 bottom-4 z-20 flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            className="p-2 rounded-lg bg-[#050505]/80 hover:bg-[#141416] text-[#F5F2EA] border border-white/10 backdrop-blur-md transition-colors"
            title="Previous Frame"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="p-2 rounded-lg bg-[#050505]/80 hover:bg-[#141416] text-[#F5F2EA] border border-white/10 backdrop-blur-md transition-colors"
            title="Next Frame"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Travelling Edge Light */}
        <div className="absolute top-0 left-0 right-0 h-[1.5px] overflow-hidden z-30 pointer-events-none">
          <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-[#FF6A16] to-transparent animate-travel-line opacity-80" />
        </div>
      </div>
    </div>
  );
};
