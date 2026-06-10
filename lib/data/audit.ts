import type { AuditLog } from '../types';

export const AUDIT_LOGS: AuditLog[] = [
  { id: 'AL-99001', entityType: 'EMR', entityId: 'EMR-50233', action: 'APPROVE', performedBy: 'Sri K. Venkateswarlu', performedByRole: 'nodal_officer', ipAddress: '10.4.22.18', timestamp: '2026-06-11T10:06:00', summary: 'Approved EMR for teleconsult outcome' },
  { id: 'AL-99000', entityType: 'EMR', entityId: 'EMR-50232', action: 'SUBMIT', performedBy: 'M. Lakshmi', performedByRole: 'screening_team', ipAddress: '10.9.4.55', timestamp: '2026-06-11T09:40:00', summary: 'Submitted EMR with referral outcome' },
  { id: 'AL-98999', entityType: 'Patient', entityId: 'PAT-100241', action: 'CREATE', performedBy: 'M. Lakshmi', performedByRole: 'screening_team', ipAddress: '10.9.4.55', timestamp: '2026-06-11T10:48:00', summary: 'Registered new patient via QR scan-and-share' },
  { id: 'AL-98998', entityType: 'SpectacleOrder', entityId: 'SO-70011', action: 'CREATE', performedBy: 'System', performedByRole: 'system', ipAddress: '127.0.0.1', timestamp: '2026-06-11T09:15:00', summary: 'Auto-created spectacle order from approved prescription' },
  { id: 'AL-98995', entityType: 'Vendor', entityId: 'V-06', action: 'SUSPEND', performedBy: 'Dr. Anitha Rao', performedByRole: 'super_admin', ipAddress: '10.1.1.2', timestamp: '2026-06-10T17:20:00', summary: 'Suspended vendor for repeated SLA breaches (38)' },
  { id: 'AL-98990', entityType: 'TeleconsultSession', entityId: 'TC-2039', action: 'COMPLETE', performedBy: 'Dr. Suneetha Rao', performedByRole: 'tele_ophthalmologist', ipAddress: '10.7.3.41', timestamp: '2026-06-10T11:21:00', summary: 'Completed teleconsult, diagnosis recorded' },
  { id: 'AL-98985', entityType: 'Referral', entityId: 'REF-8795', action: 'SCHEDULE', performedBy: 'Sri K. Venkateswarlu', performedByRole: 'nodal_officer', ipAddress: '10.4.22.18', timestamp: '2026-06-10T12:30:00', summary: 'Scheduled critical referral at King George Hospital' },
  { id: 'AL-98980', entityType: 'SpectacleOrder', entityId: 'SO-70005', action: 'SLA_BREACH', performedBy: 'System', performedByRole: 'system', ipAddress: '127.0.0.1', timestamp: '2026-06-09T10:00:00', summary: 'SLA deadline crossed — nodal officer alerted' },
  { id: 'AL-98975', entityType: 'ABHA', entityId: 'PAT-100234', action: 'CARE_CONTEXT_LINK', performedBy: 'System', performedByRole: 'system', ipAddress: '127.0.0.1', timestamp: '2026-06-11T09:12:00', summary: 'Linked APVC-EMR-50231 care context to ABHA' },
];
