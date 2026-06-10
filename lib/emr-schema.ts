import { z } from 'zod';
import type { EMROutcome } from './types';

export const emrSchema = z.object({
  // Step 1 — Symptoms & history
  diminishedVisionDistance: z.boolean().default(false),
  diminishedVisionNear: z.boolean().default(false),
  redness: z.boolean().default(false),
  watering: z.boolean().default(false),
  pain: z.boolean().default(false),
  blurredVision: z.boolean().default(false),
  photophobia: z.boolean().default(false),
  flashersFloaters: z.boolean().default(false),
  diplopia: z.boolean().default(false),
  digitalEyeStrain: z.boolean().default(false),
  diabetes: z.boolean().default(false),
  hypertension: z.boolean().default(false),
  thyroid: z.boolean().default(false),
  glaucomaHistory: z.boolean().default(false),
  cataractHistory: z.boolean().default(false),
  ocularTrauma: z.boolean().default(false),
  previousSurgery: z.boolean().default(false),
  existingGlassesPower: z.string().optional(),

  // Step 2 — Vision assessment
  rightEyeUCDVA: z.string().min(1, 'Required'),
  rightEyeBCDVA: z.string().optional().default(''),
  rightEyePH: z.string().optional().default(''),
  leftEyeUCDVA: z.string().min(1, 'Required'),
  leftEyeBCDVA: z.string().optional().default(''),
  leftEyePH: z.string().optional().default(''),
  rightEyeUCNVA: z.string().optional().default(''),
  leftEyeUCNVA: z.string().optional().default(''),

  // Step 3 — Refraction
  rightEyeSph: z.coerce.number().optional(),
  rightEyeCyl: z.coerce.number().optional(),
  rightEyeAxis: z.coerce.number().min(0).max(180).optional(),
  leftEyeSph: z.coerce.number().optional(),
  leftEyeCyl: z.coerce.number().optional(),
  leftEyeAxis: z.coerce.number().min(0).max(180).optional(),
  addPowerRight: z.coerce.number().optional(),
  addPowerLeft: z.coerce.number().optional(),
  iop: z.string().optional().default(''),
  colorVision: z.string().optional().default(''),

  // Step 4 — Fundus / retinal
  cupToDiscRatio: z.string().optional().default(''),
  opticDiscPallor: z.boolean().default(false),
  macularEdema: z.boolean().default(false),
  amd: z.boolean().default(false),
  diabeticRetinopathyGrade: z.string().optional().default(''),
  hypertensiveRetinopathyGrade: z.string().optional().default(''),
});

export type EMRFormData = z.infer<typeof emrSchema>;

/** Parse Snellen "6/x" into a numeric denominator for comparison. */
function snellenDenominator(va: string): number {
  const m = va.match(/6\s*\/\s*(\d+)/);
  if (m) return parseInt(m[1], 10);
  // 3/60, "CF", "HM", "PL" etc. → treat as poor vision
  if (/\d+\s*\/\s*60/.test(va)) return 60;
  if (/CF|HM|PL|PR/i.test(va)) return 120;
  return 6;
}

function hasFundusAbnormality(d: EMRFormData): boolean {
  const cdr = parseFloat(d.cupToDiscRatio || '0');
  return (
    d.opticDiscPallor ||
    d.macularEdema ||
    d.amd ||
    cdr >= 0.6 ||
    !!d.diabeticRetinopathyGrade ||
    !!d.hypertensiveRetinopathyGrade
  );
}

function needsTeleconsult(d: EMRFormData): boolean {
  const iop = parseInt((d.iop || '').replace(/\D/g, ''), 10);
  return (
    d.glaucomaHistory ||
    d.flashersFloaters ||
    d.diplopia ||
    (Number.isFinite(iop) && iop >= 22)
  );
}

/**
 * Outcome decision engine (mirrors screening-service business logic).
 * VA worse than 6/18 in either eye triggers further pathways.
 */
export function determineOutcome(d: EMRFormData): EMROutcome {
  const worstVA = Math.max(
    snellenDenominator(d.rightEyeUCDVA),
    snellenDenominator(d.leftEyeUCDVA),
  );

  if (hasFundusAbnormality(d)) return 'referral';
  if (worstVA > 18) {
    if (needsTeleconsult(d)) return 'teleconsult';
    return 'spectacles';
  }
  if (needsTeleconsult(d)) return 'teleconsult';
  return 'normal';
}
