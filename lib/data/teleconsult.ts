import type { TeleconsultSession } from '../types';

export const TELECONSULTS: TeleconsultSession[] = [
  { id: 'TC-2041', patientId: 'PAT-100237', patientName: 'Padmavathi', emrId: 'EMR-50233', ophthalmologistId: 'OPH-07', ophthalmologistName: 'Dr. Suneetha Rao', district: 'Guntur', status: 'scheduled', roomId: 'room-tc-2041', scheduledAt: '2026-06-11T15:30:00', followUpRequired: false },
  { id: 'TC-2042', patientId: 'PAT-100250', patientName: 'Nagaraju', emrId: 'EMR-50240', ophthalmologistId: 'OPH-03', ophthalmologistName: 'Dr. Kiran Kumar', district: 'Guntur', status: 'waiting', roomId: 'room-tc-2042', scheduledAt: '2026-06-11T14:00:00', followUpRequired: false },
  { id: 'TC-2039', patientId: 'PAT-100231', patientName: 'Bhargavi', emrId: 'EMR-50225', ophthalmologistId: 'OPH-07', ophthalmologistName: 'Dr. Suneetha Rao', district: 'Visakhapatnam', status: 'completed', roomId: 'room-tc-2039', scheduledAt: '2026-06-10T11:00:00', startedAt: '2026-06-10T11:03:00', endedAt: '2026-06-10T11:21:00', clinicalNotes: 'Early glaucomatous changes. Started on Timolol 0.5% BD. Review in 4 weeks.', diagnosis: 'Primary Open-Angle Glaucoma (suspect)', followUpRequired: true },
  { id: 'TC-2038', patientId: 'PAT-100228', patientName: 'Sai Kumar', emrId: 'EMR-50220', ophthalmologistId: 'OPH-03', ophthalmologistName: 'Dr. Kiran Kumar', district: 'Anantapur', status: 'cancelled', roomId: 'room-tc-2038', scheduledAt: '2026-06-09T16:00:00', followUpRequired: false },
];

export function getTeleconsult(id: string): TeleconsultSession | undefined {
  return TELECONSULTS.find((t) => t.id === id);
}
