import { create } from "zustand";
import { IDeck } from "../types/types";

const initialPrecision = 10;

interface IDeckStore {
  decks: IDeck[];
  setDecks: (updatedDecks: IDeck[]) => void;
  precision: number;
  setPrecision: (updatePrecision: number) => void;
  incrementDeckCounter: (deckName: string) => void;
  inputMode: boolean;
  setInputMode: (value: boolean) => void;
}

export const useDeckStore = create<IDeckStore>((set) => ({
  decks: [],
  setDecks: (updatedDecks) => set({ decks: updatedDecks }),
  precision: initialPrecision,
  setPrecision: (updatedPrecision) => set({ precision: updatedPrecision }),
  incrementDeckCounter: (deckName) =>
    set((state) => ({
      decks: state.decks.map((deck) =>
        deck.name === deckName
          ? { ...deck, correctCount: (deck.correctCount || 0) + 1 }
          : deck
      ),
    })),
  inputMode: false,
  setInputMode: (value) => set({ inputMode: value }),
}));



interface TimerState {
  elapsedTime: number;
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  intervalId: NodeJS.Timeout | null;
}

export const useTimerStore = create<TimerState>((set, get) => ({
  elapsedTime: 0,
  intervalId: null,
  startTimer: () => {
    if (!get().intervalId) {
      const intervalId = setInterval(() => {
        set((state) => ({ elapsedTime: state.elapsedTime + 1 }));
      }, 1000);
      set({ intervalId });
    }
  },
  stopTimer: () => {
    const { intervalId } = get();
    if (intervalId) {
      clearInterval(intervalId);
      set({ intervalId: null });
    }
  },
  resetTimer: () => {
    set({ elapsedTime: 0 });
  },
}));