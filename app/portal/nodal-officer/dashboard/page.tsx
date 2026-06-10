import Link from 'next/link';
import {
  ClipboardCheck,
  Users,
  Glasses,
  AlertTriangle,
  ArrowRight,
  Tent,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { StatCard } from '@/components/shared/stat-card';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { StatusBadge } from '@/components/shared/status-badge';
import { TrendAreaChart, CHART_COLORS } from '@/components/charts/charts';
import { DISTRICTS, EMRS, MONTHLY_TREND, SPECTACLE_ORDERS, CAMPS } from '@/lib/data';
import { formatNumber, percent } from '@/lib/utils';

const DISTRICT = 'Guntur';

export default function NodalDashboard() {
  const d = DISTRICTS.find((x) => x.name === DISTRICT)!;
  const pending = EMRS.filter((e) => e.district === DISTRICT && e.status === 'submitted');
  const slaBreaches = SPECTACLE_ORDERS.filter((o) => o.district === DISTRICT && o.slaBreached).length;
  const activeCamps = CAMPS.filter((c) => c.district === DISTRICT && c.status === 'active');
  const cov = percent(d.screened, d.target);

  // Scale the statewide trend down to approximate this district.
  const trend = MONTHLY_TREND.map((m) => ({
    label: m.label,
    screened: Math.round(m.screened * 0.105),
    spectacles: Math.round(m.spectacles * 0.105),
  }));

  return (
    <>
      <PageHeader
        title={`${DISTRICT} District Dashboard`}
        description="Your district at a glance"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Pending Approvals" value={pending.length} icon={ClipboardCheck} tone="warning" hint="awaiting your action" />
        <StatCard label="Screened (district)" value={formatNumber(d.screened)} icon={Users} delta={6} tone="primary" />
        <StatCard label="Spectacles Delivered" value={formatNumber(d.spectaclesDelivered)} icon={Glasses} delta={4} tone="accent" />
        <StatCard label="SLA Breaches" value={slaBreaches} icon={AlertTriangle} tone="destructive" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>District Trend</CardTitle>
            <CardDescription>Screened vs spectacles — last 12 months</CardDescription>
          </CardHeader>
          <CardContent>
            <TrendAreaChart
              data={trend}
              series={[
                { key: 'screened', name: 'Screened', color: CHART_COLORS[0] },
                { key: 'spectacles', name: 'Spectacles', color: CHART_COLORS[1] },
              ]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Coverage</CardTitle>
            <CardDescription>Annual target progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="mb-2 flex items-baseline justify-between">
                <span className="text-3xl font-bold">{cov}%</span>
                <span className="text-sm text-muted-foreground">
                  {formatNumber(d.screened)} / {formatNumber(d.target)}
                </span>
              </div>
              <Progress value={cov} indicatorClassName="bg-accent" />
            </div>
            <div className="rounded-lg bg-secondary/50 p-4">
              <p className="flex items-center gap-2 text-sm font-medium">
                <Tent className="size-4 text-primary" /> {activeCamps.length} active camps today
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Approval Queue</CardTitle>
            <CardDescription>EMRs submitted for your review</CardDescription>
          </div>
          <Link href="/portal/nodal-officer/approvals">
            <Button variant="outline" size="sm">View all <ArrowRight /></Button>
          </Link>
        </CardHeader>
        <CardContent className="space-y-2">
          {pending.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">No pending approvals 🎉</p>
          )}
          {pending.map((e) => (
            <div key={e.id} className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="font-medium">{e.patientName}</p>
                <p className="text-xs text-muted-foreground">{e.id} · {e.campName}</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={e.outcome} />
                <Link href="/portal/nodal-officer/approvals">
                  <Button size="sm">Review</Button>
                </Link>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  );
}
