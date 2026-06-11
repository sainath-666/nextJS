import Link from 'next/link';
import {
  UserPlus,
  ListChecks,
  Target,
  MapPin,
  Calendar,
  Wifi,
  ArrowRight,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { StatCard } from '@/components/shared/stat-card';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/shared/status-badge';
import { CAMPS, EMRS } from '@/lib/data';
import { formatDate, percent } from '@/lib/utils';

const TEAM_ID = 'TM-12';

export default function ScreeningDashboard() {
  const camp = CAMPS.find((c) => c.teamId === TEAM_ID)!;
  const myEmrs = EMRS.filter((e) => e.screeningTeamId === TEAM_ID);
  const prog = percent(camp.screenedCount, camp.patientCount);

  return (
    <>
      <PageHeader
        title="Today's Camp"
        description={formatDate(camp.scheduledDate)}
        actions={
          <Badge variant="success"><Wifi className="size-3" /> Online · synced</Badge>
        }
      />

      <Card className="bg-gradient-to-br from-primary/5 to-card">
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-bold">{camp.name}</p>
            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin className="size-3.5" /> {camp.village}, {camp.mandal}</span>
              <span className="flex items-center gap-1"><Calendar className="size-3.5" /> {formatDate(camp.scheduledDate)}</span>
            </div>
          </div>
          <StatusBadge status={camp.status} />
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Registered" value={camp.patientCount} icon={UserPlus} tone="primary" />
        <StatCard label="Screened" value={camp.screenedCount} icon={ListChecks} tone="success" />
        <StatCard label="Target" value={camp.patientCount} icon={Target} tone="accent" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Camp progress</CardTitle>
          <CardDescription>{camp.screenedCount} of {camp.patientCount} screened</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-2 flex items-baseline justify-between">
            <span className="text-3xl font-bold">{prog}%</span>
            <span className="text-sm text-muted-foreground">{camp.patientCount - camp.screenedCount} remaining</span>
          </div>
          <Progress value={prog} indicatorClassName="bg-success" />
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/portal/screening-team/register">
          <Card className="transition-colors hover:border-primary">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-lg bg-primary/10 p-3 text-primary"><UserPlus className="size-6" /></div>
              <div className="flex-1">
                <p className="font-semibold">Register Patient</p>
                <p className="text-sm text-muted-foreground">ABHA · Mobile · QR scan</p>
              </div>
              <ArrowRight className="size-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>
        <Link href="/portal/screening-team/patients">
          <Card className="transition-colors hover:border-primary">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-lg bg-accent/10 p-3 text-accent"><ListChecks className="size-6" /></div>
              <div className="flex-1">
                <p className="font-semibold">Today&apos;s Patients</p>
                <p className="text-sm text-muted-foreground">{myEmrs.length} screened · view & continue</p>
              </div>
              <ArrowRight className="size-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>
      </div>
    </>
  );
}
