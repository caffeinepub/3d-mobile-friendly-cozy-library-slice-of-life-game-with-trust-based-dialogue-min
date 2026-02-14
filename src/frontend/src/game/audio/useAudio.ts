import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useEffect, useRef } from 'react';

interface AudioStore {
  volume: number;
  isMuted: boolean;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
}

const useAudioStore = create<AudioStore>()(
  persist(
    (set) => ({
      volume: 50,
      isMuted: false,
      setVolume: (volume: number) => set({ volume }),
      toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
    }),
    {
      name: 'cozy-library-audio',
    }
  )
);

export function useAudioManager() {
  const { volume, isMuted, setVolume, toggleMute } = useAudioStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio('/assets/audio/lofi-retro-piano.mp3');
        audioRef.current.loop = true;
      }

      const audio = audioRef.current;
      audio.volume = isMuted ? 0 : volume / 100;
    } catch (error) {
      console.warn('Failed to initialize audio:', error);
    }

    return () => {
      if (audioRef.current) {
        try {
          audioRef.current.pause();
        } catch (error) {
          console.warn('Failed to pause audio on cleanup:', error);
        }
      }
    };
  }, [volume, isMuted]);

  const playBackgroundMusic = () => {
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        // Autoplay might be blocked, user interaction required
        // This is expected behavior and should not block gameplay
        console.info('Background music autoplay blocked (expected):', error.message);
      });
    }
  };

  return {
    volume,
    isMuted,
    setVolume,
    toggleMute,
    playBackgroundMusic,
  };
}
