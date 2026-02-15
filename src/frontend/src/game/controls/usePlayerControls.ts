import { useEffect, useState, useCallback } from 'react';
import { useGameStore } from '../state/useGameStore';
import { useTerminalStore } from '../../ui/terminal/useTerminalStore';
import { usePlayerControlsStore } from './usePlayerControlsStore';

interface ControlState {
  movement: { x: number; z: number };
  look: { x: number; y: number };
}

export function usePlayerControls() {
  const { isPaused } = useGameStore();
  const { isOpen: isTerminalOpen } = useTerminalStore();
  const [keys, setKeys] = useState<Set<string>>(new Set());
  const controlsStore = usePlayerControlsStore();

  useEffect(() => {
    // Don't process keyboard input if paused or terminal is open
    if (isPaused || isTerminalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      
      // Handle jump (Space key) - only trigger once per press
      if (key === ' ' && !keys.has(' ')) {
        e.preventDefault();
        controlsStore.requestJump();
      }
      
      setKeys(prev => new Set(prev).add(key));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys(prev => {
        const next = new Set(prev);
        next.delete(e.key.toLowerCase());
        return next;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPaused, isTerminalOpen, keys, controlsStore]);

  // Clear controls when paused or terminal open
  useEffect(() => {
    if (isPaused || isTerminalOpen) {
      controlsStore.reset();
      setKeys(new Set());
    }
  }, [isPaused, isTerminalOpen, controlsStore]);

  const updateJoystick = useCallback((x: number, y: number) => {
    controlsStore.setJoystick(x, y);
  }, [controlsStore]);

  const updateLook = useCallback((x: number, y: number) => {
    controlsStore.setLookDelta(x, y);
  }, [controlsStore]);

  const triggerJump = useCallback(() => {
    if (!isPaused && !isTerminalOpen) {
      controlsStore.requestJump();
    }
  }, [isPaused, isTerminalOpen, controlsStore]);

  // Calculate movement from keyboard
  let moveX = 0;
  let moveZ = 0;

  // Only process movement if not paused/terminal open
  if (!isPaused && !isTerminalOpen) {
    if (keys.has('w') || keys.has('arrowup')) moveZ -= 1;
    if (keys.has('s') || keys.has('arrowdown')) moveZ += 1;
    if (keys.has('a') || keys.has('arrowleft')) moveX -= 1;
    if (keys.has('d') || keys.has('arrowright')) moveX += 1;

    // Combine with joystick input
    moveX += controlsStore.joystickX;
    moveZ += controlsStore.joystickY;
  }

  // Normalize
  const magnitude = Math.sqrt(moveX * moveX + moveZ * moveZ);
  if (magnitude > 1) {
    moveX /= magnitude;
    moveZ /= magnitude;
  }

  return {
    movement: { x: moveX, z: moveZ },
    look: { x: controlsStore.lookDeltaX, y: controlsStore.lookDeltaY },
    updateJoystick,
    updateLook,
    triggerJump,
  };
}
