import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { Eye, EyeOff, Lock, Mail, ShieldCheck, UserCheck, Layers, Play } from 'lucide-react';
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
    'WEB DEV BOOTCAMP',
    'TECH FEST KEYNOTE',
    'OPEN SOURCE SPRINT',
  ];

  const marqueeItems2 = [
    'PLAN → BUILD → DELIVER → REPEAT',
    '36-HOUR HACKATHON',
    '150+ ACTIVE STUDENTS',
    'STUDENT TECH COMMUNITY',
  ];

  return (
    <div className="min-h-screen w-full flex bg-[#fafafa] overflow-hidden">
      {/* LEFT SIDE: Authentic College Club Visual & Video Reel (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 bg-zinc-950 text-white flex-col justify-between p-12 relative border-r border-zinc-900 overflow-hidden">
        {/* Subtle video background loop for authentic college student coding & events */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            poster="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&auto=format&fit=crop&q=80"
            className="w-full h-full object-cover opacity-25"
          >
            <source
              src="https://assets.mixkit.co/videos/preview/mixkit-group-of-people-working-in-a-collaborative-space-40092-large.mp4"
              type="video/mp4"
            />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-zinc-950/90" />
        </div>

        {/* Top Header */}
        <div className="relative z-10">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-white text-zinc-950 flex items-center justify-center font-extrabold text-sm shadow-sm shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
                Club<span className="text-zinc-400 font-normal">Flow</span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-zinc-900 text-zinc-400 border border-zinc-800">
                  WORKSPACE
                </span>
              </span>
            </div>
          </div>

          <div className="mt-12 max-w-lg">
            <span className="font-mono text-xs uppercase tracking-widest text-emerald-400 font-semibold">
              Student Technical Operations
            </span>
            <h1 className="text-3xl xl:text-4xl font-extrabold text-white tracking-tight leading-tight mt-2">
              Your club. Your teams. Your projects.
            </h1>
            <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
              Organize hackathons, bootcamp sessions, design sprints, and deliverable milestones across all college technical committees.
            </p>
          </div>
        </div>

        {/* Real Live Initiatives Showcase Box */}
        <div className="relative z-10 my-6">
          <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-2xl backdrop-blur-md space-y-3.5 max-w-md">
            <div className="flex items-center justify-between pb-2.5 border-b border-zinc-800 text-xs">
              <span className="font-mono text-zinc-400 uppercase tracking-wider text-[11px]">
                Active Initiatives
              </span>
              <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Sync
              </span>
            </div>

            {/* HackFest 2026 */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-zinc-200">HackFest 2026 – Hackathon Operations</span>
                <span className="font-mono text-zinc-400">80%</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full w-[80%]" />
              </div>
            </div>

            {/* Club Website Redesign */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-zinc-200">Official Club Website Redesign</span>
                <span className="font-mono text-zinc-400">67%</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-zinc-400 rounded-full w-[67%]" />
              </div>
            </div>

            {/* Live stats summary footer */}
            <div className="pt-2 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-zinc-800/60 border border-zinc-800">
                <div className="text-[10px] font-mono text-zinc-400">DELIVERABLES</div>
                <div className="font-bold text-white mt-0.5">14 Active</div>
              </div>
              <div className="p-2 rounded-xl bg-zinc-800/60 border border-zinc-800">
                <div className="text-[10px] font-mono text-zinc-400">COMMUNITY</div>
                <div className="font-bold text-white mt-0.5">9 Members</div>
              </div>
              <div className="p-2 rounded-xl bg-zinc-800/60 border border-zinc-800">
                <div className="text-[10px] font-mono text-zinc-400">ON TRACK</div>
                <div className="font-bold text-emerald-400 mt-0.5">92%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Marquee tickers */}
        <div className="relative z-10 space-y-1.5 -mx-12">
          <Marquee items={marqueeItems1} speed="normal" className="opacity-50" />
          <Marquee items={marqueeItems2} reverse={true} speed="normal" className="opacity-30" />
        </div>
      </div>

      {/* RIGHT SIDE: Authentication Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 md:p-16 relative">
        <div className="w-full max-w-sm space-y-6">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center space-x-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center font-extrabold text-sm shadow-sm">
              <Layers className="w-4 h-4" />
            </div>
            <span className="font-bold text-lg tracking-tight text-zinc-900">
              Club<span className="text-zinc-500 font-normal">Flow</span>
            </span>
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Sign in to ClubFlow</h2>
            <p className="mt-1 text-xs text-zinc-500">
              Enter your student credentials or select a demo role to proceed.
            </p>
          </div>

          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium"
            >
              {errorMessage}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1.5">
                College Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@clubflow.local"
                  className="w-full pl-10 pr-3.5 py-2 text-sm bg-white border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400 focus-ring shadow-subtle"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2 text-sm bg-white border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400 focus-ring shadow-subtle"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-zinc-400 hover:text-zinc-600"
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
          <div className="pt-4 border-t border-zinc-200/80">
            <p className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider text-center mb-2.5">
              1-Click Demo Profiles
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillCredentials('admin@clubflow.local')}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-white hover:bg-zinc-100 border border-zinc-200 hover:border-zinc-300 text-zinc-800 transition-all text-xs group shadow-subtle"
              >
                <ShieldCheck className="w-4 h-4 text-zinc-900 mb-1 group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-[11px]">Advisor</span>
                <span className="text-[9px] text-zinc-400">Dr. Sharma</span>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials('lead@clubflow.local')}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-white hover:bg-zinc-100 border border-zinc-200 hover:border-zinc-300 text-zinc-800 transition-all text-xs group shadow-subtle"
              >
                <UserCheck className="w-4 h-4 text-blue-600 mb-1 group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-[11px]">Lead</span>
                <span className="text-[9px] text-zinc-400">Anurag P.</span>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials('member1@clubflow.local')}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-white hover:bg-zinc-100 border border-zinc-200 hover:border-zinc-300 text-zinc-800 transition-all text-xs group shadow-subtle"
              >
                <UserCheck className="w-4 h-4 text-emerald-600 mb-1 group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-[11px]">Member</span>
                <span className="text-[9px] text-zinc-400">Rohit G.</span>
              </button>
            </div>
            <p className="text-[11px] font-mono text-zinc-400 text-center mt-2.5">
              Default Password: <code className="text-zinc-600 font-bold">Password123!</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
