import { IDeck } from "../types/types";

export const getRandomCards = (deck: IDeck, precision: number) => {
  const base = 20;
  const maxCards = deck.cards.length;

  // Map the precision value to a non-linear scale using an exponential function
  const numCards = Math.ceil((Math.pow(base, precision / 100) - 1) / (Math.pow(base, 1) - 1) * maxCards);
console.log(numCards)
  const shuffled = deck.cards.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numCards);
};


export const formatElapsedTime = (timeInSeconds: number) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  if (minutes ===0) return `${seconds}s`;
  return `${minutes}m ${seconds}s`;
};

export function calculateStandardError(j: number, n: number, N: number): string {
  // Calculate the sample proportion
  const p: number = j / n;

  // Calculate the finite population correction factor
  const FPC: number = (N - n) / (N - 1);

  // Calculate the standard error
  const SE: number = Math.sqrt((p * (1 - p) / n) * FPC);

  return (SE*100).toFixed(2);
}