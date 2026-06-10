import type { ScreeningTeam } from '../types';

export const TEAMS: ScreeningTeam[] = [
  {
    id: 'TM-12', name: 'Guntur Team Alpha', district: 'Guntur', mandal: 'Mangalagiri',
    leadName: 'M. Lakshmi (Optometrist)',
    members: [
      { name: 'M. Lakshmi', role: 'Optometrist' },
      { name: 'K. Ramesh', role: 'Ophthalmic Assistant' },
      { name: 'S. Devi', role: 'Data Entry Operator' },
    ],
    assignedCampId: 'CMP-3401', assignedCampName: 'Mangalagiri PHC Camp',
    patientsScreenedToday: 112, status: 'active',
  },
  {
    id: 'TM-13', name: 'Guntur Team Bravo', district: 'Guntur', mandal: 'Tadepalli',
    leadName: 'P. Srinivas (Optometrist)',
    members: [
      { name: 'P. Srinivas', role: 'Optometrist' },
      { name: 'A. Kumar', role: 'Ophthalmic Assistant' },
    ],
    assignedCampId: 'CMP-3402', assignedCampName: 'Tadepalli ZP School',
    patientsScreenedToday: 95, status: 'active',
  },
  {
    id: 'TM-14', name: 'Guntur Team Charlie', district: 'Guntur', mandal: 'Ponnur',
    leadName: 'R. Swathi (Optometrist)',
    members: [
      { name: 'R. Swathi', role: 'Optometrist' },
      { name: 'T. Naidu', role: 'Ophthalmic Assistant' },
    ],
    patientsScreenedToday: 0, status: 'idle',
  },
  {
    id: 'TM-15', name: 'Guntur Team Delta', district: 'Guntur', mandal: 'Bapatla',
    leadName: 'J. Prasad (Optometrist)',
    members: [
      { name: 'J. Prasad', role: 'Optometrist' },
      { name: 'L. Reddy', role: 'Data Entry Operator' },
    ],
    patientsScreenedToday: 0, status: 'offline',
  },
];

export function getTeam(id: string): ScreeningTeam | undefined {
  return TEAMS.find((t) => t.id === id);
}
