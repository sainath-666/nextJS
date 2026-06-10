'use client';

import { useState } from 'react';
import { Save } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

export default function SettingsPage() {
  const [toggles, setToggles] = useState({
    hotspotDetection: true,
    demandForecast: true,
    referralTriage: true,
    smsAlerts: true,
    pushAlerts: false,
    emailDigest: true,
  });
  const set = (k: keyof typeof toggles) => (v: boolean) =>
    setToggles((t) => ({ ...t, [k]: v }));

  return (
    <>
      <PageHeader
        title="Settings"
        description="AI model configuration, SLA defaults and master data"
        actions={<Button><Save /> Save changes</Button>}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>AI Model Configuration</CardTitle>
            <CardDescription>Enable or tune intelligence modules</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Checkbox label="Disease hotspot detection" checked={toggles.hotspotDetection} onChange={set('hotspotDetection')} />
            <Checkbox label="Spectacle demand forecasting" checked={toggles.demandForecast} onChange={set('demandForecast')} />
            <Checkbox label="Referral priority triage" checked={toggles.referralTriage} onChange={set('referralTriage')} />
            <Separator />
            <div className="space-y-1.5">
              <Label htmlFor="threshold">Hotspot sensitivity threshold</Label>
              <Input id="threshold" type="number" defaultValue={70} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="retrain">Drift-triggered retraining (%)</Label>
              <Input id="retrain" type="number" defaultValue={10} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SLA Defaults</CardTitle>
            <CardDescription>Spectacle delivery commitments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="sla-std">Standard order SLA (hours)</Label>
              <Input id="sla-std" type="number" defaultValue={168} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sla-urgent">Priority order SLA (hours)</Label>
              <Input id="sla-urgent" type="number" defaultValue={72} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sla-cron">SLA breach check interval</Label>
              <Input id="sla-cron" defaultValue="Every 15 minutes" disabled />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notification Channels</CardTitle>
            <CardDescription>Default delivery channels for alerts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Checkbox label="SMS alerts (MSG91 / Kaleyra)" checked={toggles.smsAlerts} onChange={set('smsAlerts')} />
            <Checkbox label="Push notifications" checked={toggles.pushAlerts} onChange={set('pushAlerts')} />
            <Checkbox label="Daily email digest to officers" checked={toggles.emailDigest} onChange={set('emailDigest')} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Master Data</CardTitle>
            <CardDescription>Programme-wide reference data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <span>Districts</span><span className="font-medium">26 configured</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span>Frame catalogue</span><span className="font-medium">14 SKUs</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span>Referral hospitals</span><span className="font-medium">38 empanelled</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span>SNOMED / LOINC code sets</span><span className="font-medium">v2026.1</span>
            </div>
            <Button variant="outline" className="w-full">Manage master data</Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
