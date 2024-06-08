export interface IDeckCard {
    answer: string[];
    meaning: string;
    question: string;
  }
export interface IDeck {
    name:string;
    cards:IDeckCard[];
    deckSize?:number;
    correctCount?:number 

}