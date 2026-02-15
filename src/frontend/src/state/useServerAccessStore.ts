import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ServerAccessStore {
  serverAccessEnabled: boolean;
  enableServerAccess: () => void;
  disableServerAccess: () => void;
  toggleServerAccess: () => void;
}

export const useServerAccessStore = create<ServerAccessStore>()(
  persist(
    (set) => ({
      serverAccessEnabled: true,

      enableServerAccess: () => set({ serverAccessEnabled: true }),
      disableServerAccess: () => set({ serverAccessEnabled: false }),
      toggleServerAccess: () =>
        set((state) => ({ serverAccessEnabled: !state.serverAccessEnabled })),
    }),
    {
      name: 'server-access-settings',
    }
  )
);
