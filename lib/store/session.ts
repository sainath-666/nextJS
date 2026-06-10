'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Role } from '../types';

interface SessionState {
  role: Role | null;
  setRole: (role: Role) => void;
  clear: () => void;
}

export const useSession = create<SessionState>()(
  persist(
    (set) => ({
      role: null,
      setRole: (role) => set({ role }),
      clear: () => set({ role: null }),
    }),
    { name: 'apvc-session' },
  ),
);
