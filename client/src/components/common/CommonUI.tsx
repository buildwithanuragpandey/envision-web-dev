import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary';
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="sm">
      <div className="flex items-start gap-3.5">
        <div
          className={`p-2.5 rounded-xl shrink-0 ${
            variant === 'danger' ? 'bg-rose-50 text-rose-600' : 'bg-zinc-100 text-zinc-900'
          }`}
        >
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-zinc-600 leading-relaxed">{message}</p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-2.5 pt-4 border-t border-zinc-100">
        <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
          {cancelText}
        </Button>
        <Button
          variant={variant === 'danger' ? 'danger' : 'primary'}
          size="sm"
          onClick={onConfirm}
          isLoading={isLoading}
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
};

export const ProgressBar: React.FC<{ progress: number; showText?: boolean; size?: 'sm' | 'md' | 'lg' }> = ({
  progress,
  showText = false,
  size = 'md',
}) => {
  const clamped = Math.min(100, Math.max(0, progress));

  const height = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-2.5',
  }[size];

  return (
    <div className="w-full">
      <div className={`w-full bg-zinc-100 rounded-full overflow-hidden ${height} relative`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={`${height} bg-zinc-900 rounded-full`}
        />
      </div>
      {showText && (
        <div className="flex justify-between items-center mt-1.5 text-[11px] font-mono text-zinc-500">
          <span>Completion</span>
          <span className="font-semibold text-zinc-900">{clamped}%</span>
        </div>
      )}
    </div>
  );
};

export const EmptyState: React.FC<{
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}> = ({ icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-zinc-200/80 my-4 shadow-subtle">
      {icon ? (
        <div className="p-3 bg-zinc-50 text-zinc-400 rounded-2xl mb-3 border border-zinc-100">{icon}</div>
      ) : (
        <div className="p-3 bg-zinc-50 text-zinc-400 rounded-2xl mb-3 border border-zinc-100">
          <Sparkles className="w-6 h-6" />
        </div>
      )}
      <h3 className="text-sm font-bold text-zinc-900 tracking-tight">{title}</h3>
      {description && <p className="text-xs text-zinc-500 max-w-sm mt-1 mb-4 leading-relaxed">{description}</p>}
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
};

export const Skeleton: React.FC<{ className?: string }> = ({ className = 'h-4 w-full' }) => {
  return (
    <div className={`relative overflow-hidden bg-zinc-200/70 rounded-xl ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
    </div>
  );
};
