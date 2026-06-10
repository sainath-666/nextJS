import { Plus, UserCircle2, MapPin } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/shared/status-badge';
import { TEAMS } from '@/lib/data';

export default function TeamsPage() {
  return (
    <>
      <PageHeader
        title="Screening Teams"
        description="Create teams and assign them to camps"
        actions={<Button><Plus /> Create Team</Button>}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {TEAMS.map((t) => (
          <Card key={t.id}>
            <CardContent className="space-y-4 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold">{t.name}</p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="size-3" /> {t.mandal}, {t.district}
                  </p>
                </div>
                <StatusBadge status={t.status} />
              </div>

              <div className="space-y-1.5">
                {t.members.map((m) => (
                  <div key={m.name} className="flex items-center gap-2 text-sm">
                    <UserCircle2 className="size-4 text-muted-foreground" />
                    <span className="font-medium">{m.name}</span>
                    <span className="text-xs text-muted-foreground">· {m.role}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-3 text-sm">
                <span className="text-muted-foreground">Assigned camp</span>
                <span className="font-medium">{t.assignedCampName ?? 'Unassigned'}</span>
              </div>

              <div className="flex items-center justify-between">
                <Badge variant="secondary">{t.patientsScreenedToday} screened today</Badge>
                <Button size="sm" variant="outline">Assign camp</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
