import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ActionButton {
  key: string;
  icon?: React.ComponentType<{ className?: string }>;
  label?: string;
  onClick?: () => void;
  variant?: 'default' | 'primary' | 'danger' | 'success' | 'warning';
  disabled?: boolean;
  href?: string;
  title?: string;
  size?: 'sm' | 'md';
}

interface ActionButtonsProps {
  actions: ActionButton[];
  align?: 'left' | 'center' | 'right';
  size?: 'sm' | 'md';
  className?: string;
}

const variantStyles: Record<string, string> = {
  default: 'text-primary-600 hover:bg-primary-100',
  primary: 'text-primary-800 hover:bg-primary-100',
  danger: 'text-red-500 hover:bg-red-50',
  success: 'text-green-600 hover:bg-green-50',
  warning: 'text-amber-600 hover:bg-amber-50',
};

const sizeStyles: Record<string, string> = {
  sm: 'p-1.5',
  md: 'p-2',
};

const iconSizeStyles: Record<string, string> = {
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
};

export default function ActionButtons({
  actions,
  align = 'right',
  size = 'md',
  className,
}: ActionButtonsProps) {
  const alignClass = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  }[align];

  return (
    <div className={cn('flex items-center gap-1', alignClass, className)}>
      {actions.map((action) => {
        const Icon = action.icon;
        const buttonSize = action.size || size;

        const buttonContent = (
          <>
            {Icon && <Icon className={iconSizeStyles[buttonSize]} />}
            {action.label && <span className={action.icon ? 'ml-1' : ''}>{action.label}</span>}
          </>
        );

        const baseClass = cn(
          'inline-flex items-center rounded-lg transition-colors',
          action.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
          sizeStyles[buttonSize],
          variantStyles[action.variant || 'default']
        );

        if (action.href) {
          return (
            <a
              key={action.key}
              href={action.href}
              className={baseClass}
              title={action.title}
              onClick={(e) => {
                if (action.disabled) {
                  e.preventDefault();
                }
              }}
            >
              {buttonContent}
            </a>
          );
        }

        return (
          <button
            key={action.key}
            onClick={action.onClick}
            disabled={action.disabled}
            className={baseClass}
            title={action.title}
          >
            {buttonContent}
          </button>
        );
      })}
    </div>
  );
}
