import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { Eye, EyeOff, Layers, Lock, Mail, ShieldCheck, UserCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
      // Auth context will update user and trigger redirection
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

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-brand-500 selection:text-white">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-brand-500/10 to-transparent blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 text-white shadow-xl shadow-brand-500/20 mb-4">
          <Layers className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Club<span className="text-brand-400">Flow</span>
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Role-Based Club & Project Management System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4 sm:px-0">
        <div className="bg-slate-900/90 border border-slate-800 backdrop-blur-xl py-8 px-6 shadow-2xl rounded-2xl sm:px-10">
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@clubflow.local"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-850 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all placeholder:text-slate-500"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-850 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all placeholder:text-slate-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-200"
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
                size="lg"
                className="w-full"
                isLoading={isLoading}
              >
                Sign In to Dashboard
              </Button>
            </div>
          </form>

          {/* Demo Quick Fill Switcher */}
          <div className="mt-6 pt-6 border-t border-slate-800">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider text-center mb-3">
              Quick Demo Logins (Click to Populate)
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillCredentials('admin@clubflow.local')}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-purple-500/50 text-slate-200 hover:text-white transition-all text-xs group"
              >
                <ShieldCheck className="w-4 h-4 text-purple-400 mb-1 group-hover:scale-110 transition-transform" />
                <span className="font-semibold">Admin</span>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials('lead@clubflow.local')}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-blue-500/50 text-slate-200 hover:text-white transition-all text-xs group"
              >
                <UserCheck className="w-4 h-4 text-blue-400 mb-1 group-hover:scale-110 transition-transform" />
                <span className="font-semibold">Lead</span>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials('member1@clubflow.local')}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/50 text-slate-200 hover:text-white transition-all text-xs group"
              >
                <UserCheck className="w-4 h-4 text-emerald-400 mb-1 group-hover:scale-110 transition-transform" />
                <span className="font-semibold">Member</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-500 text-center mt-2.5">
              Default password for all accounts: <code className="text-slate-300 font-mono">Password123!</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
