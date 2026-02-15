import { useEffect, useState, useCallback } from 'react';
import { useGameStore } from '../state/useGameStore';
import { useTerminalStore } from '../../ui/terminal/useTerminalStore';

interface ControlState {
  movement: { x: number; z: number };
  look: { x: number; y: number };
}

export function usePlayerControls() {
  const { isPaused } = useGameStore();
  const { isOpen: isTerminalOpen } = useTerminalStore();
  const [keys, setKeys] = useState<Set<string>>(new Set());
  const [joystick, setJoystick] = useState({ x: 0, y: 0 });
  const [lookDelta, setLookDelta] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Don't process keyboard input if paused or terminal is open
    if (isPaused || isTerminalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys(prev => new Set(prev).add(e.key.toLowerCase()));
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
  }, [isPaused, isTerminalOpen]);

  const updateJoystick = useCallback((x: number, y: number) => {
    setJoystick({ x, y });
  }, []);

  const updateLook = useCallback((x: number, y: number) => {
    setLookDelta({ x, y });
  }, []);

  // Calculate movement from keyboard
  let moveX = 0;
  let moveZ = 0;

  if (keys.has('w') || keys.has('arrowup')) moveZ -= 1;
  if (keys.has('s') || keys.has('arrowdown')) moveZ += 1;
  if (keys.has('a') || keys.has('arrowleft')) moveX -= 1;
  if (keys.has('d') || keys.has('arrowright')) moveX += 1;

  // Combine with joystick input
  moveX += joystick.x;
  moveZ += joystick.y;

  // Normalize
  const magnitude = Math.sqrt(moveX * moveX + moveZ * moveZ);
  if (magnitude > 1) {
    moveX /= magnitude;
    moveZ /= magnitude;
  }

  return {
    movement: { x: moveX, z: moveZ },
    look: lookDelta,
    updateJoystick,
    updateLook,
  };
}
