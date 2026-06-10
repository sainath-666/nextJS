import { AlertTriangle, Clock, PackageCheck, Glasses } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { StatCard } from '@/components/shared/stat-card';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/components/shared/status-badge';
import { Badge } from '@/components/ui/badge';
import { SPECTACLE_ORDERS } from '@/lib/data';
import { formatDate } from '@/lib/utils';

const DISTRICT = 'Guntur';

export default function NodalSpectaclesPage() {
  // Nodal officers coordinate their own district, but monitor the full pipeline.
  const orders = SPECTACLE_ORDERS;
  const inProgress = orders.filter((o) => !['delivered'].includes(o.status)).length;
  const breached = orders.filter((o) => o.slaBreached).length;
  const delivered = orders.filter((o) => o.status === 'delivered').length;

  return (
    <>
      <PageHeader
        title="Spectacle Orders"
        description="Track orders from manufacture to OTP-verified delivery"
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="In Progress" value={inProgress} icon={Clock} tone="warning" />
        <StatCard label="Delivered" value={delivered} icon={PackageCheck} tone="success" />
        <StatCard label="SLA Breached" value={breached} icon={AlertTriangle} tone="destructive" />
      </div>

      <Card>
        <CardContent className="px-0 py-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>SLA Deadline</TableHead>
                <TableHead>SLA</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((o) => (
                <TableRow key={o.id}>
                  <TableCell>
                    <p className="font-medium">{o.id}</p>
                    <p className="text-xs text-muted-foreground">{o.frameType} · {o.frameSize}</p>
                  </TableCell>
                  <TableCell>{o.patientName}</TableCell>
                  <TableCell className="text-sm">{o.vendorName}</TableCell>
                  <TableCell><StatusBadge status={o.status} /></TableCell>
                  <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                    {formatDate(o.slaDeadline)}
                  </TableCell>
                  <TableCell>
                    {o.slaBreached ? (
                      <Badge variant="destructive"><AlertTriangle className="size-3" /> Breached</Badge>
                    ) : (
                      <Badge variant="success">On track</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Glasses className="size-3.5" /> SLA breaches auto-escalate to the {DISTRICT} nodal officer every 15 minutes.
      </p>
    </>
  );
}
