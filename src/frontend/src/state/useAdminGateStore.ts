import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ADMIN_USERNAME, ADMIN_GATE_STORAGE_KEY } from '../config/adminGate';

interface AdminGateStore {
  isUnlocked: boolean;
  attemptUnlock: (username: string) => boolean;
  lock: () => void;
}

export const useAdminGateStore = create<AdminGateStore>()(
  persist(
    (set) => ({
      isUnlocked: false,

      attemptUnlock: (username: string) => {
        // Exact case-sensitive match required
        const success = username === ADMIN_USERNAME;
        if (success) {
          set({ isUnlocked: true });
        }
        return success;
      },

      lock: () => set({ isUnlocked: false }),
    }),
    {
      name: ADMIN_GATE_STORAGE_KEY,
    }
  )
);

