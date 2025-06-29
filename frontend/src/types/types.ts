export interface IDeckCard {
  answer: string[] | string;
  meaning: string;
  question: string;
}
export interface IDeckCardWithState extends IDeckCard {
  state: "failed" | "passed" | "unrated";
}
export interface IDeck {
  name: string;
  cards: IDeckCard[];
  deckSize?: number;
  sampleSize?: number;
  correctCount?: number;
}
