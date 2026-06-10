'use client';

import { useState } from 'react';
import { Calendar, MapPin, Search, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { StatusBadge } from '@/components/shared/status-badge';
import { Badge } from '@/components/ui/badge';
import type { Camp } from '@/lib/types';
import { formatDate, percent } from '@/lib/utils';

const TYPE_LABEL: Record<Camp['type'], string> = {
  village: 'Village',
  tribal: 'Tribal',
  urban_slum: 'Urban Slum',
  school: 'School',
  industrial: 'Industrial',
};

export function CampsView({ camps }: { camps: Camp[] }) {
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('all');

  const filtered = camps.filter((c) => {
    const matchQ = `${c.name} ${c.district} ${c.village}`.toLowerCase().includes(q.toLowerCase());
    const matchS = status === 'all' || c.status === status;
    return matchQ && matchS;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
          <Input
            placeholder="Search camps…"
            className="pl-9"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <Select value={status} onChange={(e) => setStatus(e.target.value)} className="sm:w-48">
          <option value="all">All statuses</option>
          <option value="scheduled">Scheduled</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((c) => {
          const prog = percent(c.screenedCount, c.patientCount);
          return (
            <Card key={c.id} className="transition-shadow hover:shadow-md">
              <CardContent className="space-y-3 p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold leading-tight">{c.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{c.id}</p>
                  </div>
                  <StatusBadge status={c.status} />
                </div>
                <Badge variant="secondary">{TYPE_LABEL[c.type]}</Badge>
                <div className="space-y-1.5 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <MapPin className="size-3.5" /> {c.village}, {c.mandal}, {c.district}
                  </p>
                  <p className="flex items-center gap-2">
                    <Calendar className="size-3.5" /> {formatDate(c.scheduledDate)}
                  </p>
                  <p className="flex items-center gap-2">
                    <Users className="size-3.5" /> {c.teamName}
                  </p>
                </div>
                <div>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-muted-foreground">Screened</span>
                    <span className="font-medium">
                      {c.screenedCount}/{c.patientCount}
                    </span>
                  </div>
                  <Progress value={prog} indicatorClassName={c.status === 'completed' ? 'bg-success' : undefined} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="py-12 text-center text-sm text-muted-foreground">No camps match your filters.</p>
      )}
    </div>
  );
}
