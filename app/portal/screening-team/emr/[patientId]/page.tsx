import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EMRForm } from '@/components/emr/emr-form';
import { getPatient } from '@/lib/data';
import { maskAbha } from '@/lib/utils';

export default function EmrPage({ params }: { params: { patientId: string } }) {
  const patient = getPatient(params.patientId);
  if (!patient) notFound();

  return (
    <>
      <Link
        href="/portal/screening-team/patients"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to patients
      </Link>

      <PageHeader
        title={`EMR · ${patient.name}`}
        description={`${patient.age}y ${patient.gender} · ${patient.village}, ${patient.district}`}
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="outline">{patient.id}</Badge>
            {patient.abhaNumber && <Badge variant="secondary">ABHA {maskAbha(patient.abhaNumber)}</Badge>}
          </div>
        }
      />

      <EMRForm patient={patient} />
    </>
  );
}
