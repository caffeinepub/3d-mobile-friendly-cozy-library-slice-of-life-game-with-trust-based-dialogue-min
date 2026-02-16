import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameState as BackendGameState } from '../../backend';

interface UIState {
  showDialogue: boolean;
  showActivities: boolean;
  showMiniGames: boolean;
  showCustomization: boolean;
  showMoments: boolean;
  showLetters: boolean;
  showEnding: boolean;
  isPaused: boolean;
}

type SceneType = 'library' | 'hive';

interface GameStore extends UIState {
  // Game state
  trustLevel: number;
  currentDialogueNode: number | null;
  completedActivities: string[];
  libraryCustomizations: Array<{ itemName: string; description: string; location: string }>;
  unlockedMoments: string[];
  letters: Array<{ fromPlayer: boolean; content: string; timestamp: number; response?: string }>;
  endingsUnlocked: string[];
  discoveredItems: string[];
  hasLocalSave: boolean;
  
  // Scene state
  currentScene: SceneType;
  hiveSpawnPosition: [number, number, number];

  // Actions
  initializeGame: (isNew: boolean) => void;
  setTrustLevel: (level: number) => void;
  adjustTrust: (delta: number) => void;
  completeActivity: (name: string, trustDelta: number) => void;
  addCustomization: (item: { itemName: string; description: string; location: string }) => void;
  unlockMoment: (title: string) => void;
  addLetter: (content: string) => void;
  addLetterResponse: (index: number, response: string) => void;
  unlockEnding: (ending: string) => void;
  discoverItem: (itemName: string) => void;
  setCurrentDialogueNode: (node: number | null) => void;
  resetProgress: () => void;
  
  // Scene actions
  teleportToHive: () => void;
  setCurrentScene: (scene: SceneType) => void;

  // UI Actions
  setShowDialogue: (show: boolean) => void;
  setShowActivities: (show: boolean) => void;
  setShowMiniGames: (show: boolean) => void;
  setShowCustomization: (show: boolean) => void;
  setShowMoments: (show: boolean) => void;
  setShowLetters: (show: boolean) => void;
  setShowEnding: (show: boolean) => void;
  setPaused: (paused: boolean) => void;
}

const defaultState = {
  trustLevel: 50,
  currentDialogueNode: null,
  completedActivities: [],
  libraryCustomizations: [],
  unlockedMoments: [],
  letters: [],
  endingsUnlocked: [],
  discoveredItems: [],
  hasLocalSave: false,
  currentScene: 'library' as SceneType,
  hiveSpawnPosition: [0, 0, 0] as [number, number, number],
  showDialogue: false,
  showActivities: false,
  showMiniGames: false,
  showCustomization: false,
  showMoments: false,
  showLetters: false,
  showEnding: false,
  isPaused: false,
};

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      ...defaultState,

      initializeGame: (isNew: boolean) => {
        if (isNew) {
          set({ ...defaultState, hasLocalSave: true });
        } else {
          // Mark that we have a local save when continuing
          set({ hasLocalSave: true });
        }
      },

      setTrustLevel: (level: number) => set({ trustLevel: Math.max(0, Math.min(100, level)) }),

      adjustTrust: (delta: number) =>
        set((state) => ({
          trustLevel: Math.max(0, Math.min(100, state.trustLevel + delta)),
        })),

      completeActivity: (name: string, trustDelta: number) =>
        set((state) => ({
          completedActivities: [...state.completedActivities, name],
          trustLevel: Math.max(0, Math.min(100, state.trustLevel + trustDelta)),
        })),

      addCustomization: (item) =>
        set((state) => ({
          libraryCustomizations: [...state.libraryCustomizations, item],
        })),

      unlockMoment: (title: string) =>
        set((state) => ({
          unlockedMoments: state.unlockedMoments.includes(title)
            ? state.unlockedMoments
            : [...state.unlockedMoments, title],
        })),

      addLetter: (content: string) =>
        set((state) => ({
          letters: [
            ...state.letters,
            { fromPlayer: true, content, timestamp: Date.now(), response: undefined },
          ],
        })),

      addLetterResponse: (index: number, response: string) =>
        set((state) => ({
          letters: state.letters.map((letter, i) =>
            i === index ? { ...letter, response } : letter
          ),
        })),

      unlockEnding: (ending: string) =>
        set((state) => ({
          endingsUnlocked: state.endingsUnlocked.includes(ending)
            ? state.endingsUnlocked
            : [...state.endingsUnlocked, ending],
        })),

      discoverItem: (itemName: string) =>
        set((state) => ({
          discoveredItems: state.discoveredItems.includes(itemName)
            ? state.discoveredItems
            : [...state.discoveredItems, itemName],
        })),

      setCurrentDialogueNode: (node: number | null) => set({ currentDialogueNode: node }),

      resetProgress: () => set(defaultState),
      
      teleportToHive: () => set({ 
        currentScene: 'hive',
        hiveSpawnPosition: [0, 0, 0]
      }),
      
      setCurrentScene: (scene: SceneType) => set({ currentScene: scene }),

      setShowDialogue: (show: boolean) => set({ showDialogue: show }),
      setShowActivities: (show: boolean) => set({ showActivities: show }),
      setShowMiniGames: (show: boolean) => set({ showMiniGames: show }),
      setShowCustomization: (show: boolean) => set({ showCustomization: show }),
      setShowMoments: (show: boolean) => set({ showMoments: show }),
      setShowLetters: (show: boolean) => set({ showLetters: show }),
      setShowEnding: (show: boolean) => set({ showEnding: show }),
      setPaused: (paused: boolean) => set({ isPaused: paused }),
    }),
    {
      name: 'game-storage',
    }
  )
);
