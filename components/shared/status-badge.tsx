import { Badge, type BadgeProps } from '@/components/ui/badge';

type Variant = NonNullable<BadgeProps['variant']>;

const STATUS_MAP: Record<string, { label: string; variant: Variant }> = {
  // EMR / approval
  draft: { label: 'Draft', variant: 'secondary' },
  submitted: { label: 'Submitted', variant: 'warning' },
  approved: { label: 'Approved', variant: 'success' },
  rejected: { label: 'Rejected', variant: 'destructive' },
  // EMR outcomes
  normal: { label: 'Normal', variant: 'success' },
  spectacles: { label: 'Spectacles', variant: 'default' },
  teleconsult: { label: 'Teleconsult', variant: 'warning' },
  referral: { label: 'Referral', variant: 'destructive' },
  // Camps
  scheduled: { label: 'Scheduled', variant: 'secondary' },
  active: { label: 'Active', variant: 'success' },
  completed: { label: 'Completed', variant: 'default' },
  // Spectacle orders
  pending: { label: 'Pending', variant: 'secondary' },
  manufacturing: { label: 'Manufacturing', variant: 'warning' },
  qa: { label: 'QA', variant: 'warning' },
  dispatched: { label: 'Dispatched', variant: 'default' },
  delivered: { label: 'Delivered', variant: 'success' },
  // Teleconsult
  waiting: { label: 'Waiting', variant: 'warning' },
  cancelled: { label: 'Cancelled', variant: 'destructive' },
  // Referral priority
  critical: { label: 'Critical', variant: 'destructive' },
  high: { label: 'High', variant: 'warning' },
  routine: { label: 'Routine', variant: 'secondary' },
  verified: { label: 'Verified', variant: 'success' },
  // Vendors / teams
  suspended: { label: 'Suspended', variant: 'destructive' },
  onboarding: { label: 'Onboarding', variant: 'warning' },
  idle: { label: 'Idle', variant: 'secondary' },
  offline: { label: 'Offline', variant: 'destructive' },
};

export function StatusBadge({ status }: { status: string }) {
  const entry = STATUS_MAP[status] ?? { label: status, variant: 'secondary' as Variant };
  return <Badge variant={entry.variant}>{entry.label}</Badge>;
}
