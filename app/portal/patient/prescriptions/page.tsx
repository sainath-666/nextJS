import { Download, ScrollText } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PRESCRIPTIONS } from '@/lib/data';
import { formatDate } from '@/lib/utils';

const PATIENT_ID = 'PAT-100234';

function fmt(n: number) {
  return n > 0 ? `+${n.toFixed(2)}` : n.toFixed(2);
}

export default function PrescriptionsPage() {
  const rx = PRESCRIPTIONS.filter((r) => r.patientId === PATIENT_ID);

  return (
    <>
      <PageHeader title="My Prescriptions" description="Spectacle prescriptions issued at screening" />

      {rx.length === 0 && (
        <Card><CardContent className="py-12 text-center text-sm text-muted-foreground">No prescriptions yet.</CardContent></Card>
      )}

      <div className="space-y-6">
        {rx.map((r) => (
          <Card key={r.id}>
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <ScrollText className="size-4 text-primary" /> {r.id}
                </CardTitle>
                <CardDescription>Issued {formatDate(r.issuedAt)} · {r.issuedBy}</CardDescription>
              </div>
              <Button variant="outline" size="sm"><Download /> PDF</Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Eye</TableHead>
                    <TableHead>Sph</TableHead>
                    <TableHead>Cyl</TableHead>
                    <TableHead>Axis</TableHead>
                    <TableHead>Add</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Right (OD)</TableCell>
                    <TableCell>{fmt(r.rightSph)}</TableCell>
                    <TableCell>{fmt(r.rightCyl)}</TableCell>
                    <TableCell>{r.rightAxis}°</TableCell>
                    <TableCell>{r.rightAdd ? fmt(r.rightAdd) : '—'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Left (OS)</TableCell>
                    <TableCell>{fmt(r.leftSph)}</TableCell>
                    <TableCell>{fmt(r.leftCyl)}</TableCell>
                    <TableCell>{r.leftAxis}°</TableCell>
                    <TableCell>{r.leftAdd ? fmt(r.leftAdd) : '—'}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <div className="rounded-lg bg-secondary/50 p-3 text-sm">
                <Badge variant="secondary" className="mb-1">Advice</Badge>
                <p className="text-muted-foreground">{r.advice}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
