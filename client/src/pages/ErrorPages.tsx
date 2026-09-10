import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Compass } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export const UnauthorizedPage: React.FC = () => {
  const { role } = useAuth();

  const getHomePath = () => {
    if (role === 'ADMIN') return '/admin/dashboard';
    if (role === 'PROJECT_LEAD') return '/lead/dashboard';
    return '/member/dashboard';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 text-[#F5F5F0]"
    >
      <div className="w-14 h-14 rounded-lg bg-rose-950/40 text-rose-400 flex items-center justify-center mb-4 border border-rose-800/50 shadow-subtle">
        <ShieldAlert className="w-7 h-7" />
      </div>
      <span className="text-xs font-mono font-semibold uppercase tracking-wider text-rose-400 mb-1">
        Access Restricted • 403
      </span>
      <h1 className="text-2xl font-bold text-[#F5F5F0] tracking-tight">Permission Boundary</h1>
      <p className="text-xs text-zinc-400 max-w-md mt-2 mb-6">
        Your active role credentials do not possess the required RBAC privileges to access this workspace section.
      </p>
      <Link
        to={getHomePath()}
        className="btn-brand inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg"
      >
        <ArrowLeft className="w-4 h-4 text-black" />
        Return to Command Center
      </Link>
    </motion.div>
  );
};

export const NotFoundPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 text-[#F5F5F0]"
    >
      <div className="w-14 h-14 rounded-lg bg-[#111114] text-[#FF6814] flex items-center justify-center mb-4 border border-white/8 shadow-subtle">
        <Compass className="w-7 h-7" />
      </div>
      <span className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-500 mb-1">
        HTTP 404 • Not Found
      </span>
      <h1 className="text-2xl font-bold text-[#F5F5F0] tracking-tight">Resource Not Located</h1>
      <p className="text-xs text-zinc-400 max-w-sm mt-2 mb-6">
        The route or resource you are attempting to visit does not exist or has been relocated.
      </p>
      <Link
        to="/"
        className="btn-brand inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg"
      >
        <ArrowLeft className="w-4 h-4 text-black" />
        Back to Safety
      </Link>
    </motion.div>
  );
};
