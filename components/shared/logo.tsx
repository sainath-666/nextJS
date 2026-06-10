import { Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({
  className,
  showText = true,
  subtitle = true,
}: {
  className?: string;
  showText?: boolean;
  subtitle?: boolean;
}) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
        <Eye className="size-5" />
      </div>
      {showText && (
        <div className="leading-tight">
          <p className="font-bold tracking-tight text-foreground">AP Vision Care</p>
          {subtitle && (
            <p className="text-[11px] text-muted-foreground">
              Govt. of Andhra Pradesh
            </p>
          )}
        </div>
      )}
    </div>
  );
}
