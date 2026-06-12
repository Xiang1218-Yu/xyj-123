import { ReactNode } from 'react';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import Modal from './Modal';

export type ConfirmDialogType = 'warning' | 'danger' | 'success' | 'info';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: ReactNode;
  description?: ReactNode;
  type?: ConfirmDialogType;
  confirmText?: string;
  cancelText?: string;
  icon?: React.ComponentType<{ className?: string }>;
  showCancel?: boolean;
  confirmLoading?: boolean;
  confirmDisabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  content?: ReactNode;
}

const typeConfig: Record<
  ConfirmDialogType,
  { icon: typeof AlertTriangle; iconBg: string; iconColor: string; confirmButton: string }
> = {
  warning: {
    icon: AlertTriangle,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    confirmButton: 'bg-amber-500 hover:bg-amber-600',
  },
  danger: {
    icon: XCircle,
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    confirmButton: 'bg-red-500 hover:bg-red-600',
  },
  success: {
    icon: CheckCircle,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    confirmButton: 'bg-green-500 hover:bg-green-600',
  },
  info: {
    icon: Info,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    confirmButton: 'bg-primary-800 hover:bg-primary-700',
  },
};

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  type = 'warning',
  confirmText,
  cancelText = '取消',
  icon: CustomIcon,
  showCancel = true,
  confirmLoading = false,
  confirmDisabled = false,
  size = 'sm',
  className,
  content,
}: ConfirmDialogProps) {
  const config = typeConfig[type];
  const IconComponent = CustomIcon || config.icon;

  const defaultConfirmText: Record<ConfirmDialogType, string> = {
    warning: '确认',
    danger: '删除',
    success: '确定',
    info: '我知道了',
  };

  const handleConfirm = () => {
    if (confirmLoading || confirmDisabled) return;
    onConfirm();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size={size}
      showCloseButton={false}
      closeOnOverlayClick={!confirmLoading}
      closeOnEsc={!confirmLoading}
      className={className}
      bodyClassName="p-6"
      footer={
        <div className="flex items-center justify-end gap-3">
          {showCancel && (
            <button
              onClick={onClose}
              disabled={confirmLoading}
              className="btn-secondary"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={handleConfirm}
            disabled={confirmLoading || confirmDisabled}
            className={cn(
              'inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-white font-medium transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed',
              config.confirmButton
            )}
          >
            {confirmLoading && (
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            )}
            {confirmText || defaultConfirmText[type]}
          </button>
        </div>
      }
    >
      <div className="flex gap-4">
        <div
          className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
            config.iconBg
          )}
        >
          <IconComponent className={cn('w-6 h-6', config.iconColor)} />
        </div>
        <div className="flex-1 min-w-0">
          {typeof title === 'string' ? (
            <h3 className="font-serif text-lg font-semibold text-primary-900 mb-2">
              {title}
            </h3>
          ) : (
            <div className="mb-2">{title}</div>
          )}
          {description && typeof description === 'string' ? (
            <p className="text-sm text-neutral-muted leading-relaxed">
              {description}
            </p>
          ) : (
            description
          )}
          {content && <div className="mt-4">{content}</div>}
        </div>
      </div>
    </Modal>
  );
}
