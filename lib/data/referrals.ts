import type { Referral } from '../types';

export const REFERRALS: Referral[] = [
  { id: 'REF-8801', patientId: 'PAT-100235', patientName: 'Lakshmi Devi', emrId: 'EMR-50232', district: 'Guntur', reason: 'Moderate NPDR with macular edema — needs retina specialist + OCT', priority: 'high', hospitalName: 'Govt. Regional Eye Hospital, Guntur', status: 'pending', createdAt: '2026-06-11T09:40:00' },
  { id: 'REF-8802', patientId: 'PAT-100240', patientName: 'Venkata Rao', emrId: 'EMR-50236', district: 'Guntur', reason: 'Bilateral mature cataract — surgical referral', priority: 'routine', hospitalName: 'Govt. Regional Eye Hospital, Guntur', status: 'pending', createdAt: '2026-06-11T10:45:00' },
  { id: 'REF-8795', patientId: 'PAT-100222', patientName: 'Mohan Das', emrId: 'EMR-50195', district: 'Visakhapatnam', reason: 'Retinal detachment suspected — flashers & floaters, urgent', priority: 'critical', hospitalName: 'King George Hospital, Vizag', status: 'scheduled', createdAt: '2026-06-10T12:10:00', scheduledAt: '2026-06-12T09:00:00' },
  { id: 'REF-8790', patientId: 'PAT-100215', patientName: 'Janaki', emrId: 'EMR-50180', district: 'Anantapur', reason: 'Advanced glaucoma — CDR 0.9, IOP 32', priority: 'critical', hospitalName: 'Govt. Eye Hospital, Anantapur', status: 'verified', createdAt: '2026-06-09T15:30:00' },
  { id: 'REF-8780', patientId: 'PAT-100208', patientName: ' Rahim Khan', emrId: 'EMR-50160', district: 'Kurnool', reason: 'Corneal ulcer — needs urgent management', priority: 'high', hospitalName: 'Govt. General Hospital, Kurnool', status: 'completed', createdAt: '2026-06-07T10:00:00', scheduledAt: '2026-06-08T10:00:00' },
];

export function getReferralsByPatient(patientId: string): Referral[] {
  return REFERRALS.filter((r) => r.patientId === patientId);
}
