import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Package } from 'lucide-react';

export type EmptyVariant = 'default' | 'search' | 'error' | 'success';

interface EmptyProps {
  title?: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  variant?: EmptyVariant;
  action?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  iconClassName?: string;
}

const variantIconBg: Record<EmptyVariant, string> = {
  default: 'bg-primary-50',
  search: 'bg-primary-50',
  error: 'bg-red-50',
  success: 'bg-green-50',
};

const variantIconColor: Record<EmptyVariant, string> = {
  default: 'text-primary-400',
  search: 'text-primary-400',
  error: 'text-red-400',
  success: 'text-green-400',
};

const sizeMap = {
  sm: {
    icon: 'w-10 h-10',
    iconWrapper: 'w-12 h-12',
    title: 'text-base',
    description: 'text-sm',
  },
  md: {
    icon: 'w-14 h-14',
    iconWrapper: 'w-16 h-16',
    title: 'text-lg',
    description: 'text-sm',
  },
  lg: {
    icon: 'w-20 h-20',
    iconWrapper: 'w-24 h-24',
    title: 'text-xl',
    description: 'text-base',
  },
};

export default function Empty({
  title,
  description,
  icon: Icon,
  variant = 'default',
  action,
  size = 'md',
  className,
  iconClassName,
}: EmptyProps) {
  const sizes = sizeMap[size];
  const IconComponent = Icon || Package;

  const defaultTitle: Record<EmptyVariant, string> = {
    default: '暂无数据',
    search: '未找到匹配结果',
    error: '加载失败',
    success: '暂无内容',
  };

  const defaultDescription: Record<EmptyVariant, string> = {
    default: '还没有任何内容，添加一些吧',
    search: '试试其他关键词',
    error: '请稍后再试',
    success: '',
  };

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 text-center',
        className
      )}
    >
      <div
        className={cn(
          'rounded-full flex items-center justify-center mb-4',
          variantIconBg[variant],
          sizes.iconWrapper
        )}
      >
        <IconComponent
          className={cn(sizes.icon, variantIconColor[variant], iconClassName)}
        />
      </div>
      {(title || defaultTitle[variant]) && (
        <h3
          className={cn(
            'font-medium text-primary-900 mb-2',
            sizes.title
          )}
        >
          {title || defaultTitle[variant]}
        </h3>
      )}
      {(description || defaultDescription[variant]) && (
        <p
          className={cn(
            'text-neutral-muted max-w-md',
            sizes.description
          )}
        >
          {description || defaultDescription[variant]}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
