import { useEffect, ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  size?: ModalSize;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  className?: string;
  contentClassName?: string;
  bodyClassName?: string;
  headerClassName?: string;
  footerClassName?: string;
}

const sizeMap: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-6xl',
};

export default function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEsc = true,
  className,
  contentClassName,
  bodyClassName,
  headerClassName,
  footerClassName,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open || !closeOnEsc) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, closeOnEsc, onClose]);

  if (!open) return null;

  const hasHeader = !!title || showCloseButton;
  const hasFooter = !!footer;

  const bodyMaxHeight = hasHeader && hasFooter
    ? 'calc(90vh - 130px)'
    : hasHeader || hasFooter
      ? 'calc(90vh - 65px)'
      : '90vh';

  return (
    <div className={cn('fixed inset-0 z-50 flex items-center justify-center', className)}>
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={() => closeOnOverlayClick && onClose()}
      />
      <div
        className={cn(
          'relative bg-white rounded-2xl shadow-2xl w-full mx-4 max-h-[90vh] overflow-hidden animate-scale-in',
          sizeMap[size],
          contentClassName
        )}
      >
        {hasHeader && (
          <div
            className={cn(
              'flex items-center justify-between px-6 py-4 border-b border-primary-100',
              headerClassName
            )}
          >
            <div className="flex-1 min-w-0">
              {typeof title === 'string' ? (
                <h3 className="font-serif text-lg font-semibold text-primary-900">
                  {title}
                </h3>
              ) : (
                title
              )}
            </div>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 text-neutral-muted hover:text-neutral-text hover:bg-primary-50 rounded-lg transition-colors ml-4 flex-shrink-0"
                aria-label="关闭"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        <div
          className={cn(
            'overflow-y-auto',
            hasHeader ? '' : 'rounded-t-2xl',
            hasFooter ? '' : 'rounded-b-2xl',
            bodyClassName
          )}
          style={{ maxHeight: bodyMaxHeight }}
        >
          {children}
        </div>

        {hasFooter && (
          <div
            className={cn(
              'px-6 py-4 border-t border-primary-100 bg-primary-50/50',
              footerClassName
            )}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
