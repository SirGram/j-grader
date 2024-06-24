import { useDeckStore } from "../stores/deckStore";
import { formatElapsedTime, calculateResultWithError } from "../utils/utils";
import Progress from "./Progress";

export function Results({ elapsedTime }: { elapsedTime: number }) {
  const { decks } = useDeckStore();
  console.log(decks);

  return (
    <article className="bg-base-200  rounded-box  overflow-hidden">
      
      <h3 className="font-thin text-3xl mb-4 p-4 w-full text-center  bg-gradient-to-b from-base-200 to-base-300 ">VOCABULARY KNOWLEDGE</h3>
      <div className="gap-x-4 flex flex-col gap-2 p-4">
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
      <div className="flex w-full justify-end mt-6  ">
        <div className="bg-base-300 w-fit p-4 rounded-tl-xl ">
          Elapsed time: <b>{formatElapsedTime(elapsedTime)}</b>
        </div>
      </div>
    </article>
  );
}