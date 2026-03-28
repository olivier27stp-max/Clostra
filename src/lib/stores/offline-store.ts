import { create } from 'zustand';

interface OfflineState {
  isOnline: boolean;
  pendingCount: number;
  lastSyncedAt: string | null;
  isSyncing: boolean;
  errors: string[];
  setOnline: (online: boolean) => void;
  incrementPending: () => void;
  decrementPending: () => void;
  setSyncing: (syncing: boolean) => void;
  setLastSynced: (date: string) => void;
  addError: (error: string) => void;
  clearErrors: () => void;
}

export const useOfflineStore = create<OfflineState>((set) => ({
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  pendingCount: 0,
  lastSyncedAt: null,
  isSyncing: false,
  errors: [],

  setOnline: (online) => set({ isOnline: online }),

  incrementPending: () =>
    set((state) => ({ pendingCount: state.pendingCount + 1 })),

  decrementPending: () =>
    set((state) => ({
      pendingCount: Math.max(0, state.pendingCount - 1),
    })),

  setSyncing: (syncing) => set({ isSyncing: syncing }),

  setLastSynced: (date) => set({ lastSyncedAt: date }),

  addError: (error) =>
    set((state) => ({ errors: [...state.errors, error] })),

  clearErrors: () => set({ errors: [] }),
}));
