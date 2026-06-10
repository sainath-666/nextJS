'use client';

import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/components/shared/status-badge';
import { DISTRICTS, TEAMS } from '@/lib/data';
import { initials } from '@/lib/utils';

const OFFICERS = [
  { id: 'NO-01', name: 'Sri B. Ramakrishna', district: 'Visakhapatnam', mobile: '9849100001', status: 'active' },
  { id: 'NO-02', name: 'Sri K. Venkateswarlu', district: 'Guntur', mobile: '9849100002', status: 'active' },
  { id: 'NO-04', name: 'Smt. P. Sailaja', district: 'East Godavari', mobile: '9849100004', status: 'active' },
  { id: 'NO-06', name: 'Sri D. Nagireddy', district: 'Anantapur', mobile: '9849100006', status: 'active' },
  { id: 'NO-07', name: 'Sri M. Pratap', district: 'Kurnool', mobile: '9849100007', status: 'active' },
  { id: 'NO-08', name: 'Smt. R. Vijaya', district: 'Chittoor', mobile: '9849100008', status: 'active' },
  { id: 'NO-11', name: 'Sri T. Subbarao', district: 'Prakasam', mobile: '9849100011', status: 'onboarding' },
];

export default function UsersPage() {
  const [q, setQ] = useState('');
  const officers = OFFICERS.filter((o) =>
    `${o.name} ${o.district}`.toLowerCase().includes(q.toLowerCase()),
  );
  const teams = TEAMS.filter((t) =>
    `${t.name} ${t.district} ${t.leadName}`.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <>
      <PageHeader
        title="User Management"
        description="Manage district nodal officers and field screening teams"
        actions={
          <Button>
            <Plus /> Add User
          </Button>
        }
      />

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
        <Input
          placeholder="Search users…"
          className="pl-9"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <Tabs defaultValue="officers">
        <TabsList>
          <TabsTrigger value="officers">Nodal Officers ({officers.length})</TabsTrigger>
          <TabsTrigger value="teams">Screening Teams ({teams.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="officers">
          <Card>
            <CardContent className="px-0 py-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Officer</TableHead>
                    <TableHead>District</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {officers.map((o) => (
                    <TableRow key={o.id}>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                            {initials(o.name.replace(/^(Sri|Smt\.) /, ''))}
                          </span>
                          <span className="font-medium">{o.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{o.district}</TableCell>
                      <TableCell className="text-muted-foreground">{o.mobile}</TableCell>
                      <TableCell><StatusBadge status={o.status} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teams">
          <Card>
            <CardContent className="px-0 py-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Team</TableHead>
                    <TableHead>District / Mandal</TableHead>
                    <TableHead>Lead</TableHead>
                    <TableHead className="text-right">Members</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teams.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="font-medium">{t.name}</TableCell>
                      <TableCell>{t.district} · {t.mandal}</TableCell>
                      <TableCell className="text-muted-foreground">{t.leadName}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="secondary">{t.members.length}</Badge>
                      </TableCell>
                      <TableCell><StatusBadge status={t.status} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <p className="text-xs text-muted-foreground">
        {DISTRICTS.length} districts · roles provisioned via Keycloak realm <code>ap-vision-care</code>.
      </p>
    </>
  );
}
