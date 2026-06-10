'use client';

import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { StatCard } from '@/components/shared/stat-card';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/components/shared/status-badge';
import { REFERRALS } from '@/lib/data';
import { formatDate } from '@/lib/utils';
import type { ReferralStatus } from '@/lib/types';
import { AlertOctagon, ArrowUpRight, ListChecks } from 'lucide-react';

export default function ReferralsPage() {
  const base = REFERRALS;
  const [statuses, setStatuses] = useState<Record<string, ReferralStatus>>({});
  const get = (id: string, fallback: ReferralStatus) => statuses[id] ?? fallback;

  const critical = base.filter((r) => r.priority === 'critical').length;
  const pending = base.filter((r) => get(r.id, r.status) === 'pending').length;

  return (
    <>
      <PageHeader
        title="Referral Verification"
        description="Verify and route specialist referrals to empanelled hospitals"
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Critical" value={critical} icon={AlertOctagon} tone="destructive" />
        <StatCard label="Pending Verification" value={pending} icon={ListChecks} tone="warning" />
        <StatCard label="Total Referrals" value={base.length} icon={ArrowUpRight} tone="primary" />
      </div>

      <Card>
        <CardContent className="px-0 py-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Hospital</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {base.map((r) => {
                const status = get(r.id, r.status);
                return (
                  <TableRow key={r.id}>
                    <TableCell>
                      <p className="font-medium">{r.patientName}</p>
                      <p className="text-xs text-muted-foreground">{r.id}</p>
                    </TableCell>
                    <TableCell className="max-w-xs text-sm text-muted-foreground">{r.reason}</TableCell>
                    <TableCell className="text-sm">{r.hospitalName}</TableCell>
                    <TableCell><StatusBadge status={r.priority} /></TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                      {formatDate(r.createdAt)}
                    </TableCell>
                    <TableCell><StatusBadge status={status} /></TableCell>
                    <TableCell className="text-right">
                      {status === 'pending' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setStatuses((s) => ({ ...s, [r.id]: 'verified' }))}
                        >
                          <CheckCircle2 /> Verify
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
