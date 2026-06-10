import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MapCard } from '@/components/maps/map-card';
import { DISTRICTS } from '@/lib/data';
import { formatNumber, percent } from '@/lib/utils';

function burdenVariant(score: number) {
  if (score >= 75) return 'destructive' as const;
  if (score >= 60) return 'warning' as const;
  return 'success' as const;
}

export default function DistrictsPage() {
  const rows = [...DISTRICTS].sort((a, b) => b.diseaseBurdenScore - a.diseaseBurdenScore);
  const mapPoints = DISTRICTS.map((d) => ({
    id: d.id,
    name: d.name,
    lat: d.lat,
    lng: d.lng,
    intensity: d.diseaseBurdenScore,
    detail: `${formatNumber(d.screened)} screened`,
  }));

  return (
    <>
      <PageHeader
        title="District Performance"
        description="Coverage, service delivery and disease burden across all districts"
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Burden Heatmap</CardTitle>
            <CardDescription>Larger / redder = higher burden index</CardDescription>
          </CardHeader>
          <CardContent>
            <MapCard points={mapPoints} height={460} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>All Districts</CardTitle>
            <CardDescription>{DISTRICTS.length} districts</CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>District</TableHead>
                  <TableHead>Coverage</TableHead>
                  <TableHead className="text-right">Spectacles</TableHead>
                  <TableHead className="text-right">Referrals</TableHead>
                  <TableHead className="text-right">SLA</TableHead>
                  <TableHead>Burden</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((d) => {
                  const cov = percent(d.screened, d.target);
                  return (
                    <TableRow key={d.id}>
                      <TableCell className="font-medium">{d.name}</TableCell>
                      <TableCell>
                        <div className="flex w-32 items-center gap-2">
                          <Progress value={cov} className="h-1.5" />
                          <span className="text-xs text-muted-foreground">{cov}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{formatNumber(d.spectaclesDelivered)}</TableCell>
                      <TableCell className="text-right">{formatNumber(d.referrals)}</TableCell>
                      <TableCell className="text-right">
                        {d.slaBreaches > 12 ? (
                          <span className="font-medium text-destructive">{d.slaBreaches}</span>
                        ) : (
                          d.slaBreaches
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={burdenVariant(d.diseaseBurdenScore)}>
                          {d.diseaseBurdenScore}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
