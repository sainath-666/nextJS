import type { Prescription } from '../types';

export const PRESCRIPTIONS: Prescription[] = [
  {
    id: 'RX-90011', patientId: 'PAT-100234', emrId: 'EMR-50231',
    issuedAt: '2026-06-11T09:10:00', issuedBy: 'M. Lakshmi (Optometrist)',
    rightSph: 0, rightCyl: 0, rightAxis: 0, rightAdd: 1.5,
    leftSph: 0, leftCyl: 0, leftAxis: 0, leftAdd: 1.5,
    advice: 'Progressive / near-vision glasses for presbyopia. Reduce screen time, 20-20-20 rule.',
  },
  {
    id: 'RX-90012', patientId: 'PAT-100239', emrId: 'EMR-50235',
    issuedAt: '2026-06-11T10:35:00', issuedBy: 'P. Srinivas (Optometrist)',
    rightSph: -1.5, rightCyl: -0.5, rightAxis: 90, rightAdd: 0,
    leftSph: -2.0, leftCyl: -0.75, leftAxis: 85, leftAdd: 0,
    advice: 'Single-vision distance glasses for myopia. Annual review advised.',
  },
];

export function getPrescription(id: string): Prescription | undefined {
  return PRESCRIPTIONS.find((p) => p.id === id);
}
