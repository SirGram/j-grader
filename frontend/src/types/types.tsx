export interface IDeckCard {
    answer: string[];
    meaning: string;
    question: string;
  }
export interface IDeck {
    name:string;
    cards:IDeckCard[];
    deckSize?:number;
    sampleSize?:number;
    correctCount?:number 

}