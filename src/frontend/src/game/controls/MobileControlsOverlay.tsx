import { useEffect, useRef, useState } from 'react';
import { usePlayerControls } from './usePlayerControls';
import { Button } from '@/components/ui/button';
import { useGameStore } from '../state/useGameStore';
import { useTerminalStore } from '../../ui/terminal/useTerminalStore';

export default function MobileControlsOverlay() {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const { updateJoystick, updateLook, triggerJump } = usePlayerControls();
  const { isPaused } = useGameStore();
  const { isOpen: isTerminalOpen } = useTerminalStore();
  const joystickRef = useRef<HTMLDivElement>(null);
  const lookRef = useRef<HTMLDivElement>(null);
  const [joystickActive, setJoystickActive] = useState(false);
  const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  useEffect(() => {
    if (!isTouchDevice) return;

    const handleJoystickMove = (e: TouchEvent) => {
      if (!joystickRef.current || !joystickActive) return;
      e.preventDefault();

      const touch = e.touches[0];
      const rect = joystickRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = touch.clientX - centerX;
      const deltaY = touch.clientY - centerY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const maxDistance = rect.width / 2;

      const clampedDistance = Math.min(distance, maxDistance);
      const angle = Math.atan2(deltaY, deltaX);

      const x = (Math.cos(angle) * clampedDistance) / maxDistance;
      const y = (Math.sin(angle) * clampedDistance) / maxDistance;

      setJoystickPos({ x: x * 40, y: y * 40 });
      updateJoystick(x, y);
    };

    const handleJoystickEnd = () => {
      setJoystickActive(false);
      setJoystickPos({ x: 0, y: 0 });
      updateJoystick(0, 0);
    };

    if (joystickActive) {
      window.addEventListener('touchmove', handleJoystickMove, { passive: false });
      window.addEventListener('touchend', handleJoystickEnd);
    }

    return () => {
      window.removeEventListener('touchmove', handleJoystickMove);
      window.removeEventListener('touchend', handleJoystickEnd);
    };
  }, [isTouchDevice, joystickActive, updateJoystick]);

  useEffect(() => {
    if (!isTouchDevice || !lookRef.current) return;

    let lastTouch = { x: 0, y: 0 };

    const handleLookMove = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      
      if (lastTouch.x !== 0) {
        const deltaX = (touch.clientX - lastTouch.x) * 0.002;
        const deltaY = (touch.clientY - lastTouch.y) * 0.002;
        updateLook(-deltaX, -deltaY);
      }

      lastTouch = { x: touch.clientX, y: touch.clientY };
    };

    const handleLookEnd = () => {
      lastTouch = { x: 0, y: 0 };
      updateLook(0, 0);
    };

    const lookElement = lookRef.current;
    lookElement.addEventListener('touchmove', handleLookMove, { passive: false });
    lookElement.addEventListener('touchend', handleLookEnd);

    return () => {
      lookElement.removeEventListener('touchmove', handleLookMove);
      lookElement.removeEventListener('touchend', handleLookEnd);
    };
  }, [isTouchDevice, updateLook]);

  const handleJumpClick = () => {
    triggerJump();
  };

  if (!isTouchDevice) return null;

  const isDisabled = isPaused || isTerminalOpen;

  return (
    <>
      {/* Joystick */}
      <div className="absolute bottom-8 left-8 pointer-events-auto">
        <div
          ref={joystickRef}
          onTouchStart={() => !isDisabled && setJoystickActive(true)}
          className="relative w-32 h-32 rounded-full bg-muted/40 backdrop-blur-sm border-2 border-muted-foreground/20"
        >
          <div
            className="absolute top-1/2 left-1/2 w-12 h-12 rounded-full bg-primary/60 border-2 border-primary-foreground/40 transition-transform"
            style={{
              transform: `translate(calc(-50% + ${joystickPos.x}px), calc(-50% + ${joystickPos.y}px))`,
            }}
          />
        </div>
      </div>

      {/* Jump Button */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-auto">
        <Button
          size="lg"
          onClick={handleJumpClick}
          disabled={isDisabled}
          className="px-8 py-6 text-lg font-semibold shadow-lg"
        >
          Jump
        </Button>
      </div>

      {/* Look area */}
      <div
        ref={lookRef}
        className="absolute bottom-8 right-8 w-32 h-32 rounded-full bg-muted/40 backdrop-blur-sm border-2 border-muted-foreground/20 pointer-events-auto flex items-center justify-center"
      >
        <span className="text-xs text-muted-foreground">Look</span>
      </div>
    </>
  );
}
