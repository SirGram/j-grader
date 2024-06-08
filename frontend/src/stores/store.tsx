import { create } from "zustand";
import { IDeck } from "../types/types";

const initialPrecision = 2;

interface IDeckStore {
  decks: IDeck[];
  setDecks: (updatedDecks: IDeck[]) => void;
  precision: number;
  setPrecision: (updatePrecision: number) => void;
  incrementDeckCounter: (deckName: string) => void;
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
}));


