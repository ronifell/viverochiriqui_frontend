'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Role = 'public' | 'wholesale' | 'admin';

interface AdminUser {
  id: string;
  email: string;
  name: string | null;
}

interface AuthState {
  wholesaleToken: string | null;
  adminToken: string | null;
  adminUser: AdminUser | null;
  setWholesale: (token: string | null) => void;
  setAdmin: (token: string | null, user?: AdminUser | null) => void;
  isWholesale: () => boolean;
  isAdmin: () => boolean;
  effectiveRole: () => Role;
  logoutWholesale: () => void;
  logoutAdmin: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      wholesaleToken: null,
      adminToken: null,
      adminUser: null,
      setWholesale: (token) => set({ wholesaleToken: token }),
      setAdmin: (token, user = null) =>
        set({ adminToken: token, adminUser: user || null }),
      isWholesale: () => !!get().wholesaleToken,
      isAdmin: () => !!get().adminToken,
      effectiveRole: () => {
        if (get().adminToken) return 'admin';
        if (get().wholesaleToken) return 'wholesale';
        return 'public';
      },
      logoutWholesale: () => set({ wholesaleToken: null }),
      logoutAdmin: () => set({ adminToken: null, adminUser: null }),
    }),
    {
      name: 'vc-auth',
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);
