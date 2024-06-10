export interface IDeckCard {
    answer: string[];
    meaning: string;
    question: string;
  }
export interface IDeckCardWithState extends IDeckCard {
  state: "failed" | "passed"; 
}
export interface IDeck {
    name:string;
    cards:IDeckCard[];
    deckSize?:number;
    sampleSize?:number;
    correctCount?:number 
}
export interface IDeckWithStateCard {
    name:string;
    cards:IDeckCardWithState[];
    deckSize?:number;
    sampleSize?:number;
    correctCount?:number 
}