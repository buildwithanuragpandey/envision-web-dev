import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'brand';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const variantStyles = {
    primary:
      'bg-[#FF6814] hover:bg-[#ff7d33] text-[#030304] font-bold shadow-glow-orange hover:shadow-glow-orange focus:ring-2 focus:ring-[#FF6814]/40 border border-[#FF6814]/40',
    brand:
      'bg-[#FF6814] hover:bg-[#ff7d33] text-[#030304] font-bold shadow-glow-orange focus:ring-2 focus:ring-[#FF6814]/40 border border-[#FF6814]/40',
    secondary:
      'bg-[#111114] hover:bg-[#18181C] text-[#F5F5F0] border border-white/10 hover:border-white/20 focus:ring-2 focus:ring-white/10',
    outline:
      'bg-[#0A0A0C]/80 hover:bg-[#141418] text-[#F5F5F0] border border-white/10 hover:border-[#FF6814]/40 shadow-subtle focus:ring-2 focus:ring-white/10',
    ghost:
      'bg-transparent hover:bg-white/5 text-[#A1A1A1] hover:text-[#F5F5F0] border border-transparent',
    danger:
      'bg-[#2A0C0E] hover:bg-[#3D1215] text-rose-300 border border-rose-900/50 shadow-sm focus:ring-2 focus:ring-rose-500/30',
  };

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 font-medium',
    md: 'text-xs px-3.5 py-2 gap-2 font-semibold',
    lg: 'text-sm px-4.5 py-2.5 gap-2 font-semibold',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};
