'use client';

import * as React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  id?: string;
  label?: string;
  className?: string;
}

export function Checkbox({ checked, onChange, id, label, className }: CheckboxProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        'flex cursor-pointer select-none items-center gap-2 text-sm',
        className,
      )}
    >
      <button
        type="button"
        id={id}
        role="checkbox"
        aria-checked={checked}
        onClick={() => onChange?.(!checked)}
        className={cn(
          'flex size-5 items-center justify-center rounded border transition-colors',
          checked
            ? 'border-primary bg-primary text-primary-foreground'
            : 'border-input bg-card',
        )}
      >
        {checked && <Check className="size-3.5" strokeWidth={3} />}
      </button>
      {label && <span>{label}</span>}
    </label>
  );
}
