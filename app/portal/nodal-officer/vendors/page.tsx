import { Star, Phone, Mail, Store } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { StatusBadge } from '@/components/shared/status-badge';
import { VENDORS } from '@/lib/data';
import { percent } from '@/lib/utils';

const DISTRICT = 'Guntur';

export default function NodalVendorsPage() {
  // Local vendor + a couple of nearby vendors used for overflow capacity.
  const vendors = VENDORS.filter((v) => v.district === DISTRICT || v.activeOrders > 60);

  return (
    <>
      <PageHeader
        title="Vendor Coordination"
        description={`Spectacle vendors serving ${DISTRICT} district`}
      />

      <div className="grid gap-4 md:grid-cols-2">
        {vendors.map((v) => {
          const slaCompliance = 100 - percent(v.slaBreaches, v.fulfilledOrders || 1);
          return (
            <Card key={v.id}>
              <CardContent className="space-y-4 p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
                      <Store className="size-5" />
                    </div>
                    <div>
                      <p className="font-semibold">{v.name}</p>
                      <p className="text-xs text-muted-foreground">{v.district}</p>
                    </div>
                  </div>
                  <StatusBadge status={v.status} />
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-lg bg-secondary/50 p-2">
                    <p className="text-lg font-bold">{v.activeOrders}</p>
                    <p className="text-[11px] text-muted-foreground">Active</p>
                  </div>
                  <div className="rounded-lg bg-secondary/50 p-2">
                    <p className="text-lg font-bold">{v.capacityPerDay}</p>
                    <p className="text-[11px] text-muted-foreground">Cap/day</p>
                  </div>
                  <div className="rounded-lg bg-secondary/50 p-2">
                    <p className="inline-flex items-center gap-0.5 text-lg font-bold">
                      <Star className="size-3.5 fill-warning text-warning" />{v.rating.toFixed(1)}
                    </p>
                    <p className="text-[11px] text-muted-foreground">Rating</p>
                  </div>
                </div>

                <div>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-muted-foreground">SLA compliance</span>
                    <span className="font-medium">{slaCompliance}%</span>
                  </div>
                  <Progress value={slaCompliance} indicatorClassName={slaCompliance > 95 ? 'bg-success' : 'bg-warning'} />
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Phone className="size-3" /> {v.mobile}</span>
                  <span className="flex items-center gap-1 truncate"><Mail className="size-3" /> {v.email}</span>
                </div>

                <Button variant="outline" size="sm" className="w-full">Contact vendor</Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}
