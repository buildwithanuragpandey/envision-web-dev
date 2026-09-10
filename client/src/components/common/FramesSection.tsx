import React from 'react';
import { CinematicFrame } from './CinematicFrame';
import { Sparkles, Eye } from 'lucide-react';

export const FramesSection: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#FF6A16] font-semibold bg-[#141416] px-2 py-0.5 rounded border border-white/10">
              EDITORIAL CURATION
            </span>
            <span className="text-[11px] font-mono text-zinc-500">
              ARCHITECTURAL FRAMES
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-extrabold text-[#F5F2EA] tracking-tight mt-1">
            Club Environments & Spaces
          </h2>
        </div>
      </div>

      {/* Asymmetrical Editorial Grid (Large Hero Left + Two Stacked Right + Offset Wide Bottom) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Frame 01: Large Portrait Hero (Left - 7 cols) */}
        <div className="md:col-span-7">
          <CinematicFrame
            frameNumber="01"
            tag="INNOVATION LOBBY"
            title="Club Atrium & Event Hub"
            subtitle="Campus collaboration space for keynote gatherings and hackathons."
            imageSrc="/frames/01_lobby.jpg"
            aspectRatio="portrait"
            className="h-full min-h-[340px]"
          />
        </div>

        {/* Frames 02 & 03: Two Stacked (Right - 5 cols) */}
        <div className="md:col-span-5 flex flex-col gap-4">
          <CinematicFrame
            frameNumber="02"
            tag="TECHNICAL CORRIDOR"
            title="Systems & Project Artery"
            subtitle="High-focus engineering terminal connecting club workrooms."
            imageSrc="/frames/02_corridor.jpg"
            aspectRatio="video"
            className="flex-1"
          />

          <CinematicFrame
            frameNumber="03"
            tag="DEV WORKSPACE"
            title="Full-Stack Prototype Lab"
            subtitle="Hardware testbenches and collaborative coding stations."
            imageSrc="/frames/03_workspace.jpg"
            aspectRatio="video"
            className="flex-1"
          />
        </div>

        {/* Frame 04: Wide Panoramic Offset (Bottom - 12 cols) */}
        <div className="md:col-span-12">
          <CinematicFrame
            frameNumber="04"
            tag="HALO OF INNOVATION"
            title="Intelligence Core & Data Projection Room"
            subtitle="Telemetry visualization and strategic club project reviews."
            imageSrc="/frames/04_halo.jpg"
            aspectRatio="wide"
          />
        </div>
      </div>
    </div>
  );
};
