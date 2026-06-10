'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CloudUpload,
  Glasses,
  Save,
  Send,
  Stethoscope,
  Video,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/shared/status-badge';
import { cn } from '@/lib/utils';
import { emrSchema, determineOutcome, type EMRFormData } from '@/lib/emr-schema';
import type { EMROutcome, Patient } from '@/lib/types';

const STEPS = ['Symptoms & History', 'Vision', 'Refraction', 'Fundus', 'Review'];

const SYMPTOMS: { key: keyof EMRFormData; label: string }[] = [
  { key: 'diminishedVisionDistance', label: 'Diminished distance vision' },
  { key: 'diminishedVisionNear', label: 'Diminished near vision' },
  { key: 'redness', label: 'Redness' },
  { key: 'watering', label: 'Watering' },
  { key: 'pain', label: 'Pain' },
  { key: 'blurredVision', label: 'Blurred vision' },
  { key: 'photophobia', label: 'Photophobia' },
  { key: 'flashersFloaters', label: 'Flashers / floaters' },
  { key: 'diplopia', label: 'Diplopia' },
  { key: 'digitalEyeStrain', label: 'Digital eye strain' },
];

const HISTORY: { key: keyof EMRFormData; label: string }[] = [
  { key: 'diabetes', label: 'Diabetes' },
  { key: 'hypertension', label: 'Hypertension' },
  { key: 'thyroid', label: 'Thyroid' },
  { key: 'glaucomaHistory', label: 'Glaucoma history' },
  { key: 'cataractHistory', label: 'Cataract history' },
  { key: 'ocularTrauma', label: 'Ocular trauma' },
  { key: 'previousSurgery', label: 'Previous surgery' },
];

const OUTCOME_INFO: Record<EMROutcome, { icon: typeof Glasses; title: string; action: string }> = {
  normal: { icon: CheckCircle2, title: 'Normal vision', action: 'No intervention required. Patient advised routine review.' },
  spectacles: { icon: Glasses, title: 'Spectacles required', action: 'A spectacle order will be created from the prescription.' },
  teleconsult: { icon: Video, title: 'Teleconsult recommended', action: 'A tele-ophthalmology session will be scheduled.' },
  referral: { icon: Stethoscope, title: 'Specialist referral', action: 'Patient will be referred to an empanelled eye hospital.' },
};

function CheckGrid({
  form,
  items,
}: {
  form: UseFormReturn<EMRFormData>;
  items: { key: keyof EMRFormData; label: string }[];
}) {
  const values = form.watch();
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {items.map((it) => (
        <Checkbox
          key={String(it.key)}
          id={String(it.key)}
          label={it.label}
          checked={Boolean(values[it.key])}
          onChange={(v) => form.setValue(it.key, v as never, { shouldDirty: true })}
        />
      ))}
    </div>
  );
}

function VAField({
  form,
  name,
  label,
  placeholder = '6/6',
}: {
  form: UseFormReturn<EMRFormData>;
  name: keyof EMRFormData;
  label: string;
  placeholder?: string;
}) {
  const err = form.formState.errors[name];
  return (
    <div className="space-y-1.5">
      <Label htmlFor={String(name)}>{label}</Label>
      <Input id={String(name)} placeholder={placeholder} {...form.register(name)} />
      {err && <p className="text-xs text-destructive">{String(err.message)}</p>}
    </div>
  );
}

