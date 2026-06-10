import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDateTime } from '@/lib/utils';
import type { SpectacleOrder, SpectacleStatus } from '@/lib/types';

const STEPS: { status: SpectacleStatus; label: string; at: keyof SpectacleOrder }[] = [
  { status: 'pending', label: 'Order placed', at: 'orderedAt' },
  { status: 'manufacturing', label: 'Manufacturing', at: 'manufacturingStartedAt' },
  { status: 'qa', label: 'Quality check', at: 'qaClearedAt' },
  { status: 'dispatched', label: 'Dispatched', at: 'dispatchedAt' },
  { status: 'delivered', label: 'Delivered', at: 'deliveredAt' },
];

const ORDER: SpectacleStatus[] = ['pending', 'manufacturing', 'qa', 'dispatched', 'delivered'];

export function OrderTimeline({ order }: { order: SpectacleOrder }) {
  const currentIdx = ORDER.indexOf(order.status);

  return (
    <ol className="relative space-y-6 pl-8">
      {STEPS.map((step, i) => {
        const done = i <= currentIdx;
        const active = i === currentIdx;
        const at = order[step.at] as string | undefined;
        return (
          <li key={step.status} className="relative">
            {i < STEPS.length - 1 && (
              <span
                className={cn(
                  'absolute left-[-1.45rem] top-6 h-full w-0.5',
                  done ? 'bg-primary' : 'bg-border',
                )}
              />
            )}
            <span
              className={cn(
                'absolute left-[-2rem] flex size-6 items-center justify-center rounded-full border-2',
                done
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-card text-muted-foreground',
                active && 'ring-4 ring-primary/15',
              )}
            >
              {done ? <Check className="size-3.5" strokeWidth={3} /> : <span className="size-1.5 rounded-full bg-muted-foreground" />}
            </span>
            <p className={cn('text-sm font-medium', !done && 'text-muted-foreground')}>
              {step.label}
            </p>
            <p className="text-xs text-muted-foreground">{at ? formatDateTime(at) : 'Pending'}</p>
          </li>
        );
      })}
    </ol>
  );
}
