import type { Patient } from '../types';

export const PATIENTS: Patient[] = [
  { id: 'PAT-100234', abhaNumber: '12-3456-7890-1234', abhaAddress: 'raviteja@abdm', mobile: '9876543210', name: 'Ravi Teja', age: 47, gender: 'M', district: 'Guntur', mandal: 'Mangalagiri', village: 'Mangalagiri', registeredAt: '2026-06-11T08:42:00', registeredVia: 'qr', lastVisit: '2026-06-11T08:42:00' },
  { id: 'PAT-100235', abhaNumber: '11-2233-4455-6677', abhaAddress: 'lakshmi.d@abdm', mobile: '9000011122', name: 'Lakshmi Devi', age: 58, gender: 'F', district: 'Guntur', mandal: 'Mangalagiri', village: 'Mangalagiri', registeredAt: '2026-06-11T09:05:00', registeredVia: 'abha', lastVisit: '2026-06-11T09:05:00' },
  { id: 'PAT-100236', mobile: '9123456780', name: 'Suresh Babu', age: 35, gender: 'M', district: 'Guntur', mandal: 'Tadepalli', village: 'Tadepalli', registeredAt: '2026-06-11T09:20:00', registeredVia: 'mobile', lastVisit: '2026-06-11T09:20:00' },
  { id: 'PAT-100237', abhaNumber: '14-5566-7788-9900', abhaAddress: 'padma@abdm', mobile: '9988776655', name: 'Padmavathi', age: 64, gender: 'F', district: 'Guntur', mandal: 'Mangalagiri', village: 'Atmakur', registeredAt: '2026-06-11T09:38:00', registeredVia: 'qr', lastVisit: '2026-06-11T09:38:00' },
  { id: 'PAT-100238', mobile: '9555544433', name: 'Md. Imran', age: 29, gender: 'M', district: 'Guntur', mandal: 'Mangalagiri', village: 'Mangalagiri', registeredAt: '2026-06-11T10:02:00', registeredVia: 'mobile', lastVisit: '2026-06-11T10:02:00' },
  { id: 'PAT-100239', abhaNumber: '13-9090-8080-7070', abhaAddress: 'anjali@abdm', mobile: '9444433322', name: 'Anjali Kumari', age: 12, gender: 'F', district: 'Guntur', mandal: 'Tadepalli', village: 'Tadepalli', registeredAt: '2026-06-11T10:15:00', registeredVia: 'abha', lastVisit: '2026-06-11T10:15:00' },
  { id: 'PAT-100240', mobile: '9333322211', name: 'Venkata Rao', age: 71, gender: 'M', district: 'Guntur', mandal: 'Mangalagiri', village: 'Nidamarru', registeredAt: '2026-06-11T10:30:00', registeredVia: 'mobile', lastVisit: '2026-06-11T10:30:00' },
  { id: 'PAT-100241', abhaNumber: '12-1212-3434-5656', abhaAddress: 'sitamma@abdm', mobile: '9222211100', name: 'Sitamma', age: 53, gender: 'F', district: 'Guntur', mandal: 'Mangalagiri', village: 'Mangalagiri', registeredAt: '2026-06-11T10:48:00', registeredVia: 'qr', lastVisit: '2026-06-11T10:48:00' },
];

export function getPatient(id: string): Patient | undefined {
  return PATIENTS.find((p) => p.id === id);
}
