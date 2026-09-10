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
          className={`p-2.5 rounded-lg shrink-0 ${
            variant === 'danger' ? 'bg-rose-950/40 text-rose-400 border border-rose-800/50' : 'bg-[#16161A] text-[#FF6814] border border-[#FF6814]/20'
          }`}
        >
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-zinc-300 leading-relaxed">{message}</p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-2.5 pt-4 border-t border-white/8">
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

export const ProgressBar: React.FC<{
  progress: number;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  animatedHighlight?: boolean;
}> = ({
  progress,
  showText = false,
  size = 'md',
  animatedHighlight = true,
}) => {
  const clamped = Math.min(100, Math.max(0, progress));

  const height = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-2.5',
  }[size];

  return (
    <div className="w-full">
      <div className={`w-full bg-[#111114] border border-white/5 rounded-full overflow-hidden ${height} relative`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={`${height} bg-gradient-to-r from-[#FF6814] to-[#FF8540] rounded-full relative`}
        >
          {animatedHighlight && clamped > 0 && (
            <div className="absolute top-0 right-0 bottom-0 w-2 bg-[#FFDD00] rounded-full opacity-90 shadow-glow-yellow" />
          )}
        </motion.div>
      </div>
      {showText && (
        <div className="flex justify-between items-center mt-1.5 text-[11px] font-mono text-zinc-400">
          <span>Progress</span>
          <span className="font-semibold text-[#FF6814]">{clamped}%</span>
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
    <div className="flex flex-col items-center justify-center p-10 text-center bg-[#0A0A0C] rounded-lg border border-white/8 my-4 shadow-subtle">
      {icon ? (
        <div className="p-3 bg-[#111114] text-[#FF6814] rounded-lg mb-3 border border-white/8">{icon}</div>
      ) : (
        <div className="p-3 bg-[#111114] text-[#FF6814] rounded-lg mb-3 border border-white/8">
          <Sparkles className="w-5 h-5" />
        </div>
      )}
      <h3 className="text-sm font-semibold text-[#F5F5F0] tracking-tight">{title}</h3>
      {description && <p className="text-xs text-zinc-400 max-w-sm mt-1 mb-4 leading-relaxed">{description}</p>}
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
};

export const Skeleton: React.FC<{ className?: string }> = ({ className = 'h-4 w-full' }) => {
  return (
    <div className={`relative overflow-hidden bg-[#111114] border border-white/5 rounded-lg ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    </div>
  );
};
