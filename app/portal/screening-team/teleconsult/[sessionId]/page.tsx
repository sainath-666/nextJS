'use client';

import { useState } from 'react';
import { notFound } from 'next/navigation';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  MonitorUp,
  User,
  Stethoscope,
  Clock,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/shared/status-badge';
import { cn } from '@/lib/utils';
import { getTeleconsult, getEmr } from '@/lib/data';
import { formatDateTime } from '@/lib/utils';

export default function TeleconsultRoom({ params }: { params: { sessionId: string } }) {
  const session = getTeleconsult(params.sessionId);
  const [mic, setMic] = useState(true);
  const [cam, setCam] = useState(true);
  const [joined, setJoined] = useState(false);

  if (!session) notFound();
  const emr = getEmr(session.emrId);

  return (
    <>
      <PageHeader
        title="Tele-Ophthalmology"
        description={`Session ${session.id} · ${session.patientName}`}
        actions={<StatusBadge status={session.status} />}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {/* Stage */}
          <div className="relative aspect-video overflow-hidden rounded-xl bg-slate-900">
            <div className="flex h-full w-full items-center justify-center">
              {joined && cam ? (
                <div className="flex flex-col items-center gap-3 text-slate-300">
                  <div className="flex size-24 items-center justify-center rounded-full bg-slate-700">
                    <Stethoscope className="size-10" />
                  </div>
                  <p className="font-medium">{session.ophthalmologistName}</p>
                  <Badge variant="success">Connected</Badge>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 text-slate-400">
                  <Clock className="size-10" />
                  <p>{joined ? 'Camera off' : 'Waiting to join the room…'}</p>
                </div>
              )}
            </div>

            {/* Self tile */}
            <div className="absolute bottom-4 right-4 flex h-28 w-44 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-400">
              {cam ? <User className="size-8" /> : <VideoOff className="size-8" />}
              <span className="absolute bottom-1 left-2 text-xs">You · {session.patientName}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3">
            <Button variant={mic ? 'outline' : 'destructive'} size="icon" onClick={() => setMic((m) => !m)}>
              {mic ? <Mic /> : <MicOff />}
            </Button>
            <Button variant={cam ? 'outline' : 'destructive'} size="icon" onClick={() => setCam((c) => !c)}>
              {cam ? <Video /> : <VideoOff />}
            </Button>
            <Button variant="outline" size="icon"><MonitorUp /></Button>
            {!joined ? (
              <Button onClick={() => setJoined(true)}><Video /> Join room</Button>
            ) : (
              <Button variant="destructive" onClick={() => setJoined(false)}><PhoneOff /> Leave</Button>
            )}
          </div>
          <p className="text-center text-xs text-muted-foreground">
            Secured via WebRTC over TURN · room <code>{session.roomId}</code>
          </p>
        </div>

        {/* Side panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Session</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Patient</span><span className="font-medium">{session.patientName}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Specialist</span><span className="font-medium">{session.ophthalmologistName}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Scheduled</span><span className="font-medium">{formatDateTime(session.scheduledAt)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Linked EMR</span><span className="font-medium">{session.emrId}</span></div>
            </CardContent>
          </Card>

          {emr && (
            <Card>
              <CardHeader><CardTitle className="text-base">Vision snapshot</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">VA (R / L)</span><span className="font-medium">{emr.rightEyeUCDVA} / {emr.leftEyeUCDVA}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">IOP</span><span className="font-medium">{emr.iop ?? '—'}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Cup:Disc</span><span className="font-medium">{emr.cupToDiscRatio ?? '—'}</span></div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader><CardTitle className="text-base">Clinical notes</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Textarea placeholder="Diagnosis & advice…" rows={4} />
              <Button className="w-full" disabled={!joined}>Save &amp; complete</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
