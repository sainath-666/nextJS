import { Plus, Star } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { StatCard } from '@/components/shared/stat-card';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/components/shared/status-badge';
import { VENDORS } from '@/lib/data';
import { formatNumber } from '@/lib/utils';
import { Store, PackageCheck, AlertTriangle } from 'lucide-react';

export default function AdminVendorsPage() {
  const active = VENDORS.filter((v) => v.status === 'active').length;
  const fulfilled = VENDORS.reduce((s, v) => s + v.fulfilledOrders, 0);
  const breaches = VENDORS.reduce((s, v) => s + v.slaBreaches, 0);

  return (
    <>
      <PageHeader
        title="Vendor Management"
        description="Spectacle manufacturing vendors & SLA performance"
        actions={
          <Button>
            <Plus /> Onboard Vendor
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Active Vendors" value={active} icon={Store} tone="primary" />
        <StatCard label="Orders Fulfilled" value={formatNumber(fulfilled)} icon={PackageCheck} tone="success" />
        <StatCard label="Total SLA Breaches" value={breaches} icon={AlertTriangle} tone="destructive" />
      </div>

      <Card>
        <CardContent className="px-0 py-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor</TableHead>
                <TableHead>District</TableHead>
                <TableHead className="text-right">Capacity/day</TableHead>
                <TableHead className="text-right">Active</TableHead>
                <TableHead className="text-right">Fulfilled</TableHead>
                <TableHead className="text-right">SLA Breaches</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {VENDORS.map((v) => (
                <TableRow key={v.id}>
                  <TableCell>
                    <p className="font-medium">{v.name}</p>
                    <p className="text-xs text-muted-foreground">{v.contactPerson} · {v.mobile}</p>
                  </TableCell>
                  <TableCell>{v.district}</TableCell>
                  <TableCell className="text-right">{v.capacityPerDay}</TableCell>
                  <TableCell className="text-right">{v.activeOrders}</TableCell>
                  <TableCell className="text-right">{formatNumber(v.fulfilledOrders)}</TableCell>
                  <TableCell className="text-right">
                    <span className={v.slaBreaches > 20 ? 'font-semibold text-destructive' : ''}>
                      {v.slaBreaches}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1">
                      <Star className="size-3.5 fill-warning text-warning" />
                      {v.rating.toFixed(1)}
                    </span>
                  </TableCell>
                  <TableCell><StatusBadge status={v.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
