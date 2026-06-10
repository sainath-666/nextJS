import { Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { StatusBadge } from '@/components/shared/status-badge';
import type { EMR } from '@/lib/types';
import { formatDateTime } from '@/lib/utils';

const SYMPTOMS: { key: keyof EMR; label: string }[] = [
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

const HISTORY: { key: keyof EMR; label: string }[] = [
  { key: 'diabetes', label: 'Diabetes' },
  { key: 'hypertension', label: 'Hypertension' },
  { key: 'thyroid', label: 'Thyroid' },
  { key: 'glaucomaHistory', label: 'Glaucoma history' },
  { key: 'cataractHistory', label: 'Cataract history' },
  { key: 'ocularTrauma', label: 'Ocular trauma' },
  { key: 'previousSurgery', label: 'Previous surgery' },
];

function Field({ label, value }: { label: string; value?: string | number }) {
  return (
    <div className="flex justify-between gap-4 py-1 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value ?? '—'}</span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h4>
      {children}
    </div>
  );
}

export function EmrSummary({ emr }: { emr: EMR }) {
  const symptoms = SYMPTOMS.filter((s) => emr[s.key]);
  const history = HISTORY.filter((h) => emr[h.key]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline"><Eye className="size-3" /> {emr.id}</Badge>
        <StatusBadge status={emr.status} />
        <StatusBadge status={emr.outcome} />
        <span className="ml-auto text-xs text-muted-foreground">
          {formatDateTime(emr.submittedAt ?? emr.createdAt)}
        </span>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Section title="Symptoms">
          {symptoms.length ? (
            <div className="flex flex-wrap gap-1.5">
              {symptoms.map((s) => (
                <Badge key={String(s.key)} variant="secondary">{s.label}</Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">None reported</p>
          )}
        </Section>

        <Section title="History">
          {history.length ? (
            <div className="flex flex-wrap gap-1.5">
              {history.map((h) => (
                <Badge key={String(h.key)} variant="warning">{h.label}</Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No significant history</p>
          )}
        </Section>
      </div>

      <Separator />

      <div className="grid gap-5 md:grid-cols-2">
        <Section title="Visual Acuity — Right Eye">
          <Field label="UCDVA" value={emr.rightEyeUCDVA} />
          <Field label="BCDVA" value={emr.rightEyeBCDVA} />
          <Field label="Pinhole" value={emr.rightEyePH} />
          <Field label="Near (UCNVA)" value={emr.rightEyeUCNVA} />
        </Section>
        <Section title="Visual Acuity — Left Eye">
          <Field label="UCDVA" value={emr.leftEyeUCDVA} />
          <Field label="BCDVA" value={emr.leftEyeBCDVA} />
          <Field label="Pinhole" value={emr.leftEyePH} />
          <Field label="Near (UCNVA)" value={emr.leftEyeUCNVA} />
        </Section>
      </div>

      {(emr.rightEyeSph !== undefined || emr.leftEyeSph !== undefined) && (
        <>
          <Separator />
          <div className="grid gap-5 md:grid-cols-2">
            <Section title="Refraction — Right">
              <Field label="Sph" value={emr.rightEyeSph} />
              <Field label="Cyl" value={emr.rightEyeCyl} />
              <Field label="Axis" value={emr.rightEyeAxis} />
              <Field label="Add" value={emr.addPowerRight} />
            </Section>
            <Section title="Refraction — Left">
              <Field label="Sph" value={emr.leftEyeSph} />
              <Field label="Cyl" value={emr.leftEyeCyl} />
              <Field label="Axis" value={emr.leftEyeAxis} />
              <Field label="Add" value={emr.addPowerLeft} />
            </Section>
          </div>
        </>
      )}

      <Separator />

      <div className="grid gap-5 md:grid-cols-2">
        <Section title="Anterior / General">
          <Field label="IOP" value={emr.iop} />
          <Field label="Colour vision" value={emr.colorVision} />
          <Field label="Existing glasses" value={emr.existingGlassesPower} />
        </Section>
        <Section title="Retinal / Fundus">
          <Field label="Cup:Disc ratio" value={emr.cupToDiscRatio} />
          <Field label="Optic disc pallor" value={emr.opticDiscPallor ? 'Present' : 'Absent'} />
          <Field label="Macular edema" value={emr.macularEdema ? 'Present' : 'Absent'} />
          <Field label="DR grade" value={emr.diabeticRetinopathyGrade} />
        </Section>
      </div>

      {emr.nodalOfficerNote && (
        <>
          <Separator />
          <Section title="Nodal Officer Note">
            <p className="text-sm">{emr.nodalOfficerNote}</p>
          </Section>
        </>
      )}
    </div>
  );
}
