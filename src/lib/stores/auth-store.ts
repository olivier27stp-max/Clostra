import { create } from 'zustand';
import type { Row, UserRole } from '@/types/database';
import { Permission, RolePermissionSets } from '@/types/permissions';

interface AuthState {
  profile: Row<'profiles'> | null;
  role: UserRole | null;
  isLoading: boolean;
  setProfile: (profile: Row<'profiles'> | null) => void;
  clearProfile: () => void;
  hasPermission: (permission: Permission) => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  profile: null,
  role: null,
  isLoading: true,

  setProfile: (profile) =>
    set({
      profile,
      role: profile?.role ?? null,
      isLoading: false,
    }),

  clearProfile: () =>
    set({
      profile: null,
      role: null,
      isLoading: false,
    }),

  hasPermission: (permission: Permission) => {
    const { role } = get();
    if (!role) return false;
    return RolePermissionSets[role].has(permission);
  },
}));
