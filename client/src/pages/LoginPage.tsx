import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { Eye, EyeOff, Lock, Mail, ShieldCheck, UserCheck, Layers, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Marquee } from '../components/common/Marquee';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, role } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated && role) {
      if (role === 'ADMIN') navigate('/admin/dashboard', { replace: true });
      else if (role === 'PROJECT_LEAD') navigate('/lead/dashboard', { replace: true });
      else navigate('/member/dashboard', { replace: true });
    }
  }, [isAuthenticated, role, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please fill in both email and password');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      await login(email, password);
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.error || 'Invalid credentials. Please check your email and password.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fillCredentials = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Password123!');
    setErrorMessage('');
  };

  const marqueeItems1 = [
    'HACKFEST 2026',
    'CLUB WEBSITE REDESIGN',
    'WEB DEV & CLOUD WORKSHOP',
    'TECH FEST EXPO',
    'OPEN SOURCE SPRINT',
  ];

  const marqueeItems2 = [
    'BUILD • LEARN • COLLABORATE • SHIP • REPEAT',
    'INNOVATION LAB',
    'REAL PRODUCTIVITY SOFTWARE',
    'ROLE-BASED WORKSPACE',
  ];

  return (
    <div className="min-h-screen w-full flex bg-[#050505] text-[#F5F2EA] overflow-hidden select-none">
      {/* LEFT SIDE: Cinematic Architectural Visual Hero (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0D0D0F] flex-col justify-between p-12 relative border-r border-white/8 overflow-hidden">
        {/* Cinematic Frame Image with Slow Pan and Vignette */}
        <div className="absolute inset-0 z-0">
          <img
            src="/frames/01_lobby.jpg"
            alt="ClubFlow Innovation Lab"
            className="w-full h-full object-cover animate-slow-pan opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/75 to-[#050505]/85" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#050505]/80" />
        </div>

        {/* Travelling Orange Line along top */}
        <div className="absolute top-0 left-0 right-0 h-[1.5px] overflow-hidden z-20 pointer-events-none">
          <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-[#FF6A16] to-transparent animate-travel-line opacity-80" />
        </div>

        {/* Top Header */}
        <div className="relative z-10">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#FF6A16] to-[#FFD400] text-black flex items-center justify-center font-black text-sm shadow-glow-orange shrink-0">
              <Layers className="w-5 h-5 text-black" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-[#F5F2EA] flex items-center gap-1.5">
                Club<span className="text-[#FF6A16] font-semibold">Flow</span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#141416] text-[#FFD400] border border-white/10 font-bold">
                  INNOVATION OS
                </span>
              </span>
            </div>
          </div>

          <div className="mt-12 max-w-lg">
            <span className="font-mono text-xs uppercase tracking-widest text-[#FF6A16] font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A16] animate-pulse" />
              01 / UNIVERSITY INNOVATION LAB
            </span>
            <h1 className="text-3xl xl:text-4xl font-extrabold text-[#F5F2EA] tracking-tight leading-tight mt-2">
              Your club. In motion.
            </h1>
            <p className="mt-3 text-sm text-[#8C8A84] leading-relaxed">
              Projects, squads, and milestone deliverables — engineered for student technical teams.
            </p>
          </div>
        </div>

        {/* Live Initiatives Showcase Box */}
        <div className="relative z-10 my-6">
          <div className="p-5 rounded-lg bg-[#0D0D0F]/90 border border-white/8 shadow-2xl backdrop-blur-md space-y-3.5 max-w-md">
            <div className="flex items-center justify-between pb-2.5 border-b border-white/8 text-xs">
              <span className="font-mono text-zinc-400 uppercase tracking-wider text-[11px]">
                Active Initiatives
              </span>
              <span className="inline-flex items-center gap-1.5 text-[#FFD400] font-semibold text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFD400] animate-pulse" />
                Live Sync
              </span>
            </div>

            {/* HackFest 2026 */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-zinc-200">HackFest 2026 – Hackathon Sprint</span>
                <span className="font-mono text-[#FF6A16] font-semibold">82%</span>
              </div>
              <div className="h-1.5 w-full bg-[#1C1C20] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#FF6A16] to-[#FFD400] rounded-full w-[82%]" />
              </div>
            </div>

            {/* Club Website Redesign */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-zinc-200">Club Website & Operational Systems</span>
                <span className="font-mono text-[#FF6A16] font-semibold">67%</span>
              </div>
              <div className="h-1.5 w-full bg-[#1C1C20] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#FF6A16] to-[#FF8540] rounded-full w-[67%]" />
              </div>
            </div>

            {/* Live stats summary footer */}
            <div className="pt-2 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded bg-[#141416] border border-white/5">
                <div className="text-[10px] font-mono text-[#8C8A84]">PROJECTS</div>
                <div className="font-bold text-[#F5F2EA] mt-0.5">04 Active</div>
              </div>
              <div className="p-2 rounded bg-[#141416] border border-white/5">
                <div className="text-[10px] font-mono text-[#8C8A84]">CONTRIBUTORS</div>
                <div className="font-bold text-[#F5F2EA] mt-0.5">12 Students</div>
              </div>
              <div className="p-2 rounded bg-[#141416] border border-white/5">
                <div className="text-[10px] font-mono text-[#8C8A84]">VELOCITY</div>
                <div className="font-bold text-[#FFD400] mt-0.5">88%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Marquee tickers */}
        <div className="relative z-10 space-y-1.5 -mx-12">
          <Marquee items={marqueeItems1} speed="normal" className="opacity-40 text-xs font-mono text-zinc-400" />
          <Marquee items={marqueeItems2} reverse={true} speed="normal" className="opacity-30 text-xs font-mono text-[#FF6A16]" />
        </div>
      </div>

      {/* RIGHT SIDE: Clean Authentication Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 md:p-16 relative bg-[#050505]">
        <div className="w-full max-w-sm space-y-6">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center space-x-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF6A16] to-[#FFD400] text-black flex items-center justify-center font-black text-sm shadow-glow-orange">
              <Layers className="w-4 h-4 text-black" />
            </div>
            <span className="font-bold text-lg tracking-tight text-[#F5F2EA]">
              Club<span className="text-[#FF6A16]">Flow</span>
            </span>
          </div>

          {/* Return to Public Website link */}
          <div className="flex items-center justify-between pb-2">
            <button
              onClick={() => navigate('/')}
              type="button"
              className="inline-flex items-center gap-1.5 text-xs text-[#8C8A84] hover:text-[#F5F2EA] transition-colors font-mono group"
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span>
              <span>Back to Public Website</span>
            </button>
            <span className="text-[10px] font-mono text-[#FF6A16] uppercase tracking-widest px-2 py-0.5 rounded bg-[#141416] border border-white/5">
              SECURE ACCESS
            </span>
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[#F5F2EA]">Welcome back</h2>
            <p className="mt-1 text-xs text-[#8C8A84]">
              Sign in to your club workspace to access projects and deliverables.
            </p>
          </div>

          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/60 text-rose-400 text-xs font-medium"
            >
              {errorMessage}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5 font-mono">
                College Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@clubflow.local"
                  className="w-full pl-10 pr-3.5 py-2 text-xs bg-[#0D0D0F] border border-white/10 rounded-lg text-[#F5F2EA] placeholder:text-zinc-600 focus-ring shadow-subtle"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2 text-xs bg-[#0D0D0F] border border-white/10 rounded-lg text-[#F5F2EA] placeholder:text-zinc-600 focus-ring shadow-subtle"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-zinc-500 hover:text-zinc-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full"
                isLoading={isLoading}
              >
                Sign In
              </Button>
            </div>
          </form>

          {/* Quick Demo Fillers */}
          <div className="pt-4 border-t border-white/8">
            <p className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider text-center mb-2.5">
              1-Click Demo Access
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillCredentials('admin@clubflow.local')}
                className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-[#0D0D0F] hover:bg-[#141416] border border-white/8 hover:border-[#FF6A16]/40 text-zinc-200 transition-all text-xs group shadow-subtle"
              >
                <ShieldCheck className="w-4 h-4 text-[#FFD400] mb-1 group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-[11px]">Advisor</span>
                <span className="text-[9px] text-zinc-500">Dr. Sharma</span>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials('lead@clubflow.local')}
                className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-[#0D0D0F] hover:bg-[#141416] border border-white/8 hover:border-[#FF6A16]/40 text-zinc-200 transition-all text-xs group shadow-subtle"
              >
                <UserCheck className="w-4 h-4 text-[#FF6A16] mb-1 group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-[11px]">Lead</span>
                <span className="text-[9px] text-zinc-500">Anurag P.</span>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials('member1@clubflow.local')}
                className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-[#0D0D0F] hover:bg-[#141416] border border-white/8 hover:border-[#FF6A16]/40 text-zinc-200 transition-all text-xs group shadow-subtle"
              >
                <UserCheck className="w-4 h-4 text-zinc-400 mb-1 group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-[11px]">Member</span>
                <span className="text-[9px] text-zinc-500">Rohit G.</span>
              </button>
            </div>
            <p className="text-[11px] font-mono text-zinc-500 text-center mt-2.5">
              Password: <code className="text-[#FF6A16] font-semibold">Password123!</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
