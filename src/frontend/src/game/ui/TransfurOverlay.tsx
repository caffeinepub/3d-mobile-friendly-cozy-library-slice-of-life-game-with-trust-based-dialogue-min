import { useEffect, useState } from 'react';

interface TransfurOverlayProps {
  message: string;
  onComplete: () => void;
}

export default function TransfurOverlay({ message, onComplete }: TransfurOverlayProps) {
  const [opacity, setOpacity] = useState(0);
  const [stage, setStage] = useState<'fade-in' | 'hold' | 'fade-out'>('fade-in');

  useEffect(() => {
    // Fade in
    const fadeInTimer = setTimeout(() => {
      setOpacity(1);
    }, 50);

    // Hold
    const holdTimer = setTimeout(() => {
      setStage('hold');
    }, 500);

    // Start fade out
    const fadeOutStartTimer = setTimeout(() => {
      setStage('fade-out');
      setOpacity(0);
    }, 3000);

    // Complete
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3500);

    return () => {
      clearTimeout(fadeInTimer);
      clearTimeout(holdTimer);
      clearTimeout(fadeOutStartTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none transition-opacity duration-500"
      style={{ opacity }}
    >
      {/* White flash overlay */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-sm" />

      {/* Message */}
      <div className="relative z-10 max-w-2xl mx-auto px-8 text-center space-y-4">
        <div className="text-4xl font-serif font-bold text-gray-900 drop-shadow-lg">
          Transfurred!
        </div>
        <div className="text-xl text-gray-800 drop-shadow-md">
          {message}
        </div>
      </div>
    </div>
  );
}
