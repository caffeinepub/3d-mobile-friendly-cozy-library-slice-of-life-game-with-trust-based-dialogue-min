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
  const lookAreaRef = useRef<HTMLDivElement>(null);
  const [joystickActive, setJoystickActive] = useState(false);
  const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });
  
  // Track active look touch
  const lookTouchRef = useRef<{ id: number; lastX: number; lastY: number } | null>(null);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  const isDisabled = isPaused || isTerminalOpen;

  // Joystick handling
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

  // Look area handling - right side of screen
  useEffect(() => {
    if (!isTouchDevice || !lookAreaRef.current) return;

    const lookElement = lookAreaRef.current;

    const handleLookStart = (e: TouchEvent) => {
      if (isDisabled) return;
      
      // Find a touch that started in the look area
      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        const rect = lookElement.getBoundingClientRect();
        
        if (
          touch.clientX >= rect.left &&
          touch.clientX <= rect.right &&
          touch.clientY >= rect.top &&
          touch.clientY <= rect.bottom
        ) {
          // Initialize look tracking with this touch
          lookTouchRef.current = {
            id: touch.identifier,
            lastX: touch.clientX,
            lastY: touch.clientY,
          };
          break;
        }
      }
    };

    const handleLookMove = (e: TouchEvent) => {
      if (isDisabled || !lookTouchRef.current) return;
      
      // Find the tracked touch
      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        if (touch.identifier === lookTouchRef.current.id) {
          e.preventDefault();
          
          const deltaX = (touch.clientX - lookTouchRef.current.lastX) * 0.003;
          const deltaY = (touch.clientY - lookTouchRef.current.lastY) * 0.003;
          
          updateLook(-deltaX, -deltaY);
          
          // Update last position
          lookTouchRef.current.lastX = touch.clientX;
          lookTouchRef.current.lastY = touch.clientY;
          break;
        }
      }
    };

    const handleLookEnd = (e: TouchEvent) => {
      if (!lookTouchRef.current) return;
      
      // Check if our tracked touch ended
      let touchEnded = true;
      for (let i = 0; i < e.touches.length; i++) {
        if (e.touches[i].identifier === lookTouchRef.current.id) {
          touchEnded = false;
          break;
        }
      }
      
      if (touchEnded) {
        lookTouchRef.current = null;
        updateLook(0, 0);
      }
    };

    const handleLookCancel = () => {
      lookTouchRef.current = null;
      updateLook(0, 0);
    };

    lookElement.addEventListener('touchstart', handleLookStart, { passive: true });
    lookElement.addEventListener('touchmove', handleLookMove, { passive: false });
    lookElement.addEventListener('touchend', handleLookEnd, { passive: true });
    lookElement.addEventListener('touchcancel', handleLookCancel, { passive: true });

    return () => {
      lookElement.removeEventListener('touchstart', handleLookStart);
      lookElement.removeEventListener('touchmove', handleLookMove);
      lookElement.removeEventListener('touchend', handleLookEnd);
      lookElement.removeEventListener('touchcancel', handleLookCancel);
    };
  }, [isTouchDevice, updateLook, isDisabled]);

  // Reset look when disabled
  useEffect(() => {
    if (isDisabled) {
      lookTouchRef.current = null;
      updateLook(0, 0);
    }
  }, [isDisabled, updateLook]);

  const handleJumpClick = () => {
    triggerJump();
  };

  if (!isTouchDevice) return null;

  return (
    <>
      {/* Joystick - left side */}
      <div className="absolute bottom-8 left-8 pointer-events-auto z-10">
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

      {/* Jump Button - center */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-auto z-10">
        <Button
          size="lg"
          onClick={handleJumpClick}
          disabled={isDisabled}
          className="px-8 py-6 text-lg font-semibold shadow-lg"
        >
          Jump
        </Button>
      </div>

      {/* Look area - right half of screen */}
      <div
        ref={lookAreaRef}
        className="absolute top-0 right-0 w-1/2 h-full pointer-events-auto"
        style={{
          touchAction: 'none',
        }}
      />
    </>
  );
}
