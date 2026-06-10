import { Glasses, Store } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/status-badge';
import { OrderTimeline } from '@/components/shared/order-timeline';
import { SPECTACLE_ORDERS } from '@/lib/data';
import { formatDate } from '@/lib/utils';

const PATIENT_ID = 'PAT-100234';

export default function PatientSpectaclesPage() {
  const orders = SPECTACLE_ORDERS.filter((o) => o.patientId === PATIENT_ID);

  return (
    <>
      <PageHeader title="My Spectacles" description="Track your spectacle orders from manufacture to delivery" />

      {orders.length === 0 && (
        <Card><CardContent className="py-12 text-center text-sm text-muted-foreground">No spectacle orders yet.</CardContent></Card>
      )}

      <div className="space-y-6">
        {orders.map((o) => (
          <Card key={o.id}>
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Glasses className="size-4 text-primary" /> Order {o.id}
                </CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <Store className="size-3" /> {o.vendorName} · {o.frameType} ({o.frameSize})
                </CardDescription>
              </div>
              <StatusBadge status={o.status} />
            </CardHeader>
            <CardContent className="grid gap-8 md:grid-cols-2">
              <div>
                <h4 className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Tracking
                </h4>
                <OrderTimeline order={o} />
              </div>
              <div className="space-y-3 text-sm">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Details</h4>
                <div className="flex justify-between"><span className="text-muted-foreground">Order date</span><span className="font-medium">{formatDate(o.orderedAt)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Expected by</span><span className="font-medium">{formatDate(o.slaDeadline)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Right lens</span><span className="font-medium">{o.rightLensSph}/{o.rightLensCyl} × {o.rightLensAxis}°</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Left lens</span><span className="font-medium">{o.leftLensSph}/{o.leftLensCyl} × {o.leftLensAxis}°</span></div>
                {o.status === 'dispatched' && (
                  <div className="rounded-lg bg-primary/5 p-3 text-xs text-muted-foreground">
                    Your spectacles are on the way. You&apos;ll receive an OTP to confirm delivery.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
