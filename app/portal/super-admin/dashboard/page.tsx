import {
  Users,
  Glasses,
  Send,
  AlertTriangle,
  Tent,
  Activity,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { StatCard } from '@/components/shared/stat-card';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { TrendAreaChart, DonutChart, VerticalBarChart, CHART_COLORS } from '@/components/charts/charts';
import { MapCard } from '@/components/maps/map-card';
import {
  STATE_TOTALS,
  DISTRICTS,
  MONTHLY_TREND,
  OUTCOME_BREAKDOWN,
  CAMP_TYPE_BREAKDOWN,
} from '@/lib/data';
import { formatNumber, percent } from '@/lib/utils';

export default function SuperAdminDashboard() {
  const coverage = percent(STATE_TOTALS.screened, STATE_TOTALS.target);
  const topDistricts = [...DISTRICTS]
    .sort((a, b) => b.screened - a.screened)
    .slice(0, 6);

  const mapPoints = DISTRICTS.map((d) => ({
    id: d.id,
    name: d.name,
    lat: d.lat,
    lng: d.lng,
    intensity: d.diseaseBurdenScore,
    detail: `${formatNumber(d.screened)} screened · ${d.referrals} referrals`,
  }));

  return (
    <>
      <PageHeader
        title="Statewide Dashboard"
        description="Real-time programme performance across Andhra Pradesh"
        actions={
          <Button variant="outline">
            <Activity /> Live
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Citizens Screened" value={formatNumber(STATE_TOTALS.screened)} icon={Users} delta={8} hint="vs last month" tone="primary" />
        <StatCard label="Spectacles Delivered" value={formatNumber(STATE_TOTALS.spectaclesDelivered)} icon={Glasses} delta={5} hint="vs last month" tone="accent" />
        <StatCard label="Referrals Raised" value={formatNumber(STATE_TOTALS.referrals)} icon={Send} delta={3} hint="vs last month" tone="warning" />
        <StatCard label="SLA Breaches" value={STATE_TOTALS.slaBreaches} icon={AlertTriangle} delta={-12} hint="vs last month" tone="destructive" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Screening &amp; Service Trend</CardTitle>
            <CardDescription>Last 12 months — statewide</CardDescription>
          </CardHeader>
          <CardContent>
            <TrendAreaChart
              data={MONTHLY_TREND}
              series={[
                { key: 'screened', name: 'Screened', color: CHART_COLORS[0] },
                { key: 'spectacles', name: 'Spectacles', color: CHART_COLORS[1] },
                { key: 'referrals', name: 'Referrals', color: CHART_COLORS[3] },
              ]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Outcome Mix</CardTitle>
            <CardDescription>Share of screening outcomes</CardDescription>
          </CardHeader>
          <CardContent>
            <DonutChart data={OUTCOME_BREAKDOWN} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Programme Coverage</CardTitle>
            <CardDescription>Screened vs annual target</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <div className="mb-2 flex items-baseline justify-between">
                <span className="text-3xl font-bold">{coverage}%</span>
                <span className="text-sm text-muted-foreground">
                  {formatNumber(STATE_TOTALS.screened)} / {formatNumber(STATE_TOTALS.target)}
                </span>
              </div>
              <Progress value={coverage} indicatorClassName="bg-accent" />
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="rounded-lg bg-secondary/50 p-3">
                <p className="text-xs text-muted-foreground">Active Camps</p>
                <p className="text-2xl font-bold">{STATE_TOTALS.campsActive}</p>
              </div>
              <div className="rounded-lg bg-secondary/50 p-3">
                <p className="text-xs text-muted-foreground">Total Camps</p>
                <p className="text-2xl font-bold">{formatNumber(STATE_TOTALS.campsTotal)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Performance by Camp Type</CardTitle>
            <CardDescription>Screened vs spectacles dispensed</CardDescription>
          </CardHeader>
          <CardContent>
            <VerticalBarChart
              data={CAMP_TYPE_BREAKDOWN}
              series={[
                { key: 'screened', name: 'Screened', color: CHART_COLORS[0] },
                { key: 'spectacles', name: 'Spectacles', color: CHART_COLORS[1] },
              ]}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Tent className="size-4 text-primary" /> Top Districts
              </CardTitle>
              <CardDescription>By citizens screened</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {topDistricts.map((d) => {
              const cov = percent(d.screened, d.target);
              return (
                <div key={d.id}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium">{d.name}</span>
                    <span className="text-muted-foreground">
                      {formatNumber(d.screened)} ({cov}%)
                    </span>
                  </div>
                  <Progress value={cov} />
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Disease Burden Map</CardTitle>
            <CardDescription>District-level burden index (AI)</CardDescription>
          </CardHeader>
          <CardContent>
            <MapCard points={mapPoints} height={320} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
