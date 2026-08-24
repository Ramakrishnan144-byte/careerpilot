import React from 'react';
import { cn } from '@/lib/utils';

export interface ProgressBarProps {
  value: number; // 0 - 100
  max?: number;
  label?: string;
  showValue?: boolean;
  colorVariant?: 'sky' | 'emerald' | 'amber' | 'rose' | 'purple' | 'auto';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showValue = true,
  colorVariant = 'auto',
  size = 'md',
  className,
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  let colorClass = 'bg-sky-500';
  if (colorVariant === 'auto') {
    if (percentage >= 80) colorClass = 'bg-emerald-500';
    else if (percentage >= 60) colorClass = 'bg-sky-500';
    else if (percentage >= 40) colorClass = 'bg-amber-500';
    else colorClass = 'bg-rose-500';
  } else {
    const map = {
      sky: 'bg-sky-500',
      emerald: 'bg-emerald-500',
      amber: 'bg-amber-500',
      rose: 'bg-rose-500',
      purple: 'bg-purple-500',
    };
    colorClass = map[colorVariant];
  }

  const heightStyles = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={cn('w-full', className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1.5 text-xs font-medium text-slate-700">
          <span>{label}</span>
          {showValue && <span className="font-semibold text-slate-900">{percentage}%</span>}
        </div>
      )}
      <div className={cn('w-full bg-slate-100 rounded-full overflow-hidden', heightStyles[size])}>
        <div
          className={cn('h-full transition-all duration-500 ease-out rounded-full', colorClass)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
