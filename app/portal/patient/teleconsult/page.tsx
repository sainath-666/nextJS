'use client';

import { useState } from 'react';
import { CalendarClock, CheckCircle2, Stethoscope, Video } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const SPECIALISTS = [
  { id: 'OPH-07', name: 'Dr. Suneetha Rao', spec: 'Glaucoma' },
  { id: 'OPH-03', name: 'Dr. Kiran Kumar', spec: 'Retina' },
  { id: 'OPH-11', name: 'Dr. Anil Varma', spec: 'General Ophthalmology' },
];

const SLOTS = ['Today · 3:30 PM', 'Today · 5:00 PM', 'Tomorrow · 10:00 AM', 'Tomorrow · 2:00 PM'];

export default function PatientTeleconsultPage() {
  const [slot, setSlot] = useState<string | null>(null);
  const [booked, setBooked] = useState<{ doctor: string; slot: string } | null>(null);
  const [doctor, setDoctor] = useState(SPECIALISTS[0].id);

  function book() {
    if (!slot) return;
    const doc = SPECIALISTS.find((s) => s.id === doctor)!;
    setBooked({ doctor: doc.name, slot });
  }

  return (
    <>
      <PageHeader title="Tele-Ophthalmology" description="Consult a specialist from your village or home" />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Book a consultation</CardTitle>
            <CardDescription>Choose a specialist and a time slot</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>Specialist</Label>
              <Select value={doctor} onChange={(e) => setDoctor(e.target.value)}>
                {SPECIALISTS.map((s) => (
                  <option key={s.id} value={s.id}>{s.name} — {s.spec}</option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Available slots</Label>
              <div className="grid grid-cols-2 gap-2">
                {SLOTS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSlot(s)}
                    className={cn(
                      'flex items-center gap-2 rounded-lg border p-3 text-sm transition-colors',
                      slot === s ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:bg-secondary',
                    )}
                  >
                    <CalendarClock className="size-4 text-muted-foreground" /> {s}
                  </button>
                ))}
              </div>
            </div>
            <Button className="w-full" onClick={book} disabled={!slot}>
              <Video /> Confirm booking
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My sessions</CardTitle>
            <CardDescription>Upcoming and past consultations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {booked ? (
              <div className="rounded-lg border border-success/30 bg-success/5 p-4">
                <Badge variant="success"><CheckCircle2 className="size-3" /> Confirmed</Badge>
                <p className="mt-2 font-medium">{booked.doctor}</p>
                <p className="text-sm text-muted-foreground">{booked.slot}</p>
                <Button size="sm" variant="outline" className="mt-3" disabled>
                  <Video /> Join (opens at start time)
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 py-8 text-center text-sm text-muted-foreground">
                <Stethoscope className="size-8" />
                No upcoming sessions. Book one to get started.
              </div>
            )}

            <div className="rounded-lg border p-4 opacity-80">
              <Badge variant="secondary">Completed</Badge>
              <p className="mt-2 font-medium">Dr. Suneetha Rao</p>
              <p className="text-sm text-muted-foreground">10 Jun 2026 · Glaucoma review</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
