import Link from 'next/link';
import { UserPlus, Eye } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/components/shared/status-badge';
import { PATIENTS, getEmrByPatient } from '@/lib/data';
import { formatDateTime, maskAbha } from '@/lib/utils';

export default function PatientsPage() {
  return (
    <>
      <PageHeader
        title="Today's Patients"
        description="Registered patients at the current camp"
        actions={
          <Link href="/portal/screening-team/register">
            <Button><UserPlus /> Register</Button>
          </Link>
        }
      />

      <Card>
        <CardContent className="px-0 py-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Age / Sex</TableHead>
                <TableHead>ABHA</TableHead>
                <TableHead>Registered</TableHead>
                <TableHead>EMR</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PATIENTS.map((p) => {
                const emr = getEmrByPatient(p.id);
                return (
                  <TableRow key={p.id}>
                    <TableCell>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.id} · {p.village}</p>
                    </TableCell>
                    <TableCell>{p.age} / {p.gender}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{maskAbha(p.abhaNumber)}</TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                      {formatDateTime(p.registeredAt)}
                    </TableCell>
                    <TableCell>
                      {emr ? (
                        <div className="flex items-center gap-1.5">
                          <StatusBadge status={emr.status} />
                          <StatusBadge status={emr.outcome} />
                        </div>
                      ) : (
                        <Badge variant="secondary">Not started</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/portal/screening-team/emr/${p.id}`}>
                        <Button size="sm" variant={emr ? 'outline' : 'default'}>
                          <Eye /> {emr ? 'View / Edit' : 'Start EMR'}
                        </Button>
                      </Link>
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
