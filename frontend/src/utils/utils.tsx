import { IDeck } from "../types/types";

export const getRandomCards = (deck: IDeck, precision: number) => {
  const numCards = Math.ceil((precision / 100) * deck.cards.length);
  const shuffled = deck.cards.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numCards);
};

export const formatElapsedTime = (timeInSeconds: number) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  if (minutes ===0) return `${seconds}s`;
  return `${minutes}m ${seconds}s`;
};