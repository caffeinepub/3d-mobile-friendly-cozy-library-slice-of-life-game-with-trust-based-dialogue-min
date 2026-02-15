import { create } from 'zustand';

interface PlayerControlsState {
  // Joystick movement input (from mobile or other sources)
  joystickX: number;
  joystickY: number;
  
  // Look delta input
  lookDeltaX: number;
  lookDeltaY: number;
  
  // Jump request (one-shot)
  jumpRequested: boolean;
  
  // Actions
  setJoystick: (x: number, y: number) => void;
  setLookDelta: (x: number, y: number) => void;
  requestJump: () => void;
  consumeJump: () => boolean;
  reset: () => void;
}

export const usePlayerControlsStore = create<PlayerControlsState>((set, get) => ({
  joystickX: 0,
  joystickY: 0,
  lookDeltaX: 0,
  lookDeltaY: 0,
  jumpRequested: false,
  
  setJoystick: (x: number, y: number) => set({ joystickX: x, joystickY: y }),
  
  setLookDelta: (x: number, y: number) => set({ lookDeltaX: x, lookDeltaY: y }),
  
  requestJump: () => set({ jumpRequested: true }),
  
  consumeJump: () => {
    const state = get();
    if (state.jumpRequested) {
      set({ jumpRequested: false });
      return true;
    }
    return false;
  },
  
  reset: () => set({
    joystickX: 0,
    joystickY: 0,
    lookDeltaX: 0,
    lookDeltaY: 0,
    jumpRequested: false,
  }),
}));
