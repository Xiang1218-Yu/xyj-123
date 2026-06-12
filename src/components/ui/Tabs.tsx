import { ReactNode, useState, useMemo } from 'react';
import { cn } from '@/lib/utils';

export type TabVariant = 'default' | 'pills' | 'underline';
export type TabSize = 'sm' | 'md' | 'lg';

export interface TabItem {
  key: string;
  label: ReactNode;
  disabled?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
}

interface TabsProps {
  items: TabItem[];
  activeKey?: string;
  defaultActiveKey?: string;
  onChange?: (key: string) => void;
  variant?: TabVariant;
  size?: TabSize;
  className?: string;
  tabClassName?: string;
  activeTabClassName?: string;
}

const variantStyles: Record<TabVariant, { base: string; active: string; inactive: string }> = {
  default: {
    base: '',
    active: 'bg-primary-800 text-white shadow-md',
    inactive: 'bg-white text-neutral-text hover:bg-primary-50 border border-primary-200',
  },
  pills: {
    base: '',
    active: 'bg-primary-100 text-primary-800 font-medium',
    inactive: 'text-neutral-muted hover:text-primary-800 hover:bg-primary-50',
  },
  underline: {
    base: 'border-b border-primary-100',
    active: 'text-primary-800 border-b-2 border-primary-800 -mb-px',
    inactive: 'text-neutral-muted hover:text-primary-800 border-b-2 border-transparent',
  },
};

const sizeStyles: Record<TabSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2 text-sm',
  lg: 'px-6 py-2.5 text-base',
};

export default function Tabs({
  items,
  activeKey,
  defaultActiveKey,
  onChange,
  variant = 'default',
  size = 'md',
  className,
  tabClassName,
  activeTabClassName,
}: TabsProps) {
  const [internalActiveKey, setInternalActiveKey] = useState<string>(
    defaultActiveKey || items[0]?.key || ''
  );

  const currentActiveKey = activeKey ?? internalActiveKey;

  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];

  const handleTabClick = (key: string) => {
    if (activeKey === undefined) {
      setInternalActiveKey(key);
    }
    onChange?.(key);
  };

  const tabList = useMemo(() => {
    if (variant === 'underline') {
      return 'flex gap-0';
    }
    return 'flex flex-wrap gap-2';
  }, [variant]);

  return (
    <div className={cn(variantStyle.base, className)}>
      <div className={tabList} role="tablist">
        {items.map((item) => {
          const isActive = item.key === currentActiveKey;
          const Icon = item.icon;

          return (
            <button
              key={item.key}
              role="tab"
              aria-selected={isActive}
              disabled={item.disabled}
              onClick={() => !item.disabled && handleTabClick(item.key)}
              className={cn(
                'inline-flex items-center gap-2 font-medium transition-all duration-200',
                variant === 'default' && 'rounded-lg',
                variant === 'pills' && 'rounded-lg',
                variant === 'underline' && 'px-4 py-2',
                sizeStyle,
                isActive
                  ? cn(variantStyle.active, activeTabClassName)
                  : variantStyle.inactive,
                item.disabled && 'opacity-50 cursor-not-allowed',
                !item.disabled && 'cursor-pointer',
                tabClassName
              )}
            >
              {Icon && <Icon className="w-4 h-4" />}
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
