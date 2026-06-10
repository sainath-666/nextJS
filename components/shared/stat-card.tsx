import type { LucideIcon } from 'lucide-react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function StatCard({
  label,
  value,
  icon: Icon,
  delta,
  hint,
  tone = 'primary',
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  delta?: number;
  hint?: string;
  tone?: 'primary' | 'accent' | 'success' | 'warning' | 'destructive';
}) {
  const toneClasses: Record<string, string> = {
    primary: 'bg-primary/10 text-primary',
    accent: 'bg-accent/10 text-accent',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-[hsl(var(--warning))]',
    destructive: 'bg-destructive/10 text-destructive',
  };
  return (
    <Card>
      <CardContent className="flex items-start justify-between gap-4 p-5">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
          {(delta !== undefined || hint) && (
            <div className="mt-2 flex items-center gap-2 text-xs">
              {delta !== undefined && (
                <span
                  className={cn(
                    'inline-flex items-center gap-0.5 font-medium',
                    delta >= 0 ? 'text-success' : 'text-destructive',
                  )}
                >
                  {delta >= 0 ? (
                    <ArrowUpRight className="size-3" />
                  ) : (
                    <ArrowDownRight className="size-3" />
                  )}
                  {Math.abs(delta)}%
                </span>
              )}
              {hint && <span className="text-muted-foreground">{hint}</span>}
            </div>
          )}
        </div>
        <div className={cn('rounded-lg p-2.5', toneClasses[tone])}>
          <Icon className="size-5" />
        </div>
      </CardContent>
    </Card>
  );
}
