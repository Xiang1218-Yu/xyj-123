import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useRef, useEffect } from 'react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  showClear?: boolean;
  onClear?: () => void;
  onSearch?: (value: string) => void;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  autoFocus?: boolean;
}

const sizeMap = {
  sm: 'pl-9 pr-8 py-1.5 text-sm',
  md: 'pl-10 pr-10 py-2.5',
  lg: 'pl-12 pr-12 py-3 text-base',
};

const iconSizeMap = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-5 h-5',
};

export default function SearchInput({
  value,
  onChange,
  placeholder = '搜索...',
  className,
  inputClassName,
  showClear = true,
  onClear,
  onSearch,
  size = 'md',
  disabled = false,
  autoFocus = false,
}: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleClear = () => {
    onChange('');
    onClear?.();
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(value);
    }
    if (e.key === 'Escape' && value) {
      handleClear();
    }
  };

  return (
    <div className={cn('relative', className)}>
      <Search
        className={cn(
          'absolute left-3 top-1/2 -translate-y-1/2 text-primary-400 pointer-events-none',
          iconSizeMap[size]
        )}
      />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          'input-field',
          sizeMap[size],
          disabled && 'opacity-50 cursor-not-allowed',
          inputClassName
        )}
      />
      {showClear && value && !disabled && (
        <button
          type="button"
          onClick={handleClear}
          className={cn(
            'absolute right-3 top-1/2 -translate-y-1/2 text-primary-300 hover:text-primary-600 transition-colors',
            iconSizeMap[size]
          )}
          aria-label="清除搜索"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
