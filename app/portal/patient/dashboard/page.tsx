import Link from 'next/link';
import {
  ScrollText,
  Glasses,
  ArrowRightLeft,
  Stethoscope,
  ShieldCheck,
  ArrowRight,
  Eye,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/shared/status-badge';
import {
  getPatient,
  PRESCRIPTIONS,
  SPECTACLE_ORDERS,
  getReferralsByPatient,
  getEmrByPatient,
} from '@/lib/data';
import { formatDate, maskAbha } from '@/lib/utils';

const PATIENT_ID = 'PAT-100234';

export default function PatientDashboard() {
  const p = getPatient(PATIENT_ID)!;
  const rx = PRESCRIPTIONS.filter((r) => r.patientId === PATIENT_ID);
  const orders = SPECTACLE_ORDERS.filter((o) => o.patientId === PATIENT_ID);
  const referrals = getReferralsByPatient(PATIENT_ID);
  const emr = getEmrByPatient(PATIENT_ID);

  const quick = [
    { href: '/portal/patient/prescriptions', icon: ScrollText, label: 'Prescriptions', value: rx.length },
    { href: '/portal/patient/spectacles', icon: Glasses, label: 'Spectacle Orders', value: orders.length },
    { href: '/portal/patient/referrals', icon: ArrowRightLeft, label: 'Referrals', value: referrals.length },
    { href: '/portal/patient/teleconsult', icon: Stethoscope, label: 'Teleconsults', value: 1 },
  ];

  return (
    <>
      <PageHeader title={`Namaste, ${p.name.split(' ')[0]} 👋`} description="Your personal eye-care record" />

      <Card className="bg-gradient-to-br from-primary/5 to-card">
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Eye className="size-7" />
            </div>
            <div>
              <p className="text-lg font-bold">{p.name}</p>
              <p className="text-sm text-muted-foreground">{p.age}y · {p.gender} · {p.village}, {p.district}</p>
            </div>
          </div>
          <div className="space-y-1 text-sm sm:text-right">
            <Badge variant="success"><ShieldCheck className="size-3" /> ABHA linked</Badge>
            <p className="text-muted-foreground">{maskAbha(p.abhaNumber)}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {quick.map((q) => (
          <Link key={q.href} href={q.href}>
            <Card className="transition-colors hover:border-primary">
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <p className="text-sm text-muted-foreground">{q.label}</p>
                  <p className="text-2xl font-bold">{q.value}</p>
                </div>
                <div className="rounded-lg bg-primary/10 p-2.5 text-primary"><q.icon className="size-5" /></div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Latest screening</CardTitle>
              <CardDescription>Your most recent visit</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {emr ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Camp</span>
                  <span className="font-medium">{emr.campName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Date</span>
                  <span className="font-medium">{formatDate(emr.createdAt)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Outcome</span>
                  <StatusBadge status={emr.outcome} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">VA (R / L)</span>
                  <span className="font-medium">{emr.rightEyeUCDVA} / {emr.leftEyeUCDVA}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No screening records yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Care timeline</CardTitle>
            <CardDescription>ABDM-linked care contexts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {[
              { label: 'Vision Screening — Mangalagiri PHC', date: emr?.createdAt, tag: 'EMR' },
              { label: 'Spectacle Prescription', date: rx[0]?.issuedAt, tag: 'RX' },
              { label: 'Spectacle Order placed', date: orders[0]?.orderedAt, tag: 'ORDER' },
            ].map((t) => (
              <div key={t.label} className="flex items-center gap-3">
                <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">{t.tag}</span>
                <span className="flex-1">{t.label}</span>
                <span className="text-xs text-muted-foreground">{formatDate(t.date)}</span>
              </div>
            ))}
            <Link href="/portal/patient/teleconsult">
              <Button variant="outline" size="sm" className="mt-2 w-full">
                Book a teleconsult <ArrowRight />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
