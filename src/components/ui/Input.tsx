import React from 'react';
import { cn } from '@/utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, id, ...props }, ref) => {
    const inputId = id || props.name;
    return (
      <div className="space-y-2 w-full">
        {label && (
          <label htmlFor={inputId} className="text-[11px] font-bold text-[#8B929D] uppercase tracking-wide">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            'flex h-10 w-full rounded border border-[#3A414B] bg-transparent px-3 py-2 text-sm text-white placeholder:text-[#5c6370] focus:outline-none focus:border-[#0D73ED] disabled:cursor-not-allowed disabled:opacity-50 transition-colors [color-scheme:dark]',
            error && 'border-red-500 focus:border-red-500',
            className
          )}
          {...props}
        />
        {error && <p className="text-sm font-medium text-red-500">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
