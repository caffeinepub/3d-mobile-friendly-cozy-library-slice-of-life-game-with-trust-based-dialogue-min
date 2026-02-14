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
    if (!audioRef.current) {
      audioRef.current = new Audio('/assets/audio/lofi-retro-piano.mp3');
      audioRef.current.loop = true;
    }

    const audio = audioRef.current;
    audio.volume = isMuted ? 0 : volume / 100;

    return () => {
      if (audio) {
        audio.pause();
      }
    };
  }, [volume, isMuted]);

  const playBackgroundMusic = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(() => {
        // Autoplay might be blocked, user interaction required
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
