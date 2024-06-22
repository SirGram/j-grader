import { useDeckStore } from "../stores/deckStore";
import { formatElapsedTime, calculateResultWithError } from "../utils/utils";
import Progress from "./Progress";

export function Results({ elapsedTime }: { elapsedTime: number }) {
  const { decks } = useDeckStore();
  console.log(decks);

  return (
    <article className="bg-base-200  rounded-box p-4 overflow-hidden">
      
      <h1 className="text-3xl mb-6 text-center font-thin">VOCABULARY KNOWLEDGE</h1>
      <div className="gap-x-4 flex flex-col gap-2">
        {decks.map((deck) => {
          const {result,  SE} = calculateResultWithError(
            deck.correctCount!,
            deck.sampleSize!,
            deck.deckSize!,
            (deck.correctCount! * 100) / deck.sampleSize!
          );
          return (
            <div key={deck.name} className="flex gap-4 items-center">
              <span>{deck.name}</span>
              <Progress
                value={deck.correctCount}
                max={deck.sampleSize}
                errorMargin={Number(SE)}
              />
              <span> ≃ <b>{result}%</b> ± {SE}%</span>
            </div>
          );
        })}
      </div>
      <div className="flex w-full justify-end mt-6">
        <div className="bg-base-300 w-fit p-4 rounded-box ">
          Elapsed time: <b>{formatElapsedTime(elapsedTime)}</b>
        </div>
      </div>
    </article>
  );
}