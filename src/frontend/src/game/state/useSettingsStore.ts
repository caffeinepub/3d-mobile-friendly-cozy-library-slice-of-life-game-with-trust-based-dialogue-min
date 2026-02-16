import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsStore {
  aimSensitivity: number;
  setAimSensitivity: (sensitivity: number) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      aimSensitivity: 1.0, // Default 100% sensitivity
      setAimSensitivity: (sensitivity: number) => set({ aimSensitivity: sensitivity }),
    }),
    {
      name: 'cozy-library-settings',
    }
  )
);
