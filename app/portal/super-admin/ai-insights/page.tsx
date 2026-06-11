import { Brain, TrendingUp } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MapCard } from '@/components/maps/map-card';
import { MultiLineChart, DonutChart } from '@/components/charts/charts';
import { CHART_COLORS } from '@/lib/chart-colors';
import {
  DISEASE_HOTSPOTS,
  AI_PREDICTIONS,
  DEMAND_FORECAST,
  REFERRAL_PRIORITY_QUEUE,
} from '@/lib/data';
import { formatNumber } from '@/lib/utils';

export default function AiInsightsPage() {
  const points = DISEASE_HOTSPOTS.map((h, i) => ({
    id: `${h.district}-${i}`,
    name: `${h.condition} · ${h.mandal}`,
    lat: h.lat,
    lng: h.lng,
    intensity: h.severity === 'high' ? 85 : h.severity === 'medium' ? 55 : 25,
    detail: `${h.district} · ${formatNumber(h.caseCount)} cases`,
  }));

  return (
    <>
      <PageHeader
        title="AI Public-Health Intelligence"
        description="Disease hotspot detection, demand forecasting & referral prioritisation"
        actions={<Badge variant="default"><Brain className="size-3" /> Model v2.3</Badge>}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Disease Hotspot Map</CardTitle>
            <CardDescription>Mandal-level clusters by condition & severity</CardDescription>
          </CardHeader>
          <CardContent>
            <MapCard points={points} height={400} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Referral Priority Queue</CardTitle>
            <CardDescription>AI-triaged outstanding referrals</CardDescription>
          </CardHeader>
          <CardContent>
            <DonutChart data={REFERRAL_PRIORITY_QUEUE} height={400} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="size-4 text-accent" /> Spectacle Demand Forecast
            </CardTitle>
            <CardDescription>Actual vs predicted statewide demand</CardDescription>
          </CardHeader>
          <CardContent>
            <MultiLineChart
              data={DEMAND_FORECAST}
              series={[
                { key: 'actual', name: 'Actual', color: CHART_COLORS[0] },
                { key: 'forecast', name: 'Forecast', color: CHART_COLORS[2] },
              ]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Predictions</CardTitle>
            <CardDescription>Next-quarter projections by district</CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>District / Metric</TableHead>
                  <TableHead className="text-right">Current</TableHead>
                  <TableHead className="text-right">Predicted</TableHead>
                  <TableHead className="text-right">Conf.</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {AI_PREDICTIONS.map((p) => (
                  <TableRow key={`${p.district}-${p.metric}`}>
                    <TableCell>
                      <p className="font-medium">{p.district}</p>
                      <p className="text-xs text-muted-foreground">{p.metric}</p>
                    </TableCell>
                    <TableCell className="text-right">{formatNumber(p.current)}</TableCell>
                    <TableCell className="text-right font-medium text-accent">
                      {formatNumber(p.predicted)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={p.confidence >= 0.85 ? 'success' : 'warning'}>
                        {Math.round(p.confidence * 100)}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hotspot Details</CardTitle>
          <CardDescription>All detected disease clusters</CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Condition</TableHead>
                <TableHead>District</TableHead>
                <TableHead>Mandal</TableHead>
                <TableHead className="text-right">Cases</TableHead>
                <TableHead>Severity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {DISEASE_HOTSPOTS.map((h, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{h.condition}</TableCell>
                  <TableCell>{h.district}</TableCell>
                  <TableCell>{h.mandal}</TableCell>
                  <TableCell className="text-right">{formatNumber(h.caseCount)}</TableCell>
                  <TableCell>
                    <Badge variant={h.severity === 'high' ? 'destructive' : h.severity === 'medium' ? 'warning' : 'secondary'}>
                      {h.severity}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
