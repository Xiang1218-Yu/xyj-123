import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type StatCardVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ComponentType<{ className?: string }>;
  variant?: StatCardVariant;
  trend?: {
    value: number;
    label?: string;
  };
  description?: string;
  onClick?: () => void;
  className?: string;
  valueClassName?: string;
  labelClassName?: string;
}

const variantBgMap: Record<StatCardVariant, string> = {
  default: 'from-primary-500 to-primary-700',
  primary: 'from-primary-500 to-primary-700',
  success: 'from-green-500 to-green-700',
  warning: 'from-amber-400 to-amber-600',
  error: 'from-red-500 to-red-700',
  info: 'from-blue-500 to-blue-700',
};

const variantTextMap: Record<StatCardVariant, string> = {
  default: 'text-primary-900',
  primary: 'text-primary-900',
  success: 'text-green-700',
  warning: 'text-amber-700',
  error: 'text-red-700',
  info: 'text-blue-700',
};

export default function StatCard({
  label,
  value,
  icon: Icon,
  variant = 'default',
  trend,
  description,
  onClick,
  className,
  valueClassName,
  labelClassName,
}: StatCardProps) {
  const isClickable = !!onClick;

  return (
    <div
      className={cn(
        'bg-white rounded-2xl shadow-card border border-primary-100 p-5 transition-all duration-200',
        isClickable && 'cursor-pointer hover:shadow-card-hover hover:-translate-y-0.5',
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              'text-sm text-neutral-muted mb-1 truncate',
              labelClassName
            )}
          >
            {label}
          </p>
          <p
            className={cn(
              'text-2xl font-bold font-serif truncate',
              variantTextMap[variant],
              valueClassName
            )}
          >
            {value}
          </p>
          {description && (
            <p className="text-xs text-neutral-muted mt-2 line-clamp-2">
              {description}
            </p>
          )}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span
                className={cn(
                  'text-xs font-medium',
                  trend.value >= 0 ? 'text-green-600' : 'text-red-600'
                )}
              >
                {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              {trend.label && (
                <span className="text-xs text-neutral-muted">
                  {trend.label}
                </span>
              )}
            </div>
          )}
        </div>
        {Icon && (
          <div
            className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br flex-shrink-0 ml-3',
              variantBgMap[variant]
            )}
          >
            <Icon className="w-5 h-5 text-white" />
          </div>
        )}
      </div>
    </div>
  );
}