export function EMRForm({ patient }: { patient: Patient }) {
  const storageKey = `apvc-emr-draft-${patient.id}`;
  const [step, setStep] = useState(0);
  const [saved, setSaved] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<EMROutcome | null>(null);

  const form = useForm<EMRFormData>({
    resolver: zodResolver(emrSchema),
    defaultValues: { rightEyeUCDVA: '', leftEyeUCDVA: '' } as Partial<EMRFormData> as EMRFormData,
    mode: 'onTouched',
  });

  // Load any locally-saved draft (offline support).
  useEffect(() => {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null;
    if (raw) {
      try {
        form.reset(JSON.parse(raw));
      } catch {
        /* ignore corrupt draft */
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  // Auto-save draft to localStorage as the user types.
  useEffect(() => {
    const sub = form.watch((values) => {
      localStorage.setItem(storageKey, JSON.stringify(values));
    });
    return () => sub.unsubscribe();
  }, [form, storageKey]);

  function saveDraft() {
    localStorage.setItem(storageKey, JSON.stringify(form.getValues()));
    setSaved(new Date().toLocaleTimeString('en-IN'));
  }

  async function next() {
    // Validate VA fields before leaving the Vision step.
    if (step === 1) {
      const ok = await form.trigger(['rightEyeUCDVA', 'leftEyeUCDVA']);
      if (!ok) return;
    }
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  }

  function onSubmit(data: EMRFormData) {
    const outcome = determineOutcome(data);
    localStorage.removeItem(storageKey);
    setSubmitted(outcome);
  }

  if (submitted) {
    const info = OUTCOME_INFO[submitted];
    const Icon = info.icon;
    return (
      <Card className="mx-auto max-w-xl">
        <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
          <div className="rounded-full bg-primary/10 p-4 text-primary">
            <Icon className="size-10" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">EMR submitted for {patient.name}</p>
            <h2 className="mt-1 text-2xl font-bold">{info.title}</h2>
          </div>
          <StatusBadge status={submitted} />
          <p className="max-w-sm text-sm text-muted-foreground">{info.action}</p>
          <p className="text-xs text-muted-foreground">
            Outcome computed by the decision engine · awaiting nodal officer approval.
          </p>
          <div className="flex gap-3">
            <Link href="/portal/screening-team/patients">
              <Button>Back to patients</Button>
            </Link>
            <Link href="/portal/screening-team/register">
              <Button variant="outline">Register next</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  const liveOutcome = determineOutcome(form.watch());

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Stepper */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setStep(i)}
              className={cn(
                'flex items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1.5 text-sm transition-colors',
                i === step
                  ? 'border-primary bg-primary text-primary-foreground'
                  : i < step
                    ? 'border-primary/30 bg-primary/5 text-primary'
                    : 'text-muted-foreground',
              )}
            >
              <span className="flex size-5 items-center justify-center rounded-full bg-current/10 text-xs font-semibold">
                {i + 1}
              </span>
              {label}
            </button>
            {i < STEPS.length - 1 && <span className="h-px w-4 bg-border" />}
          </div>
        ))}
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>{STEPS[step]}</CardTitle>
            <CardDescription>Step {step + 1} of {STEPS.length}</CardDescription>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={saveDraft}>
            <Save /> Save draft
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 0 && (
            <>
              <div>
                <h4 className="mb-3 text-sm font-semibold">Presenting symptoms</h4>
                <CheckGrid form={form} items={SYMPTOMS} />
              </div>
              <div>
                <h4 className="mb-3 text-sm font-semibold">Systemic / ocular history</h4>
                <CheckGrid form={form} items={HISTORY} />
              </div>
              <div className="max-w-xs space-y-1.5">
                <Label htmlFor="existingGlassesPower">Existing glasses power</Label>
                <Input id="existingGlassesPower" placeholder="e.g. +1.00 DS" {...form.register('existingGlassesPower')} />
              </div>
            </>
          )}

          {step === 1 && (
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h4 className="text-sm font-semibold">Right Eye</h4>
                <VAField form={form} name="rightEyeUCDVA" label="UCDVA (distance)" />
                <VAField form={form} name="rightEyeBCDVA" label="BCDVA" />
                <VAField form={form} name="rightEyePH" label="Pinhole" />
                <VAField form={form} name="rightEyeUCNVA" label="Near (UCNVA)" placeholder="N6" />
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-semibold">Left Eye</h4>
                <VAField form={form} name="leftEyeUCDVA" label="UCDVA (distance)" />
                <VAField form={form} name="leftEyeBCDVA" label="BCDVA" />
                <VAField form={form} name="leftEyePH" label="Pinhole" />
                <VAField form={form} name="leftEyeUCNVA" label="Near (UCNVA)" placeholder="N6" />
              </div>
            </div>
          )}

          {step === 2 && (
            <>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold">Right Eye Refraction</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <VAField form={form} name="rightEyeSph" label="Sph" placeholder="-1.50" />
                    <VAField form={form} name="rightEyeCyl" label="Cyl" placeholder="-0.50" />
                    <VAField form={form} name="rightEyeAxis" label="Axis" placeholder="90" />
                  </div>
                  <VAField form={form} name="addPowerRight" label="Add power" placeholder="1.50" />
                </div>
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold">Left Eye Refraction</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <VAField form={form} name="leftEyeSph" label="Sph" placeholder="-2.00" />
                    <VAField form={form} name="leftEyeCyl" label="Cyl" placeholder="-0.75" />
                    <VAField form={form} name="leftEyeAxis" label="Axis" placeholder="85" />
                  </div>
                  <VAField form={form} name="addPowerLeft" label="Add power" placeholder="1.50" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <VAField form={form} name="iop" label="IOP" placeholder="14 mmHg" />
                <VAField form={form} name="colorVision" label="Colour vision" placeholder="Normal" />
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <VAField form={form} name="cupToDiscRatio" label="Cup : Disc ratio" placeholder="0.3" />
                <VAField form={form} name="diabeticRetinopathyGrade" label="DR grade" placeholder="e.g. Moderate NPDR" />
                <VAField form={form} name="hypertensiveRetinopathyGrade" label="HTN retinopathy grade" placeholder="Grade 1" />
              </div>
              <CheckGrid
                form={form}
                items={[
                  { key: 'opticDiscPallor', label: 'Optic disc pallor' },
                  { key: 'macularEdema', label: 'Macular edema' },
                  { key: 'amd', label: 'Age-related macular degeneration' },
                ]}
              />
            </>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="rounded-lg border bg-secondary/40 p-4">
                <p className="text-sm text-muted-foreground">Computed outcome (decision engine)</p>
                <div className="mt-2 flex items-center gap-3">
                  <StatusBadge status={liveOutcome} />
                  <span className="text-sm">{OUTCOME_INFO[liveOutcome].action}</span>
                </div>
              </div>
              <div className="grid gap-3 text-sm sm:grid-cols-2">
                <div className="rounded-lg border p-3">
                  <p className="text-muted-foreground">Distance VA (R / L)</p>
                  <p className="font-medium">{form.watch('rightEyeUCDVA') || '—'} / {form.watch('leftEyeUCDVA') || '—'}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-muted-foreground">IOP</p>
                  <p className="font-medium">{form.watch('iop') || '—'}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-muted-foreground">Cup:Disc ratio</p>
                  <p className="font-medium">{form.watch('cupToDiscRatio') || '—'}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-muted-foreground">DR grade</p>
                  <p className="font-medium">{form.watch('diabeticRetinopathyGrade') || '—'}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Review the details above. On submit, the EMR is sent to the nodal officer for approval.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Footer controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button type="button" variant="outline" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
            <ArrowLeft /> Back
          </Button>
          {saved && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <CloudUpload className="size-3.5" /> Draft saved {saved}
            </span>
          )}
        </div>

        {step < STEPS.length - 1 ? (
          <Button type="button" onClick={next}>
            Next <ArrowRight />
          </Button>
        ) : (
          <Button type="submit">
            <Send /> Submit EMR
          </Button>
        )}
      </div>
    </form>
  );
}
