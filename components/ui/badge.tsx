import * as React from 'react';
import { cn } from '@/lib/utils';

const variants = {
  default: 'bg-primary/10 text-primary border-primary/20',
  secondary: 'bg-secondary text-secondary-foreground border-transparent',
  success: 'bg-success/10 text-success border-success/20',
  warning: 'bg-warning/10 text-[hsl(var(--warning))] border-warning/20',
  destructive: 'bg-destructive/10 text-destructive border-destructive/20',
  outline: 'text-foreground border-border',
} as const;

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof variants;
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
