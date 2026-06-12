import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface DataTableColumn<T> {
  key: string;
  title: ReactNode;
  dataIndex?: keyof T;
  render?: (record: T, index: number) => ReactNode;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  className?: string;
  ellipsis?: boolean;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  rowKey: keyof T | ((record: T) => string);
  loading?: boolean;
  emptyText?: string;
  emptyIcon?: React.ComponentType<{ className?: string }>;
  emptyDescription?: string;
  onRowClick?: (record: T, index: number) => void;
  rowClassName?: string | ((record: T, index: number) => string);
  showHeader?: boolean;
  bordered?: boolean;
  size?: 'sm' | 'md' | 'lg';
  footer?: ReactNode;
  className?: string;
  tableClassName?: string;
  scrollable?: boolean;
}

const sizeMap = {
  sm: 'px-3 py-2',
  md: 'px-4 py-3',
  lg: 'px-6 py-4',
};

const sizeMapBody = {
  sm: 'px-3 py-3',
  md: 'px-4 py-4',
  lg: 'px-6 py-5',
};

function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  rowKey,
  loading = false,
  emptyText = '暂无数据',
  emptyIcon: EmptyIcon,
  emptyDescription,
  onRowClick,
  rowClassName,
  showHeader = true,
  size = 'md',
  footer,
  className,
  tableClassName,
  scrollable = true,
}: DataTableProps<T>) {
  const getRowKey = (record: T, index: number): string => {
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    const value = record[rowKey as string];
    return String(value ?? index);
  };

  const getRowClassName = (record: T, index: number): string => {
    if (typeof rowClassName === 'function') {
      return rowClassName(record, index);
    }
    return rowClassName || '';
  };

  const alignClass = (align?: 'left' | 'center' | 'right') => {
    switch (align) {
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      default:
        return 'text-left';
    }
  };

  return (
    <div className={cn('card overflow-hidden', className)}>
      <div className={cn(scrollable && 'overflow-x-auto')}>
        <table className={cn('w-full', tableClassName)}>
          {showHeader && (
            <thead>
              <tr className="border-b border-primary-100 bg-primary-50/30">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    style={col.width ? { width: typeof col.width === 'number' ? `${col.width}px` : col.width } : undefined}
                    className={cn(
                      'text-sm font-medium text-neutral-muted whitespace-nowrap',
                      sizeMap[size],
                      alignClass(col.align),
                      col.className
                    )}
                  >
                    {col.title}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody className="divide-y divide-primary-50">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className={cn('text-center', sizeMapBody[size])}>
                  <div className="py-8 flex items-center justify-center">
                    <div className="w-8 h-8 border-3 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className={cn(sizeMapBody[size])}>
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    {EmptyIcon ? (
                      <EmptyIcon className="w-14 h-14 text-primary-300 mb-3" />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-primary-50 flex items-center justify-center mb-3">
                        <svg
                          className="w-7 h-7 text-primary-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                          />
                        </svg>
                      </div>
                    )}
                    <p className="text-neutral-muted font-medium">{emptyText}</p>
                    {emptyDescription && (
                      <p className="text-sm text-neutral-muted mt-1">{emptyDescription}</p>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              data.map((record, index) => {
                const key = getRowKey(record, index);
                const isClickable = !!onRowClick;
                return (
                  <tr
                    key={key}
                    className={cn(
                      'transition-colors',
                      isClickable && 'cursor-pointer hover:bg-primary-50/30',
                      !isClickable && 'hover:bg-primary-50/30',
                      getRowClassName(record, index)
                    )}
                    onClick={() => onRowClick?.(record, index)}
                  >
                    {columns.map((col) => {
                      let content: ReactNode;
                      if (col.render) {
                        content = col.render(record, index);
                      } else if (col.dataIndex !== undefined) {
                        const value = record[col.dataIndex as string];
                        content = value != null ? String(value) : '-';
                      } else {
                        content = null;
                      }
                      return (
                        <td
                          key={col.key}
                          className={cn(
                            'text-sm',
                            sizeMapBody[size],
                            alignClass(col.align),
                            col.ellipsis && 'max-w-[200px] truncate',
                            col.className
                          )}
                          style={col.width ? { width: typeof col.width === 'number' ? `${col.width}px` : col.width } : undefined}
                        >
                          {col.ellipsis ? (
                            <span className="block truncate">{content}</span>
                          ) : (
                            content
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {footer && (
        <div className="px-4 py-3 border-t border-primary-100 bg-primary-50/30 text-sm text-neutral-muted">
          {footer}
        </div>
      )}
    </div>
  );
}

export default DataTable;
