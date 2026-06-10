import { ArrowRightLeft, Hospital, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/status-badge';
import { getReferralsByPatient } from '@/lib/data';
import { formatDate } from '@/lib/utils';

const PATIENT_ID = 'PAT-100234';

export default function PatientReferralsPage() {
  const referrals = getReferralsByPatient(PATIENT_ID);

  return (
    <>
      <PageHeader title="My Referrals" description="Specialist referrals and their status" />

      {referrals.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <div className="rounded-full bg-success/10 p-4 text-success">
              <CheckCircle2 className="size-8" />
            </div>
            <p className="font-medium">No active referrals</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              You have no specialist referrals at the moment. Any referrals raised during
              screening will appear here with live status updates.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {referrals.map((r) => (
            <Card key={r.id}>
              <CardContent className="flex items-start justify-between gap-4 p-5">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2.5 text-primary"><Hospital className="size-5" /></div>
                  <div>
                    <p className="font-semibold">{r.hospitalName}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{r.reason}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {r.id} · raised {formatDate(r.createdAt)}
                      {r.scheduledAt ? ` · appointment ${formatDate(r.scheduledAt)}` : ''}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <StatusBadge status={r.priority} />
                  <StatusBadge status={r.status} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <ArrowRightLeft className="size-3.5" /> Referrals are routed to empanelled government eye hospitals near you.
      </p>
    </>
  );
}
