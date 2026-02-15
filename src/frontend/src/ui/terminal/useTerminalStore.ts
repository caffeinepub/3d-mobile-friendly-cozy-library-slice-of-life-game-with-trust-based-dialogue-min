import { create } from 'zustand';

export interface TerminalOutputLine {
  id: number;
  timestamp: Date;
  text: string;
  type: 'input' | 'output' | 'error' | 'success';
}

interface TerminalState {
  isOpen: boolean;
  outputLines: TerminalOutputLine[];
  nextId: number;
  open: () => void;
  close: () => void;
  toggle: () => void;
  appendOutput: (text: string, type?: 'output' | 'error' | 'success') => void;
  appendInput: (text: string) => void;
  clear: () => void;
}

export const useTerminalStore = create<TerminalState>((set) => ({
  isOpen: false,
  outputLines: [],
  nextId: 0,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  appendOutput: (text, type = 'output') =>
    set((state) => ({
      outputLines: [
        ...state.outputLines,
        {
          id: state.nextId,
          timestamp: new Date(),
          text,
          type,
        },
      ],
      nextId: state.nextId + 1,
    })),
  appendInput: (text) =>
    set((state) => ({
      outputLines: [
        ...state.outputLines,
        {
          id: state.nextId,
          timestamp: new Date(),
          text: `> ${text}`,
          type: 'input',
        },
      ],
      nextId: state.nextId + 1,
    })),
  clear: () => set({ outputLines: [] }),
}));
