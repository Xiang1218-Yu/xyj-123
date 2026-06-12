import { cn } from '@/lib/utils';

export type StatusBadgeVariant = 
  | 'default'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'neutral';

export type StatusBadgeSize = 'sm' | 'md';

interface StatusBadgeProps {
  children: React.ReactNode;
  variant?: StatusBadgeVariant;
  size?: StatusBadgeSize;
  icon?: React.ReactNode;
  className?: string;
}

const variantStyles: Record<StatusBadgeVariant, string> = {
  default: 'bg-primary-100 text-primary-800 border border-primary-200',
  success: 'bg-green-100 text-green-700 border border-green-200',
  warning: 'bg-amber-100 text-amber-700 border border-amber-200',
  error: 'bg-red-100 text-red-700 border border-red-200',
  info: 'bg-blue-100 text-blue-700 border border-blue-200',
  neutral: 'bg-gray-100 text-gray-600 border border-gray-200',
};

const sizeStyles: Record<StatusBadgeSize, string> = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-3 py-1 text-xs',
};

export default function StatusBadge({
  children,
  variant = 'default',
  size = 'md',
  icon,
  className,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'status-badge',
        'inline-flex items-center gap-1.5 font-medium rounded-full border',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
}
