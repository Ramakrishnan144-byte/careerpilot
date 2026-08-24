import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline' | 'purple';
  size?: 'sm' | 'md' | 'lg';
}

export function Badge({
  children,
  className,
  variant = 'secondary',
  size = 'md',
  ...props
}: BadgeProps) {
  const variantStyles = {
    primary: 'bg-sky-50 text-sky-700 border-sky-200 border',
    secondary: 'bg-slate-100 text-slate-700 border-slate-200 border',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200 border',
    warning: 'bg-amber-50 text-amber-700 border-amber-200 border',
    danger: 'bg-rose-50 text-rose-700 border-rose-200 border',
    outline: 'bg-transparent text-slate-600 border-slate-300 border',
    purple: 'bg-purple-50 text-purple-700 border-purple-200 border',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs font-medium rounded-md',
    md: 'px-2.5 py-1 text-xs font-semibold rounded-md',
    lg: 'px-3 py-1.5 text-sm font-semibold rounded-lg',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium transition-colors',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
