import { create } from "zustand";
import { IDeck } from "../types/types";

const initialPrecision = 2;
const initialInputMode = true;
const initialIsRomajiInput = true;
const initialAnswerTime = 5;

interface IDeckStore {
  decks: IDeck[];
  setDecks: (updatedDecks: IDeck[]) => void;
  precision: number;
  setPrecision: (updatePrecision: number) => void;
  incrementDeckCounter: (deckName: string) => void;
  inputMode: boolean;
  setInputMode: (value: boolean) => void;
  isRomajiInput: boolean;
  setIsRomajiInput: (value: boolean) => void;
  answerTime: number;
  setAnswerTime: (value: number) => void;
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
  inputMode: initialInputMode,
  setInputMode: (value) => set({ inputMode: value }),
  isRomajiInput: initialIsRomajiInput,
  setIsRomajiInput: (value) => set({ isRomajiInput: value }),
  answerTime: initialAnswerTime,
  setAnswerTime: (value) => set({ answerTime: value }),
}));
