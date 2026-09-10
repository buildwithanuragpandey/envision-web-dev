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
      className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6"
    >
      <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center mb-4 border border-rose-500/20 shadow-subtle">
        <ShieldAlert className="w-7 h-7" />
      </div>
      <span className="text-xs font-mono font-semibold uppercase tracking-wider text-rose-600 mb-1">
        Access Denied • 403
      </span>
      <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Permission Boundary</h1>
      <p className="text-sm text-surface-500 max-w-md mt-2 mb-6">
        Your active role credentials do not possess the required RBAC privileges to access this resource.
      </p>
      <Link
        to={getHomePath()}
        className="inline-flex items-center gap-2 px-4 py-2 bg-surface-900 hover:bg-surface-800 text-surface-0 text-xs font-semibold rounded-lg transition-all shadow-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Dashboard
      </Link>
    </motion.div>
  );
};

export const NotFoundPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6"
    >
      <div className="w-14 h-14 rounded-2xl bg-surface-100 text-surface-600 flex items-center justify-center mb-4 border border-border shadow-subtle">
        <Compass className="w-7 h-7" />
      </div>
      <span className="text-xs font-mono font-semibold uppercase tracking-wider text-surface-400 mb-1">
        HTTP 404 • Not Found
      </span>
      <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Resource Not Located</h1>
      <p className="text-sm text-surface-500 max-w-sm mt-2 mb-6">
        The route or resource you are attempting to visit does not exist or has been relocated.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-lg transition-all shadow-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Safety
      </Link>
    </motion.div>
  );
};
