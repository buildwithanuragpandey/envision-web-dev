import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ArrowRight,
  ArrowDown,
  CheckCircle2,
  Menu,
  X,
  Compass,
  Zap,
  ShieldCheck,
  Flame,
  LayoutGrid,
  CheckSquare,
  Users,
  FolderKanban,
  Activity,
  Layers,
  Cpu,
  Radio,
  GitBranch,
  Clock,
  Sparkles,
  Target,
  Shield,
  Terminal,
  Lock,
  Mail,
  Eye,
  EyeOff,
  LogOut,
  UserCheck,
} from 'lucide-react';
import { AnimatedCounter } from '../components/common/AnimatedCounter';

export const LandingPage: React.FC = () => {
  const { role, user, isAuthenticated, login, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Authentication State
  const [authTab, setAuthTab] = useState<'telemetry' | 'signin'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Target dashboard destination if authenticated
  const getDestination = () => {
    if (role === 'ADMIN') return '/admin/dashboard';
    if (role === 'PROJECT_LEAD') return '/lead/dashboard';
    return '/member/dashboard';
  };

  // Automatically navigate once user is logged in
  useEffect(() => {
    if (isAuthenticated && role) {
      if (role === 'ADMIN') navigate('/admin/dashboard', { replace: true });
      else if (role === 'PROJECT_LEAD') navigate('/lead/dashboard', { replace: true });
      else navigate('/member/dashboard', { replace: true });
    }
  }, [isAuthenticated, role, navigate]);

  const handleCtaClick = async () => {
    if (isAuthenticated) {
      navigate(getDestination());
    } else {
      // 1-Click Instant Enter ClubFlow with Admin Demo
      await fillCredentialsAndLogin('admin@clubflow.local');
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
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

  const fillCredentialsAndLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Password123!');
    setErrorMessage('');
    setIsLoading(true);
    try {
      await login(demoEmail, 'Password123!');
    } catch (err: any) {
      setErrorMessage(err.response?.data?.error || 'Sign in failed');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Section 01: Scroll animations for Hero
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroImgScale = useTransform(heroScroll, [0, 1], [1.08, 1]);
  const heroImgOpacity = useTransform(heroScroll, [0, 0.9], [0.85, 0.4]);

  // Section 03: Projects Corridor Parallax
  const corridorRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: corridorScroll } = useScroll({
    target: corridorRef,
    offset: ['start end', 'end start'],
  });
  const corridorImgY = useTransform(corridorScroll, [0, 1], [-30, 30]);

  // Section 04: Teams Lab Scroll
  const teamsRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: teamsScroll } = useScroll({
    target: teamsRef,
    offset: ['start end', 'end start'],
  });
  const teamsImgScale = useTransform(teamsScroll, [0, 0.5, 1], [1.04, 1, 0.98]);

  // Section 05: Product comes alive task board animation
  const taskSectionRef = useRef<HTMLDivElement>(null);
  const isTaskInView = useInView(taskSectionRef, { once: true, margin: '-100px' });
  const [activeTaskColumn, setActiveTaskColumn] = useState<'todo' | 'progress' | 'completed'>('todo');

  useEffect(() => {
    if (isTaskInView) {
      const t1 = setTimeout(() => setActiveTaskColumn('progress'), 900);
      const t2 = setTimeout(() => setActiveTaskColumn('completed'), 2200);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [isTaskInView]);

  // Section 07: Innovation Hub Progress animation
  const innovationRef = useRef<HTMLDivElement>(null);
  const isInnovationInView = useInView(innovationRef, { once: true, margin: '-80px' });

  // Section 09: Gallery Parallax Speeds
  const galleryRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: galleryScroll } = useScroll({
    target: galleryRef,
    offset: ['start end', 'end start'],
  });
  const gal1Y = useTransform(galleryScroll, [0, 1], [-20, 20]);
  const gal2Y = useTransform(galleryScroll, [0, 1], [30, -30]);
  const gal3Y = useTransform(galleryScroll, [0, 1], [-40, 40]);
  const gal4Y = useTransform(galleryScroll, [0, 1], [25, -25]);

  return (
    <div className="bg-[#050505] text-[#F5F2EA] min-h-screen selection:bg-[#FF6A16] selection:text-black font-sans relative overflow-x-hidden">
      {/* ========================================================
          NAVBAR (Transparent -> Dark Translucent on Scroll)
      ======================================================== */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
          scrolled
            ? 'bg-[#050505]/90 backdrop-blur-md border-b border-white/8 py-3.5 shadow-2xl'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF6A16] to-[#FF9D00] flex items-center justify-center text-black font-extrabold text-sm shadow-md shadow-[#FF6A16]/20 transition-transform group-hover:scale-105">
              CF
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-[#F5F2EA] group-hover:text-white transition-colors block leading-tight">
                ClubFlow
              </span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#8C8A84] block">
                CAMPUS OPERATING SYSTEM
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-xs font-mono tracking-wider text-[#8C8A84]">
            <button
              onClick={() => scrollToSection('problem')}
              className="hover:text-[#F5F2EA] transition-colors"
            >
              Platform
            </button>
            <button
              onClick={() => scrollToSection('projects')}
              className="hover:text-[#F5F2EA] transition-colors"
            >
              Projects
            </button>
            <button
              onClick={() => scrollToSection('teams')}
              className="hover:text-[#F5F2EA] transition-colors"
            >
              Teams
            </button>
            <button
              onClick={() => scrollToSection('workflow')}
              className="hover:text-[#F5F2EA] transition-colors"
            >
              How it works
            </button>
            <button
              onClick={() => scrollToSection('gallery')}
              className="hover:text-[#F5F2EA] transition-colors"
            >
              Architecture
            </button>
            <button
              onClick={() => scrollToSection('access-portal')}
              className="hover:text-[#FF6A16] transition-colors font-bold"
            >
              Access Portal
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-[#8C8A84]">
                  {user?.name} <span className="text-[#FF6A16]">({role})</span>
                </span>
                <button
                  onClick={handleCtaClick}
                  className="px-4 py-2 rounded-lg bg-[#FF6A16] hover:bg-[#FF9D00] text-black text-xs font-extrabold transition-all shadow-md shadow-[#FF6A16]/20 flex items-center gap-1.5"
                >
                  <span>Dashboard →</span>
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => scrollToSection('access-portal')}
                  className="text-xs font-mono font-medium text-[#8C8A84] hover:text-[#F5F2EA] transition-colors px-3 py-1.5"
                >
                  Sign In
                </button>
                <button
                  onClick={handleCtaClick}
                  disabled={isLoading}
                  className="px-4 py-2 rounded-lg bg-[#FF6A16] hover:bg-[#FF9D00] text-black text-xs font-extrabold transition-all shadow-md shadow-[#FF6A16]/20 flex items-center gap-1.5 hover:-translate-y-0.5 disabled:opacity-50"
                >
                  <span>{isLoading ? 'Connecting...' : 'Enter ClubFlow →'}</span>
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#8C8A84] hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0D0D0F] border-b border-white/10 px-6 py-5 space-y-4 shadow-2xl">
            <nav className="flex flex-col space-y-3 font-mono text-xs text-[#8C8A84]">
              <button
                onClick={() => scrollToSection('problem')}
                className="text-left hover:text-[#F5F2EA]"
              >
                Platform
              </button>
              <button
                onClick={() => scrollToSection('projects')}
                className="text-left hover:text-[#F5F2EA]"
              >
                Projects
              </button>
              <button
                onClick={() => scrollToSection('teams')}
                className="text-left hover:text-[#F5F2EA]"
              >
                Teams
              </button>
              <button
                onClick={() => scrollToSection('workflow')}
                className="text-left hover:text-[#F5F2EA]"
              >
                How it works
              </button>
              <button
                onClick={() => scrollToSection('gallery')}
                className="text-left hover:text-[#F5F2EA]"
              >
                Architecture
              </button>
              <button
                onClick={() => scrollToSection('access-portal')}
                className="text-left text-[#FF6A16] font-bold"
              >
                Access Portal
              </button>
            </nav>
            <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  scrollToSection('access-portal');
                }}
                className="w-full py-2.5 rounded-lg bg-[#141416] text-[#F5F2EA] text-xs font-bold text-center border border-white/10"
              >
                Sign In
              </button>
              <button
                onClick={handleCtaClick}
                className="w-full py-2.5 rounded-lg bg-[#FF6A16] text-black text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <span>Enter ClubFlow →</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ========================================================
          SECTION 01: CINEMATIC HERO & LIVE COMMAND LAUNCHER
      ======================================================== */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden border-b border-white/8"
      >
        {/* Architectural Image Backdrop (60-70% visual composition) */}
        <motion.div
          style={{ scale: heroImgScale, opacity: heroImgOpacity }}
          className="absolute inset-0 z-0 overflow-hidden"
        >
          <img
            src="/frames/01_vision_atrium.jpg"
            alt="Vision Atrium"
            className="w-full h-full object-cover object-center filter brightness-[0.55] contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-[#050505]/80" />
          <div className="absolute inset-0 bg-radial from-transparent via-[#050505]/40 to-[#050505]" />

          {/* Futuristic Corner Reticles over Hero */}
          <div className="absolute top-28 left-8 text-white/20 font-mono text-[10px] hidden md:block">
            ⌜ SYS: ATRIUM_OS_2.4
          </div>
          <div className="absolute top-28 right-8 text-white/20 font-mono text-[10px] hidden md:block">
            LATENCY: 14ms ⌝
          </div>
        </motion.div>

        {/* Continuous Traveling Orange Laser Line */}
        <div className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-[#FF6A16] to-transparent animate-travel-line z-10" />

        {/* Hero Content & Command HUD */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1 rounded-full bg-[#141416]/90 border border-white/10 backdrop-blur-md shadow-lg">
                <span className="w-2 h-2 rounded-full bg-[#FF6A16] animate-ping" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#FFD400] font-bold">
                  01 / CLUB OPERATING SYSTEM
                </span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#F5F2EA] leading-[1.05]">
                CLUBFLOW
                <span className="block text-2xl sm:text-4xl lg:text-5xl font-light text-[#8C8A84] mt-2">
                  YOUR CLUB. IN MOTION.
                </span>
              </h1>

              <p className="text-sm sm:text-base lg:text-lg text-[#8C8A84] max-w-xl leading-relaxed">
                Projects, teams and tasks moving together. Eliminate scattered group chats, spreadsheet chaos, and lost milestones with real-time collegiate club governance.
              </p>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <button
                  onClick={handleCtaClick}
                  disabled={isLoading}
                  className="px-7 py-3.5 rounded-xl bg-[#FF6A16] hover:bg-[#FF9D00] text-black text-sm font-extrabold transition-all shadow-xl hover:shadow-[#FF6A16]/30 flex items-center gap-2 hover:-translate-y-0.5 disabled:opacity-50"
                >
                  <span>{isLoading ? 'Launching...' : isAuthenticated ? 'GO TO WORKSPACE →' : 'ENTER CLUBFLOW →'}</span>
                </button>

                <button
                  onClick={() => scrollToSection('problem')}
                  className="px-6 py-3.5 rounded-xl bg-[#141416] hover:bg-[#1C1C20] text-[#F5F2EA] text-sm font-bold border border-white/8 hover:border-white/20 transition-all flex items-center gap-2"
                >
                  <span>EXPLORE THE PLATFORM ↓</span>
                </button>
              </div>
            </div>

            {/* Right Side: Clean Futuristic Command & 1-Click Launch Deck */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-6 rounded-2xl bg-[#0D0D0F]/95 backdrop-blur-xl border border-white/15 shadow-2xl space-y-5 relative overflow-hidden group hover:border-[#FF6A16]/40 transition-all">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6A16]/10 rounded-full blur-2xl pointer-events-none" />
                
                {/* Header HUD */}
                <div className="flex items-center justify-between pb-3 border-b border-white/8">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-mono text-xs font-bold text-[#F5F2EA]">CENTRAL COMMAND DECK</span>
                  </div>
                  <span className="font-mono text-[10px] text-[#FF6A16] bg-[#FF6A16]/10 px-2 py-0.5 rounded border border-[#FF6A16]/20 font-bold">
                    SYSTEM READY
                  </span>
                </div>

                {/* 1-Click Workspace Launch Presets */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C8A84] block font-bold">
                    DIRECT WORKSPACE LAUNCH (1-CLICK DEMO)
                  </span>
                  
                  <div className="grid grid-cols-1 gap-2">
                    {/* Admin Launcher */}
                    <button
                      type="button"
                      onClick={() => fillCredentialsAndLogin('admin@clubflow.local')}
                      disabled={isLoading}
                      className="p-3 rounded-xl bg-[#141416] hover:bg-[#1C1C20] border border-white/10 hover:border-[#FF6A16] flex items-center justify-between text-left transition-all group/btn"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-[#FF6A16]/20 text-[#FF6A16] flex items-center justify-center font-bold text-xs">
                          👑
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[#F5F2EA] group-hover/btn:text-[#FF6A16] transition-colors">
                            Launch as Admin (President)
                          </div>
                          <div className="text-[10px] font-mono text-[#8C8A84]">Full governance, rosters & telemetry</div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#8C8A84] group-hover/btn:text-[#FF6A16] group-hover/btn:translate-x-1 transition-all" />
                    </button>

                    {/* Lead Launcher */}
                    <button
                      type="button"
                      onClick={() => fillCredentialsAndLogin('lead.web@clubflow.local')}
                      disabled={isLoading}
                      className="p-3 rounded-xl bg-[#141416] hover:bg-[#1C1C20] border border-white/10 hover:border-[#FFD400] flex items-center justify-between text-left transition-all group/btn"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-[#FFD400]/20 text-[#FFD400] flex items-center justify-center font-bold text-xs">
                          ⚡
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[#F5F2EA] group-hover/btn:text-[#FFD400] transition-colors">
                            Launch as Project Lead
                          </div>
                          <div className="text-[10px] font-mono text-[#8C8A84]">Sprint backlogs & task verification</div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#8C8A84] group-hover/btn:text-[#FFD400] group-hover/btn:translate-x-1 transition-all" />
                    </button>

                    {/* Member Launcher */}
                    <button
                      type="button"
                      onClick={() => fillCredentialsAndLogin('alex.member@clubflow.local')}
                      disabled={isLoading}
                      className="p-3 rounded-xl bg-[#141416] hover:bg-[#1C1C20] border border-white/10 hover:border-white/30 flex items-center justify-between text-left transition-all group/btn"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-white/10 text-white flex items-center justify-center font-bold text-xs">
                          🛠️
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[#F5F2EA] group-hover/btn:text-white transition-colors">
                            Launch as Member
                          </div>
                          <div className="text-[10px] font-mono text-[#8C8A84]">Assigned tasks & 1-click status updates</div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#8C8A84] group-hover/btn:text-white group-hover/btn:translate-x-1 transition-all" />
                    </button>
                  </div>
                </div>

                {/* Telemetry Summary Ticker */}
                <div className="pt-2 border-t border-white/8 grid grid-cols-3 gap-2 text-center font-mono text-xs">
                  <div className="p-2 rounded-lg bg-[#050505] border border-white/5">
                    <div className="text-[9px] text-[#8C8A84]">TEAMS</div>
                    <div className="font-bold text-[#F5F2EA] mt-0.5">14 Synced</div>
                  </div>
                  <div className="p-2 rounded-lg bg-[#050505] border border-white/5">
                    <div className="text-[9px] text-[#8C8A84]">MEMBERS</div>
                    <div className="font-bold text-[#FF6A16] mt-0.5">12 Online</div>
                  </div>
                  <div className="p-2 rounded-lg bg-[#050505] border border-white/5">
                    <div className="text-[9px] text-[#8C8A84]">HEALTH</div>
                    <div className="font-bold text-emerald-400 mt-0.5">99.8%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll To Explore Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-center pointer-events-none z-10">
          <span className="font-mono text-[9px] uppercase tracking-widest text-[#8C8A84] font-bold">
            SCROLL TO EXPLORE
          </span>
          <div className="w-[1px] h-8 bg-white/10 relative overflow-hidden">
            <div className="w-full h-1/2 bg-[#FF6A16] animate-bounce" />
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 02: MASSIVE TYPOGRAPHY (The Problem)
      ======================================================== */}
      <section id="problem" className="min-h-[90vh] flex items-center py-28 px-6 sm:px-8 border-b border-white/8 bg-[#050505]">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="flex items-center gap-3">
            <div className="w-8 h-[2px] bg-[#FF6A16]" />
            <span className="font-mono text-xs uppercase tracking-widest text-[#FF6A16] font-bold">
              THE BOTTLENECK
            </span>
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#F5F2EA] leading-[1.05]">
              CLUBS MOVE FAST.
            </h2>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#FF6A16] leading-[1.05]">
              PEOPLE SHOULDN’T HAVE TO CHASE THE WORK.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
            <div className="p-6 rounded-2xl bg-[#0D0D0F] border border-white/8 space-y-3">
              <span className="font-mono text-[10px] text-rose-400 font-bold uppercase tracking-wider block">
                [ THE ENTROPY ]
              </span>
              <p className="text-sm sm:text-base text-[#8C8A84] leading-relaxed">
                Important project specifications buried in noisy WhatsApp groups. Task assignments made verbally and forgotten 48 hours later. Progress estimates based on speculation rather than shipped code.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0D0D0F] border border-[#FF6A16]/30 space-y-3">
              <span className="font-mono text-[10px] text-[#FFD400] font-bold uppercase tracking-wider block">
                [ THE CLUBFLOW STANDARD ]
              </span>
              <p className="text-sm sm:text-base text-[#F5F2EA] leading-relaxed">
                Centralized initiative charters. Strict role-based permissions for Admins, Leads, and Members. Live deliverable Kanban tracking with automatic progress calculation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 03: FRAME 03 / PROJECTS (03_project_corridor.jpg)
      ======================================================== */}
      <section id="projects" ref={corridorRef} className="py-28 px-6 sm:px-8 border-b border-white/8 bg-[#0D0D0F]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Large Sticky Frame 03 with Interactive HUD */}
          <div className="lg:col-span-7 relative group rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <motion.div style={{ y: corridorImgY }} className="h-96 sm:h-[460px] w-full overflow-hidden relative">
              <img
                src="/frames/03_project_corridor.jpg"
                alt="Project Corridor"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-90" />
            </motion.div>

            {/* Top HUD Node Banner */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between font-mono text-[10px] text-[#F5F2EA] bg-[#050505]/80 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A16] animate-pulse" />
                <span>NODE 02 // HARDWARE & PROTOTYPING CORRIDOR</span>
              </div>
              <span className="text-[#8C8A84] hidden sm:inline">MILESTONES ACTIVE: 4/5</span>
            </div>

            {/* Corner Crosshairs */}
            <div className="absolute top-12 left-4 text-white/30 font-mono text-xs pointer-events-none">⌜</div>
            <div className="absolute top-12 right-4 text-white/30 font-mono text-xs pointer-events-none">⌝</div>

            {/* Realistic Attached Project Progress HUD Box */}
            <div className="absolute bottom-6 left-6 right-6 bg-[#050505]/95 backdrop-blur-xl p-5 rounded-xl border border-white/10 shadow-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-[9px] text-[#FFD400] font-bold uppercase tracking-wider block">
                    CURRENT SPRINT CHARTER
                  </span>
                  <p className="text-sm font-bold text-[#F5F2EA]">HACKFEST 2026 INFRASTRUCTURE</p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-sm font-bold text-[#FF6A16]">82% COMPLETE</span>
                  <span className="font-mono text-[10px] text-[#8C8A84] block">4 Days to Expo</span>
                </div>
              </div>

              {/* Multi-phase milestone pipeline */}
              <div className="grid grid-cols-4 gap-1.5 pt-1">
                <div className="p-1.5 rounded bg-[#141416] border border-white/5 text-center">
                  <div className="text-[8px] font-mono text-emerald-400 font-bold">PHASE 1 ✓</div>
                  <div className="text-[10px] text-zinc-300 font-semibold truncate">Charter</div>
                </div>
                <div className="p-1.5 rounded bg-[#141416] border border-white/5 text-center">
                  <div className="text-[8px] font-mono text-emerald-400 font-bold">PHASE 2 ✓</div>
                  <div className="text-[10px] text-zinc-300 font-semibold truncate">Architecture</div>
                </div>
                <div className="p-1.5 rounded bg-[#141416] border border-[#FF6A16]/40 text-center">
                  <div className="text-[8px] font-mono text-[#FF6A16] font-bold animate-pulse">PHASE 3 ●</div>
                  <div className="text-[10px] text-[#F5F2EA] font-semibold truncate">Integration</div>
                </div>
                <div className="p-1.5 rounded bg-[#141416] border border-white/5 text-center opacity-50">
                  <div className="text-[8px] font-mono text-[#8C8A84] font-bold">PHASE 4</div>
                  <div className="text-[10px] text-[#8C8A84] font-semibold truncate">Deploy</div>
                </div>
              </div>

              <div className="w-full h-2 bg-[#141416] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#FF6A16] to-[#FFD400] w-[82%] rounded-full" />
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-5 space-y-6">
            <span className="font-mono text-xs uppercase tracking-widest text-[#FF6A16] font-bold">
              02 / PROJECT SYSTEM
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#F5F2EA] tracking-tight leading-tight">
              FROM IDEA TO DELIVERY.
            </h2>

            <div className="space-y-3 font-mono text-xs text-[#8C8A84]">
              <div className="p-3.5 rounded-xl bg-[#141416] border border-white/5 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[#FF6A16]" />
                <span className="font-bold text-[#F5F2EA]">PROJECTS:</span>
                <span>Dedicated charters & milestones</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#141416] border border-white/5 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[#FFD400]" />
                <span className="font-bold text-[#F5F2EA]">OWNERS:</span>
                <span>Assigned student Project Leads</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#141416] border border-white/5 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[#F5F2EA]" />
                <span className="font-bold text-[#F5F2EA]">TEAMS:</span>
                <span>Active contributor rosters</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#141416] border border-white/5 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[#FF6A16]" />
                <span className="font-bold text-[#F5F2EA]">PROGRESS:</span>
                <span>Strictly computed task fulfillment</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 04: FRAME 02 / TEAMS (02_collaboration_lab.jpg)
      ======================================================== */}
      <section id="teams" ref={teamsRef} className="py-28 px-6 sm:px-8 border-b border-white/8 bg-[#050505]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Frame 02 Image with Interactive Role Nodes */}
          <div className="lg:col-span-7 relative group rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <motion.div style={{ scale: teamsImgScale }} className="h-96 sm:h-[460px] w-full overflow-hidden relative">
              <img
                src="/frames/02_collaboration_lab.jpg"
                alt="Collaboration Lab"
                className="w-full h-full object-cover object-center filter contrast-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80" />
            </motion.div>

            {/* Top Node HUD */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between font-mono text-[10px] text-[#F5F2EA] bg-[#050505]/80 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFD400] animate-pulse" />
                <span>NODE 03 // COLLABORATION & SPRINT SQUADS</span>
              </div>
              <span className="text-[#FF6A16] font-bold">14 ACTIVE SQUADS</span>
            </div>

            {/* Floating Live Role HUD Overlay */}
            <div className="absolute bottom-6 left-6 right-6 bg-[#050505]/95 backdrop-blur-xl p-5 rounded-xl border border-white/10 shadow-2xl space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-white/8 text-xs font-mono">
                <span className="text-[#F5F2EA] font-bold">SQUAD DELTA • SOFTWARE & ROBOTICS</span>
                <span className="text-emerald-400">● 6 ENGINEERS ACTIVE</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-lg bg-[#141416] border border-white/5 space-y-0.5">
                  <span className="text-[9px] font-mono font-bold text-[#FF6A16] block">[ADMIN]</span>
                  <div className="text-[11px] font-bold text-[#F5F2EA]">Governance</div>
                  <div className="text-[9px] text-[#8C8A84]">Full Permissions</div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#141416] border border-white/5 space-y-0.5">
                  <span className="text-[9px] font-mono font-bold text-[#FFD400] block">[LEAD]</span>
                  <div className="text-[11px] font-bold text-[#F5F2EA]">Sprint Backlog</div>
                  <div className="text-[9px] text-[#8C8A84]">Task Allocation</div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#141416] border border-white/5 space-y-0.5">
                  <span className="text-[9px] font-mono font-bold text-[#F5F2EA] block">[MEMBER]</span>
                  <div className="text-[11px] font-bold text-[#F5F2EA]">Deliverables</div>
                  <div className="text-[9px] text-[#8C8A84]">1-Click Updates</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Teams Hierarchy */}
          <div className="lg:col-span-5 space-y-6">
            <span className="font-mono text-xs uppercase tracking-widest text-[#FFD400] font-bold">
              ROLE-BASED GOVERNANCE
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#F5F2EA] tracking-tight leading-tight">
              TEAMS THAT MOVE TOGETHER.
            </h2>

            <div className="space-y-3 pt-2">
              <div className="p-4 rounded-xl bg-[#0D0D0F] border border-white/8 space-y-1">
                <span className="font-mono text-xs font-bold text-[#FF6A16] block">ADMIN</span>
                <p className="text-xs text-[#8C8A84]">
                  Club president & executive board with complete roster authority and telemetry oversight.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0D0D0F] border border-white/8 space-y-1">
                <span className="font-mono text-xs font-bold text-[#FFD400] block">PROJECT LEAD</span>
                <p className="text-xs text-[#8C8A84]">
                  Sprint commanders managing assigned squads, deliverable priorities, and deadlines.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0D0D0F] border border-white/8 space-y-1">
                <span className="font-mono text-xs font-bold text-[#F5F2EA] block">MEMBER</span>
                <p className="text-xs text-[#8C8A84]">
                  Student contributors with clear individual deliverables and 1-click status progression.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 05: PRODUCT COMES ALIVE (Interactive Task Board)
      ======================================================== */}
      <section id="workflow" ref={taskSectionRef} className="py-28 px-6 sm:px-8 border-b border-white/8 bg-[#0D0D0F]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="font-mono text-xs uppercase tracking-widest text-[#FF6A16] font-bold">
              LIVE WORKFLOW SIMULATION
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#F5F2EA] tracking-tight">
              PRODUCT COMES ALIVE
            </h2>
            <p className="text-xs sm:text-sm text-[#8C8A84]">
              Real React Kanban workflow where tasks transition cleanly from planning to completion.
            </p>
          </div>

          {/* Floating Task Board UI */}
          <div className="bg-[#050505] rounded-2xl border border-white/10 p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/8">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#FF6A16]" />
                <span className="font-mono text-xs font-bold text-[#F5F2EA]">SPRINT KANBAN</span>
              </div>
              <span className="font-mono text-[10px] text-[#8C8A84]">ANIMATED ON VIEWPORT ENTER</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* TO DO Column */}
              <div className="p-4 rounded-xl bg-[#0D0D0F] border border-white/5 space-y-3">
                <div className="flex justify-between items-center text-xs font-mono font-bold text-[#8C8A84] pb-2 border-b border-white/5">
                  <span>TO DO</span>
                  <span>{activeTaskColumn === 'todo' ? '01' : '00'}</span>
                </div>

                {activeTaskColumn === 'todo' && (
                  <motion.div
                    layoutId="live-task-card"
                    className="p-4 rounded-xl bg-[#141416] border border-[#FF6A16]/60 shadow-lg space-y-2"
                  >
                    <span className="text-[9px] font-mono font-bold bg-[#FF6A16]/20 text-[#FF6A16] px-2 py-0.5 rounded">
                      URGENT
                    </span>
                    <h4 className="text-xs font-bold text-[#F5F2EA]">Deploy Registration Gateway</h4>
                    <p className="text-[11px] text-[#8C8A84]">Hackathon 2026 • Lead: Rahul</p>
                  </motion.div>
                )}
              </div>

              {/* IN PROGRESS Column */}
              <div className="p-4 rounded-xl bg-[#0D0D0F] border border-white/5 space-y-3">
                <div className="flex justify-between items-center text-xs font-mono font-bold text-[#FF6A16] pb-2 border-b border-white/5">
                  <span>IN PROGRESS</span>
                  <span>{activeTaskColumn === 'progress' ? '01' : '00'}</span>
                </div>

                {activeTaskColumn === 'progress' && (
                  <motion.div
                    layoutId="live-task-card"
                    className="p-4 rounded-xl bg-[#141416] border border-[#FF6A16] shadow-lg space-y-2"
                  >
                    <span className="text-[9px] font-mono font-bold bg-[#FF6A16]/20 text-[#FF6A16] px-2 py-0.5 rounded animate-pulse">
                      UNDER SPRINT
                    </span>
                    <h4 className="text-xs font-bold text-[#F5F2EA]">Deploy Registration Gateway</h4>
                    <p className="text-[11px] text-[#8C8A84]">Hackathon 2026 • Lead: Rahul</p>
                  </motion.div>
                )}
              </div>

              {/* COMPLETED Column */}
              <div className="p-4 rounded-xl bg-[#0D0D0F] border border-white/5 space-y-3">
                <div className="flex justify-between items-center text-xs font-mono font-bold text-[#FFD400] pb-2 border-b border-white/5">
                  <span>COMPLETED</span>
                  <span>{activeTaskColumn === 'completed' ? '01' : '00'}</span>
                </div>

                {activeTaskColumn === 'completed' && (
                  <motion.div
                    layoutId="live-task-card"
                    className="p-4 rounded-xl bg-[#141416] border border-[#FFD400]/60 shadow-lg space-y-2"
                  >
                    <span className="text-[9px] font-mono font-bold bg-[#FFD400]/20 text-[#FFD400] px-2 py-0.5 rounded flex items-center gap-1 w-fit">
                      <CheckCircle2 className="w-3 h-3" />
                      SHIPPED
                    </span>
                    <h4 className="text-xs font-bold text-[#F5F2EA] line-through text-[#8C8A84]">
                      Deploy Registration Gateway
                    </h4>
                    <p className="text-[11px] text-[#8C8A84]">Verified & Merged</p>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 06: CONTINUOUS KINETIC TYPOGRAPHY SCROLL
      ======================================================== */}
      <section className="py-20 border-b border-white/8 bg-[#050505] overflow-hidden whitespace-nowrap">
        <div className="flex items-center gap-12 text-3xl sm:text-5xl font-black font-mono tracking-tighter text-white/20 animate-marquee select-none">
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="flex items-center gap-12 shrink-0">
              <span className="text-[#FF6A16]">PROJECTS</span>
              <span>→</span>
              <span className="text-[#FFD400]">TEAMS</span>
              <span>→</span>
              <span className="text-[#F5F2EA]">TASKS</span>
              <span>→</span>
              <span className="text-[#8C8A84]">DEADLINES</span>
              <span>→</span>
              <span className="text-[#FF6A16]">PROGRESS</span>
              <span>→</span>
              <span className="text-[#FFD400]">DELIVER</span>
              <span>→</span>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          SECTION 07: FRAME 04 / INNOVATION (04_innovation_hub.jpg)
      ======================================================== */}
      <section ref={innovationRef} className="py-28 px-6 sm:px-8 border-b border-white/8 bg-[#0D0D0F]">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="max-w-3xl space-y-3">
            <span className="font-mono text-xs uppercase tracking-widest text-[#FF6A16] font-bold">
              03 / INNOVATION
            </span>
            <h2 className="text-4xl sm:text-6xl font-extrabold text-[#F5F2EA] tracking-tight leading-tight">
              BUILD SOMETHING REAL.
            </h2>
            <p className="text-xs sm:text-sm text-[#8C8A84] leading-relaxed">
              Track the work. Measure progress. Ship together.
            </p>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
            <div className="h-96 sm:h-[460px] w-full overflow-hidden relative">
              <img
                src="/frames/04_innovation_hub.jpg"
                alt="Innovation Hub"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105 filter contrast-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0F] via-[#0D0D0F]/40 to-transparent" />
            </div>

            {/* Top Node HUD */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between font-mono text-[10px] text-[#F5F2EA] bg-[#050505]/80 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A16] animate-pulse" />
                <span>NODE 04 // TECH FEST EXPO ARENA & KEYNOTE STAGE</span>
              </div>
              <span className="text-emerald-400 font-bold">BROADCAST READY</span>
            </div>

            {/* Live Progress Bar Animating 0 -> 82% */}
            <div className="absolute bottom-6 left-6 right-6 bg-[#050505]/95 backdrop-blur-xl p-6 rounded-xl border border-white/10 space-y-3 shadow-2xl">
              <div className="flex justify-between items-center font-mono text-xs">
                <div>
                  <span className="text-[#8C8A84] block text-[10px]">COLLEGIATE ACCELERATION TELEMETRY</span>
                  <span className="text-[#F5F2EA] font-bold text-sm">Tech Showcase 2026 • 450 Attendees</span>
                </div>
                <span className="text-[#FF6A16] font-bold text-base">
                  {isInnovationInView ? '82% SHIPPED' : '0%'}
                </span>
              </div>
              
              <div className="w-full h-3 bg-[#141416] rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r from-[#FF6A16] via-[#FF8540] to-[#FFD400] rounded-full transition-all duration-1000 ease-out ${
                    isInnovationInView ? 'w-[82%]' : 'w-0'
                  }`}
                />
              </div>

              <div className="flex justify-between items-center text-[10px] font-mono text-[#8C8A84] pt-1">
                <span>✓ Hardware Validated</span>
                <span>✓ Cloud API Deployed</span>
                <span>✓ Stage Demos Configured</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 08: CLUBFLOW IN NUMBERS (Giant Editorial Numbers)
      ======================================================== */}
      <section className="py-28 px-6 sm:px-8 border-b border-white/8 bg-[#050505]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <span className="font-mono text-xs uppercase tracking-widest text-[#FFD400] font-bold">
              VERIFIABLE METRICS
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#F5F2EA] tracking-tight">
              CLUBFLOW IN NUMBERS
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-8 rounded-2xl bg-[#0D0D0F] border border-white/8 text-center space-y-2">
              <span className="text-5xl sm:text-7xl font-extrabold font-mono text-[#F5F2EA] block">
                <AnimatedCounter value={12} />
              </span>
              <span className="font-mono text-xs uppercase font-bold text-[#8C8A84] tracking-widest block">
                MEMBERS
              </span>
            </div>

            <div className="p-8 rounded-2xl bg-[#0D0D0F] border border-white/8 text-center space-y-2">
              <span className="text-5xl sm:text-7xl font-extrabold font-mono text-[#FF6A16] block">
                0<AnimatedCounter value={6} />
              </span>
              <span className="font-mono text-xs uppercase font-bold text-[#8C8A84] tracking-widest block">
                PROJECTS
              </span>
            </div>

            <div className="p-8 rounded-2xl bg-[#0D0D0F] border border-white/8 text-center space-y-2">
              <span className="text-5xl sm:text-7xl font-extrabold font-mono text-[#FFD400] block">
                <AnimatedCounter value={24} />
              </span>
              <span className="font-mono text-xs uppercase font-bold text-[#8C8A84] tracking-widest block">
                ACTIVE TASKS
              </span>
            </div>

            <div className="p-8 rounded-2xl bg-[#0D0D0F] border border-white/8 text-center space-y-2">
              <span className="text-5xl sm:text-7xl font-extrabold font-mono text-[#F5F2EA] block">
                <AnimatedCounter value={82} suffix="%" />
              </span>
              <span className="font-mono text-xs uppercase font-bold text-[#8C8A84] tracking-widest block">
                PROGRESS
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 09: CINEMATIC FRAME GALLERY (Interactive Mission Modules)
      ======================================================== */}
      <section id="gallery" ref={galleryRef} className="py-28 px-6 sm:px-8 border-b border-white/8 bg-[#0D0D0F]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="font-mono text-xs uppercase tracking-widest text-[#FF6A16] font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF6A16] animate-pulse" />
                ARCHITECTURAL MISSION MATRIX
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-[#F5F2EA] tracking-tight">
                THE CAMPUS LABS
              </h2>
            </div>
            <span className="font-mono text-xs text-[#8C8A84] bg-[#050505] px-3.5 py-1.5 rounded-lg border border-white/5">
              4 MISSION NODES SYNCHRONIZED
            </span>
          </div>

          {/* Asymmetric Offset Interactive HUD Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            {/* Frame 01: Vision Atrium Command Deck (Large) */}
            <motion.div style={{ y: gal1Y }} className="md:col-span-8 rounded-2xl overflow-hidden border border-white/15 relative h-96 sm:h-[440px] group bg-[#050505] shadow-2xl">
              <img
                src="/frames/01_vision_atrium.jpg"
                alt="Frame 01 Vision Atrium"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105 filter brightness-[0.75] group-hover:brightness-90 contrast-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
              
              {/* Corner Tech Reticles */}
              <div className="absolute top-3 left-3 text-[#FF6A16] font-mono text-[10px] font-bold">⌜ 01</div>
              <div className="absolute top-3 right-3 text-white/40 font-mono text-[10px]">ONLINE ⌝</div>
              <div className="absolute bottom-3 left-3 text-white/30 font-mono text-[10px]">⌞ LAT: 12ms</div>
              <div className="absolute bottom-3 right-3 text-[#FFD400] font-mono text-[10px]">SYNCED ⌟</div>

              {/* Top Banner HUD */}
              <div className="absolute top-6 left-6 right-6 flex items-center justify-between font-mono text-[10px] text-[#F5F2EA] bg-[#050505]/85 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-white/10">
                <span className="text-[#FF6A16] font-bold">[NODE 01 // EXECUTIVE ATRIUM]</span>
                <span className="text-zinc-300">CAMPUS COMMAND DECK</span>
              </div>

              {/* Floating Glassmorphism Telemetry Overlay */}
              <div className="absolute bottom-6 left-6 right-6 bg-[#050505]/95 backdrop-blur-xl p-4 sm:p-5 rounded-xl border border-white/10 space-y-2.5 shadow-2xl group-hover:border-[#FF6A16]/50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-[#F5F2EA]">Central Operations Hub</h3>
                    <p className="text-xs text-[#8C8A84]">Executive board initiative planning & telemetry stream</p>
                  </div>
                  <span className="font-mono text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
                    ● ACTIVE
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[10px] font-mono pt-1">
                  <div className="p-1.5 rounded bg-[#141416] border border-white/5">
                    <div className="text-[#8C8A84]">SQUADS</div>
                    <div className="font-bold text-[#F5F2EA]">14 Synced</div>
                  </div>
                  <div className="p-1.5 rounded bg-[#141416] border border-white/5">
                    <div className="text-[#8C8A84]">VELOCITY</div>
                    <div className="font-bold text-[#FF6A16]">94.2%</div>
                  </div>
                  <div className="p-1.5 rounded bg-[#141416] border border-white/5">
                    <div className="text-[#8C8A84]">CHARTERS</div>
                    <div className="font-bold text-[#FFD400]">06 Active</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Frame 02: Collaboration Lab (Small) */}
            <motion.div style={{ y: gal2Y }} className="md:col-span-4 rounded-2xl overflow-hidden border border-white/15 relative h-96 sm:h-[440px] group bg-[#050505] shadow-2xl">
              <img
                src="/frames/02_collaboration_lab.jpg"
                alt="Frame 02 Collaboration Lab"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105 filter brightness-[0.75] group-hover:brightness-90 contrast-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />

              {/* Corner Tech Reticles */}
              <div className="absolute top-3 left-3 text-[#FFD400] font-mono text-[10px] font-bold">⌜ 02</div>
              <div className="absolute top-3 right-3 text-white/40 font-mono text-[10px]">LAB ⌝</div>

              {/* Top Banner HUD */}
              <div className="absolute top-6 left-4 right-4 flex items-center justify-between font-mono text-[9px] text-[#F5F2EA] bg-[#050505]/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                <span className="text-[#FFD400] font-bold">[NODE 02 // SPRINT LAB]</span>
                <span className="text-zinc-400">ROBOTICS & DEV</span>
              </div>

              {/* Floating Glassmorphism Telemetry Overlay */}
              <div className="absolute bottom-6 left-4 right-4 bg-[#050505]/95 backdrop-blur-xl p-4 rounded-xl border border-white/10 space-y-2 shadow-2xl group-hover:border-[#FFD400]/50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-[#F5F2EA]">Squad Delta Dev Lab</h3>
                    <p className="text-[10px] text-[#8C8A84]">Autonomous Flight Core • Sprint #14</p>
                  </div>
                </div>
                <div className="p-2 rounded bg-[#141416] border border-white/5 font-mono text-[10px] space-y-1">
                  <div className="flex justify-between">
                    <span className="text-[#8C8A84]">Active Leads:</span>
                    <span className="text-[#F5F2EA] font-bold">Sarah & Rahul</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8C8A84]">Commits Today:</span>
                    <span className="text-[#FF6A16] font-bold">18 Merged</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Frame 03: Project Corridor (Medium) */}
            <motion.div style={{ y: gal3Y }} className="md:col-span-5 rounded-2xl overflow-hidden border border-white/15 relative h-96 sm:h-[440px] group bg-[#050505] shadow-2xl">
              <img
                src="/frames/03_project_corridor.jpg"
                alt="Frame 03 Project Corridor"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105 filter brightness-[0.75] group-hover:brightness-90 contrast-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />

              {/* Corner Tech Reticles */}
              <div className="absolute top-3 left-3 text-[#FF6A16] font-mono text-[10px] font-bold">⌜ 03</div>
              <div className="absolute top-3 right-3 text-white/40 font-mono text-[10px]">CORRIDOR ⌝</div>

              {/* Top Banner HUD */}
              <div className="absolute top-6 left-4 right-4 flex items-center justify-between font-mono text-[9px] text-[#F5F2EA] bg-[#050505]/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                <span className="text-[#FF6A16] font-bold">[NODE 03 // EMBEDDED BAY]</span>
                <span className="text-zinc-400">HARDWARE CORRIDOR</span>
              </div>

              {/* Floating Glassmorphism Telemetry Overlay */}
              <div className="absolute bottom-6 left-4 right-4 bg-[#050505]/95 backdrop-blur-xl p-4 rounded-xl border border-white/10 space-y-2 shadow-2xl group-hover:border-[#FF6A16]/50 transition-colors">
                <h3 className="text-xs sm:text-sm font-bold text-[#F5F2EA]">Drone & Sensor Calibration Bay</h3>
                <p className="text-[10px] text-[#8C8A84]">Telemetry sensors & PCB assembly line</p>
                <div className="p-2 rounded bg-[#141416] border border-white/5 font-mono text-[10px] flex justify-between items-center">
                  <span className="text-[#8C8A84]">Milestones 3/4 Verified</span>
                  <span className="text-[#FFD400] font-bold">82% Shipped</span>
                </div>
              </div>
            </motion.div>

            {/* Frame 04: Innovation Hub Stage (Large) */}
            <motion.div style={{ y: gal4Y }} className="md:col-span-7 rounded-2xl overflow-hidden border border-white/15 relative h-96 sm:h-[440px] group bg-[#050505] shadow-2xl">
              <img
                src="/frames/04_innovation_hub.jpg"
                alt="Frame 04 Innovation Hub"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105 filter brightness-[0.75] group-hover:brightness-90 contrast-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />

              {/* Corner Tech Reticles */}
              <div className="absolute top-3 left-3 text-[#FFD400] font-mono text-[10px] font-bold">⌜ 04</div>
              <div className="absolute top-3 right-3 text-emerald-400 font-mono text-[10px]">STAGE LIVE ⌝</div>

              {/* Top Banner HUD */}
              <div className="absolute top-6 left-6 right-6 flex items-center justify-between font-mono text-[10px] text-[#F5F2EA] bg-[#050505]/85 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-white/10">
                <span className="text-[#FFD400] font-bold">[NODE 04 // DEMO ARENA]</span>
                <span className="text-emerald-400">BROADCAST READY</span>
              </div>

              {/* Floating Glassmorphism Telemetry Overlay */}
              <div className="absolute bottom-6 left-6 right-6 bg-[#050505]/95 backdrop-blur-xl p-4 sm:p-5 rounded-xl border border-white/10 space-y-2.5 shadow-2xl group-hover:border-[#FFD400]/50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-[#F5F2EA]">University Main Stage & Expo Arena</h3>
                    <p className="text-xs text-[#8C8A84]">Collegiate showcase keynotes and live project demonstrations</p>
                  </div>
                  <span className="font-mono text-[10px] bg-[#FFD400]/20 text-[#FFD400] px-2 py-0.5 rounded border border-[#FFD400]/30 font-bold">
                    450+ ATTENDEES
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[10px] font-mono pt-1">
                  <div className="p-1.5 rounded bg-[#141416] border border-white/5">
                    <div className="text-[#8C8A84]">LIVE DEMOS</div>
                    <div className="font-bold text-[#F5F2EA]">12 Projects</div>
                  </div>
                  <div className="p-1.5 rounded bg-[#141416] border border-white/5">
                    <div className="text-[#8C8A84]">ACCELERATION</div>
                    <div className="font-bold text-[#FF6A16]">82% Ready</div>
                  </div>
                  <div className="p-1.5 rounded bg-[#141416] border border-white/5">
                    <div className="text-[#8C8A84]">KEYNOTE</div>
                    <div className="font-bold text-emerald-400">Scheduled</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 10: WHY CLUBFLOW (Pillars & Values)
      ======================================================== */}
      <section className="py-28 px-6 sm:px-8 border-b border-white/8 bg-[#050505]">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="space-y-3">
            <span className="font-mono text-xs uppercase tracking-widest text-[#FF6A16] font-bold">
              THE CLUBFLOW STANDARD
            </span>
            <h2 className="text-4xl sm:text-6xl font-extrabold text-[#F5F2EA] tracking-tight">
              LESS ADMIN.
              <span className="block text-[#FF6A16]">MORE BUILDING.</span>
            </h2>
          </div>

          <div className="space-y-4">
            {[
              'PROJECT OWNERSHIP',
              'TASK ACCOUNTABILITY',
              'CLEAR DEADLINES',
              'TEAM VISIBILITY',
              'REAL PROGRESS',
            ].map((pillar, i) => (
              <div key={i} className="p-5 rounded-xl bg-[#0D0D0F] border border-white/8 flex items-center justify-between hover:border-[#FF6A16]/30 transition-all">
                <span className="font-mono text-sm sm:text-base font-bold text-[#F5F2EA] tracking-wider">
                  {pillar}
                </span>
                <CheckCircle2 className="w-5 h-5 text-[#FFD400]" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 10.5: CAMPUS ACCESS & AUTHENTICATION PORTAL
      ======================================================== */}
      <section id="access-portal" className="py-28 px-6 sm:px-8 border-b border-white/8 bg-[#0D0D0F]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="font-mono text-xs uppercase tracking-widest text-[#FF6A16] font-bold flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF6A16] animate-pulse" />
              INTEGRATED ACCESS TERMINAL
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#F5F2EA] tracking-tight">
              ENTER THE WORKSPACE
            </h2>
            <p className="text-xs sm:text-sm text-[#8C8A84] leading-relaxed">
              Experience ClubFlow instantly with 1-click role presets, or authenticate with your club credentials.
            </p>
          </div>

          {/* 3 Quick Role Demo Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Admin Card */}
            <div className="p-6 rounded-2xl bg-[#050505] border border-white/10 hover:border-[#FF6A16]/50 transition-all space-y-4 flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#FF6A16]/10 text-[#FF6A16] border border-[#FF6A16]/20 font-bold">
                    PRESIDENT
                  </span>
                  <span className="font-mono text-xs text-[#8C8A84]">FULL GOVERNANCE</span>
                </div>
                <h3 className="text-lg font-bold text-[#F5F2EA]">Club Admin Portal</h3>
                <p className="text-xs text-[#8C8A84] leading-relaxed">
                  Manage roster approvals, create initiative charters, and monitor cross-squad velocity telemetry.
                </p>
              </div>

              <button
                onClick={() => fillCredentialsAndLogin('admin@clubflow.local')}
                className="w-full py-2.5 rounded-xl bg-[#141416] group-hover:bg-[#FF6A16] text-[#F5F2EA] group-hover:text-black font-extrabold text-xs transition-all border border-white/10 group-hover:border-[#FF6A16] flex items-center justify-center gap-2 shadow-md"
              >
                <span>Launch as Admin</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Lead Card */}
            <div className="p-6 rounded-2xl bg-[#050505] border border-white/10 hover:border-[#FFD400]/50 transition-all space-y-4 flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#FFD400]/10 text-[#FFD400] border border-[#FFD400]/20 font-bold">
                    SPRINT LEAD
                  </span>
                  <span className="font-mono text-xs text-[#8C8A84]">SQUAD COMMAND</span>
                </div>
                <h3 className="text-lg font-bold text-[#F5F2EA]">Project Lead Portal</h3>
                <p className="text-xs text-[#8C8A84] leading-relaxed">
                  Assign sprint deliverables, manage Kanban column workflows, and verify completed PRs.
                </p>
              </div>

              <button
                onClick={() => fillCredentialsAndLogin('lead.web@clubflow.local')}
                className="w-full py-2.5 rounded-xl bg-[#141416] group-hover:bg-[#FFD400] text-[#F5F2EA] group-hover:text-black font-extrabold text-xs transition-all border border-white/10 group-hover:border-[#FFD400] flex items-center justify-center gap-2 shadow-md"
              >
                <span>Launch as Project Lead</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Member Card */}
            <div className="p-6 rounded-2xl bg-[#050505] border border-white/10 hover:border-white/30 transition-all space-y-4 flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/10 text-white border border-white/20 font-bold">
                    CONTRIBUTOR
                  </span>
                  <span className="font-mono text-xs text-[#8C8A84]">DELIVERABLES</span>
                </div>
                <h3 className="text-lg font-bold text-[#F5F2EA]">Member Portal</h3>
                <p className="text-xs text-[#8C8A84] leading-relaxed">
                  View assigned tasks, update milestone progress with 1-click status toggles, and collaborate.
                </p>
              </div>

              <button
                onClick={() => fillCredentialsAndLogin('alex.member@clubflow.local')}
                className="w-full py-2.5 rounded-xl bg-[#141416] group-hover:bg-[#F5F2EA] text-[#F5F2EA] group-hover:text-black font-extrabold text-xs transition-all border border-white/10 group-hover:border-white flex items-center justify-center gap-2 shadow-md"
              >
                <span>Launch as Member</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Direct Custom Credentials Form Box */}
          <div className="max-w-xl mx-auto p-8 rounded-2xl bg-[#050505] border border-white/10 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/8">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#FF6A16]" />
                <span className="font-mono text-xs font-bold text-[#F5F2EA]">AUTHENTICATE WITH CREDENTIALS</span>
              </div>
              <span className="font-mono text-[10px] text-[#8C8A84]">SESSION ENCRYPTED</span>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#8C8A84] mb-1.5">
                  College Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@clubflow.local"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-[#141416] border border-white/10 rounded-xl text-[#F5F2EA] placeholder:text-zinc-600 focus:outline-none focus:border-[#FF6A16]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#8C8A84] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password123!"
                    className="w-full pl-10 pr-10 py-2.5 text-xs bg-[#141416] border border-white/10 rounded-xl text-[#F5F2EA] placeholder:text-zinc-600 focus:outline-none focus:border-[#FF6A16]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-zinc-500 hover:text-zinc-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-[#FF6A16] hover:bg-[#FF9D00] text-black font-extrabold text-xs transition-all shadow-xl hover:shadow-[#FF6A16]/30 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="animate-pulse">Authenticating Session...</span>
                ) : (
                  <>
                    <span>Enter Club Workspace</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 11: FINAL EXPERIENCE & CTA
      ======================================================== */}
      <section className="py-36 px-6 sm:px-8 bg-[#050505] relative overflow-hidden text-center">
        {/* Architectural backdrop subtle glow */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <img
            src="/frames/01_vision_atrium.jpg"
            alt="Vision Atrium Backdrop"
            className="w-full h-full object-cover object-center filter blur-lg"
          />
          <div className="absolute inset-0 bg-[#050505]/80" />
        </div>

        <div className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-[#FF6A16] to-transparent animate-travel-line" />

        <div className="max-w-3xl mx-auto space-y-8 relative z-10">
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[#F5F2EA] tracking-tight leading-tight">
            YOUR CLUB.
            <span className="block text-[#FF6A16]">IN MOTION.</span>
          </h2>

          <p className="text-sm sm:text-base text-[#8C8A84] max-w-xl mx-auto leading-relaxed">
            Everything your technical club needs to organize people, projects and progress.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleCtaClick}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#FF6A16] hover:bg-[#FF9D00] text-black text-sm font-extrabold transition-all shadow-xl hover:shadow-[#FF6A16]/30 flex items-center justify-center gap-2 hover:-translate-y-0.5"
            >
              <span>ENTER CLUBFLOW →</span>
            </button>
            <button
              onClick={() => scrollToSection('problem')}
              className="w-full sm:w-auto px-6 py-4 rounded-xl bg-[#141416] hover:bg-[#1C1C20] text-[#F5F2EA] text-sm font-bold border border-white/8 transition-all"
            >
              EXPLORE PLATFORM
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================
          FOOTER
      ======================================================== */}
      <footer className="py-12 px-6 sm:px-8 border-t border-white/8 bg-[#050505] text-xs text-[#8C8A84]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#FF6A16] to-[#FF9D00] flex items-center justify-center text-black font-extrabold text-xs">
              CF
            </div>
            <span className="font-bold text-[#F5F2EA]">ClubFlow</span>
            <span className="font-mono text-[10px] text-zinc-600">© 2026 ClubFlow</span>
          </div>

          <div className="flex items-center gap-6 font-medium">
            <button onClick={() => scrollToSection('problem')} className="hover:text-[#F5F2EA]">
              Platform
            </button>
            <button onClick={() => scrollToSection('projects')} className="hover:text-[#F5F2EA]">
              Projects
            </button>
            <button onClick={() => scrollToSection('teams')} className="hover:text-[#F5F2EA]">
              Teams
            </button>
            <button onClick={() => scrollToSection('workflow')} className="hover:text-[#F5F2EA]">
              How it works
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
