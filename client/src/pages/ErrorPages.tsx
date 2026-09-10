import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const UnauthorizedPage: React.FC = () => {
  const { role } = useAuth();

  const getHomePath = () => {
    if (role === 'ADMIN') return '/admin/dashboard';
    if (role === 'PROJECT_LEAD') return '/lead/dashboard';
    return '/member/dashboard';
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 shadow-sm border border-rose-100">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h1 className="text-2xl font-extrabold text-slate-900">403 – Access Forbidden</h1>
      <p className="text-sm text-slate-500 max-w-md mt-2 mb-6">
        You do not have the required permissions to access this administrative resource. Role-Based
        Access Control (RBAC) has enforced this boundary.
      </p>
      <Link
        to={getHomePath()}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all shadow-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to My Dashboard
      </Link>
    </div>
  );
};

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-4xl font-extrabold text-slate-900">404</h1>
      <p className="text-base font-semibold text-slate-700 mt-2">Page Not Found</p>
      <p className="text-xs text-slate-500 max-w-sm mt-1 mb-6">
        The page you are trying to visit does not exist or has moved.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl transition-all shadow-sm"
      >
        Back to Safety
      </Link>
    </div>
  );
};
