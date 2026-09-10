import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle } from 'lucide-react';

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
      <div className="flex items-start gap-4">
        <div
          className={`p-2.5 rounded-full flex-shrink-0 ${
            variant === 'danger' ? 'bg-rose-100 text-rose-600' : 'bg-brand-100 text-brand-600'
          }`}
        >
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-slate-600">{message}</p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
        <Button variant="outline" size="md" onClick={onClose} disabled={isLoading}>
          {cancelText}
        </Button>
        <Button
          variant={variant === 'danger' ? 'danger' : 'primary'}
          size="md"
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
    lg: 'h-3',
  }[size];

  // Dynamic color based on completion percentage
  let barColor = 'bg-brand-500';
  if (clamped < 25) barColor = 'bg-amber-500';
  else if (clamped < 70) barColor = 'bg-blue-500';
  else barColor = 'bg-emerald-500';

  return (
    <div className="w-full">
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${height}`}>
        <div
          className={`${height} ${barColor} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showText && (
        <div className="flex justify-between items-center mt-1 text-xs text-slate-500 font-medium">
          <span>Progress</span>
          <span>{clamped}%</span>
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
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-xl border border-dashed border-slate-200 my-4">
      {icon && <div className="p-3 bg-slate-50 text-slate-400 rounded-2xl mb-3">{icon}</div>}
      <h3 className="text-base font-semibold text-slate-800">{title}</h3>
      {description && <p className="text-sm text-slate-500 max-w-sm mt-1 mb-4">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
};

export const Skeleton: React.FC<{ className?: string }> = ({ className = 'h-4 w-full' }) => {
  return <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`} />;
};
