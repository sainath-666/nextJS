import type { Role } from './types';

export const ROLE_COOKIE = 'apvc-role';

export interface DemoUser {
  role: Role;
  name: string;
  title: string;
  district?: string;
  loginHint: string; // how this role authenticates per spec
  home: string;
}

export const DEMO_USERS: Record<Role, DemoUser> = {
  super_admin: {
    role: 'super_admin',
    name: 'Dr. Anitha Rao',
    title: 'State Programme Director (SPMU)',
    loginHint: 'Username + Password + TOTP',
    home: '/portal/super-admin/dashboard',
  },
  nodal_officer: {
    role: 'nodal_officer',
    name: 'Sri K. Venkateswarlu',
    title: 'District Nodal Officer',
    district: 'Guntur',
    loginHint: 'Username + OTP',
    home: '/portal/nodal-officer/dashboard',
  },
  screening_team: {
    role: 'screening_team',
    name: 'M. Lakshmi (Optometrist)',
    title: 'Screening Team Lead',
    district: 'Guntur',
    loginHint: 'Username + OTP',
    home: '/portal/screening-team/dashboard',
  },
  patient: {
    role: 'patient',
    name: 'Ravi Teja',
    title: 'Citizen',
    district: 'Guntur',
    loginHint: 'Mobile number + OTP',
    home: '/portal/patient/dashboard',
  },
};

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: 'Super Admin · SPMU',
  nodal_officer: 'Nodal Officer · District',
  screening_team: 'Screening Team',
  patient: 'Patient / Citizen',
};

/** Map a portal path prefix to the role that owns it. */
export function roleForPath(pathname: string): Role | null {
  if (pathname.startsWith('/portal/super-admin')) return 'super_admin';
  if (pathname.startsWith('/portal/nodal-officer')) return 'nodal_officer';
  if (pathname.startsWith('/portal/screening-team')) return 'screening_team';
  if (pathname.startsWith('/portal/patient')) return 'patient';
  return null;
}
