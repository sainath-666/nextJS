// Shared domain types for AP Vision Care platform.
// Mirrors the backend entity contracts (Patient, EMR, Camp, SpectacleOrder, etc.)

export type Role =
  | 'super_admin'
  | 'nodal_officer'
  | 'screening_team'
  | 'patient';

export type Gender = 'M' | 'F' | 'O';

export interface Patient {
  id: string;
  abhaNumber?: string;
  abhaAddress?: string;
  mobile: string;
  name: string;
  age: number;
  gender: Gender;
  district: string;
  mandal: string;
  village: string;
  registeredAt: string;
  registeredVia: 'abha' | 'mobile' | 'qr';
  lastVisit?: string;
}

export type EMROutcome = 'normal' | 'spectacles' | 'teleconsult' | 'referral';
export type EMRStatus = 'draft' | 'submitted' | 'approved' | 'rejected';

export interface EMR {
  id: string;
  patientId: string;
  patientName: string;
  campId: string;
  campName: string;
  screeningTeamId: string;
  screeningTeamName: string;
  district: string;
  // Symptoms
  diminishedVisionDistance: boolean;
  diminishedVisionNear: boolean;
  redness: boolean;
  watering: boolean;
  pain: boolean;
  blurredVision: boolean;
  photophobia: boolean;
  flashersFloaters: boolean;
  diplopia: boolean;
  digitalEyeStrain: boolean;
  // Ocular / systemic history
  diabetes: boolean;
  hypertension: boolean;
  thyroid: boolean;
  glaucomaHistory: boolean;
  cataractHistory: boolean;
  ocularTrauma: boolean;
  previousSurgery: boolean;
  existingGlassesPower?: string;
  // Vision assessment
  rightEyeUCDVA: string;
  rightEyeBCDVA: string;
  rightEyePH: string;
  leftEyeUCDVA: string;
  leftEyeBCDVA: string;
  leftEyePH: string;
  rightEyeUCNVA: string;
  leftEyeUCNVA: string;
  // Refraction
  rightEyeSph?: number;
  rightEyeCyl?: number;
  rightEyeAxis?: number;
  leftEyeSph?: number;
  leftEyeCyl?: number;
  leftEyeAxis?: number;
  addPowerRight?: number;
  addPowerLeft?: number;
  muscleFunctionTest?: string;
  iop?: string;
  colorVision?: string;
  // Retinal / fundus
  cupToDiscRatio?: string;
  opticDiscPallor: boolean;
  macularEdema: boolean;
  amd: boolean;
  diabeticRetinopathyGrade?: string;
  hypertensiveRetinopathyGrade?: string;
  // Decision
  outcome: EMROutcome;
  prescriptionId?: string;
  status: EMRStatus;
  nodalOfficerNote?: string;
  createdAt: string;
  submittedAt?: string;
}

export type CampType =
  | 'village'
  | 'tribal'
  | 'urban_slum'
  | 'school'
  | 'industrial';
export type CampStatus = 'scheduled' | 'active' | 'completed';

export interface Camp {
  id: string;
  name: string;
  type: CampType;
  district: string;
  mandal: string;
  village: string;
  lat: number;
  lng: number;
  scheduledDate: string;
  teamId: string;
  teamName: string;
  nodalOfficerId: string;
  status: CampStatus;
  patientCount: number;
  screenedCount: number;
}

export type SpectacleStatus =
  | 'pending'
  | 'manufacturing'
  | 'qa'
  | 'dispatched'
  | 'delivered';

export interface SpectacleOrder {
  id: string;
  patientId: string;
  patientName: string;
  emrId: string;
  prescriptionId: string;
  vendorId: string;
  vendorName: string;
  district: string;
  status: SpectacleStatus;
  rightLensSph: number;
  rightLensCyl: number;
  rightLensAxis: number;
  rightLensAdd: number;
  leftLensSph: number;
  leftLensCyl: number;
  leftLensAxis: number;
  leftLensAdd: number;
  frameType: string;
  frameSize: string;
  orderedAt: string;
  manufacturingStartedAt?: string;
  qaClearedAt?: string;
  dispatchedAt?: string;
  deliveredAt?: string;
  slaDeadline: string;
  slaBreached: boolean;
}

export type TeleconsultStatus =
  | 'scheduled'
  | 'waiting'
  | 'active'
  | 'completed'
  | 'cancelled';

export interface TeleconsultSession {
  id: string;
  patientId: string;
  patientName: string;
  emrId: string;
  ophthalmologistId: string;
  ophthalmologistName: string;
  district: string;
  status: TeleconsultStatus;
  roomId: string;
  scheduledAt: string;
  startedAt?: string;
  endedAt?: string;
  clinicalNotes?: string;
  diagnosis?: string;
  followUpRequired: boolean;
}

export type ReferralPriority = 'critical' | 'high' | 'routine';
export type ReferralStatus =
  | 'pending'
  | 'verified'
  | 'scheduled'
  | 'completed'
  | 'rejected';

export interface Referral {
  id: string;
  patientId: string;
  patientName: string;
  emrId: string;
  district: string;
  reason: string;
  priority: ReferralPriority;
  hospitalName: string;
  status: ReferralStatus;
  createdAt: string;
  scheduledAt?: string;
}

export interface Vendor {
  id: string;
  name: string;
  district: string;
  contactPerson: string;
  mobile: string;
  email: string;
  capacityPerDay: number;
  slaHours: number;
  rating: number;
  activeOrders: number;
  fulfilledOrders: number;
  slaBreaches: number;
  status: 'active' | 'suspended' | 'onboarding';
}

export interface ScreeningTeam {
  id: string;
  name: string;
  district: string;
  mandal: string;
  leadName: string;
  members: { name: string; role: string }[];
  assignedCampId?: string;
  assignedCampName?: string;
  patientsScreenedToday: number;
  status: 'active' | 'idle' | 'offline';
}

export interface District {
  id: string;
  name: string;
  lat: number;
  lng: number;
  population: number;
  campsTotal: number;
  campsActive: number;
  screened: number;
  target: number;
  spectaclesDelivered: number;
  referrals: number;
  slaBreaches: number;
  diseaseBurdenScore: number; // 0-100
}

export interface AuditLog {
  id: string;
  entityType: string;
  entityId: string;
  action: string;
  performedBy: string;
  performedByRole: Role | string;
  ipAddress: string;
  timestamp: string;
  summary: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  emrId: string;
  issuedAt: string;
  issuedBy: string;
  rightSph: number;
  rightCyl: number;
  rightAxis: number;
  rightAdd: number;
  leftSph: number;
  leftCyl: number;
  leftAxis: number;
  leftAdd: number;
  advice: string;
}

export interface DiseaseHotspot {
  district: string;
  mandal: string;
  lat: number;
  lng: number;
  condition: string;
  caseCount: number;
  severity: 'low' | 'medium' | 'high';
}

export interface AIPrediction {
  district: string;
  metric: string;
  current: number;
  predicted: number;
  confidence: number;
  horizon: string;
}

export interface KpiTrendPoint {
  label: string;
  screened: number;
  spectacles: number;
  referrals: number;
  teleconsults: number;
}
