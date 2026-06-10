'use client';

import { useState } from 'react';
import { Check, X, FileCheck2 } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { StatusBadge } from '@/components/shared/status-badge';
import { EmrSummary } from '@/components/emr/emr-summary';
import { cn } from '@/lib/utils';
import { EMRS } from '@/lib/data';
import type { EMRStatus } from '@/lib/types';

const DISTRICT = 'Guntur';

export default function ApprovalsPage() {
  const initial = EMRS.filter((e) => e.district === DISTRICT && e.status === 'submitted');
  const [decisions, setDecisions] = useState<Record<string, EMRStatus>>({});
  const [selectedId, setSelectedId] = useState(initial[0]?.id ?? null);
  const [note, setNote] = useState('');

  const queue = initial.filter((e) => !decisions[e.id]);
  const selected = EMRS.find((e) => e.id === selectedId) ?? null;

  function decide(status: EMRStatus) {
    if (!selected) return;
    setDecisions((d) => ({ ...d, [selected.id]: status }));
    setNote('');
    const next = queue.find((e) => e.id !== selected.id);
    setSelectedId(next?.id ?? null);
  }

  return (
    <>
      <PageHeader
        title="Prescription Approvals"
        description="Review submitted EMRs and approve or reject the screening outcome"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Queue */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Queue</CardTitle>
            <CardDescription>{queue.length} awaiting review</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {queue.length === 0 && (
              <div className="flex flex-col items-center gap-2 py-10 text-center text-sm text-muted-foreground">
                <FileCheck2 className="size-8 text-success" />
                All caught up!
              </div>
            )}
            {queue.map((e) => (
              <button
                key={e.id}
                onClick={() => setSelectedId(e.id)}
                className={cn(
                  'w-full rounded-lg border p-3 text-left transition-colors',
                  selectedId === e.id ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:bg-secondary',
                )}
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium">{e.patientName}</p>
                  <StatusBadge status={e.outcome} />
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">{e.id} · {e.campName}</p>
              </button>
            ))}

            {Object.keys(decisions).length > 0 && (
              <div className="pt-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Recently decided
                </p>
                {Object.entries(decisions).map(([id, status]) => {
                  const e = EMRS.find((x) => x.id === id)!;
                  return (
                    <div key={id} className="flex items-center justify-between rounded-md px-1 py-1.5 text-sm">
                      <span className="text-muted-foreground">{e.patientName}</span>
                      <StatusBadge status={status} />
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Detail */}
        <Card className="lg:col-span-2">
          {selected ? (
            <>
              <CardHeader>
                <CardTitle>{selected.patientName}</CardTitle>
                <CardDescription>
                  {selected.id} · {selected.campName} · {selected.screeningTeamName}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <EmrSummary emr={selected} />
                <div className="space-y-2">
                  <Textarea
                    placeholder="Add a note for the screening team (optional)…"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                  <div className="flex gap-3">
                    <Button variant="success" className="flex-1" onClick={() => decide('approved')}>
                      <Check /> Approve
                    </Button>
                    <Button variant="destructive" className="flex-1" onClick={() => decide('rejected')}>
                      <X /> Reject
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex h-full items-center justify-center py-20 text-sm text-muted-foreground">
              Select an EMR from the queue to review.
            </CardContent>
          )}
        </Card>
      </div>
    </>
  );
}
