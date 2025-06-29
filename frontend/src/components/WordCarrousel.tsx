import { useEffect, useRef, useState } from "react";
import { IDeckCardWithState } from "../types/types";
import { processAnswer } from "../utils/utils";

function PastWordCard({ word }: { word: IDeckCardWithState | null }) {
  const answers = word ? processAnswer(word.answer) : [];

  return (
    <article
      className={`w-full p-2 flex flex-col shadow-xl rounded-lg overflow-hidden bg-primary-content transition-all ${!word && "opacity-0"}`}
    >
      <div
        className={`w-full flex-col h-28 text-5xl flex items-center justify-center pb-4 ${
          word?.state === "failed"
            ? "text-red-500"
            : word?.state === "passed"
              ? "text-green-500"
              : ""
        }`}
      >
        <span className="text-xl">{answers.join(", ") || ""}</span>
        <span className={`text-5xl `}>{word?.question || ""}</span>
      </div>
      <div className="bg-base-300 w-full h-1 "></div>
      <div className="w-full flex-col h-min bg-primary-content  p-4 text-5xl flex items-center justify-center ">
        <span className="text-xl text-neutral-content">
          {word?.meaning || ""}
        </span>
      </div>
    </article>
  );
}
export function WordsCarrousel({ words }: { words: IDeckCardWithState[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  console.log(words);

  const prevLengthRef = useRef(words.length);

  useEffect(() => {
    if (words.length !== prevLengthRef.current) {
      setCurrentIndex(words.length - 1);
      prevLengthRef.current = words.length;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        goToPrevious();
      } else if (event.key === "ArrowRight") {
        goToNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [words.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < words.length - 1 ? prevIndex + 1 : prevIndex
    );
  };

  return (
    <div className="relative w-96 md:w-[30rem] overflow-hidden">
      <div
        className="flex transition-transform duration-300"
        style={{
          width: `${words.length * 100}%`,
          transform: `translateX(-${currentIndex * (100 / words.length)}%)`
        }}
      >
        {words.map((word) => (
          <div key={word.question} className="w-96 md:w-[30rem] flex-shrink-0">
            <PastWordCard word={word} />
          </div>
        ))}
      </div>

      {currentIndex > 0 && (
        <>
          <button
            onClick={goToPrevious}
            className="btn btn-circle absolute top-9 left-2"
          >
            ❮
          </button>
        </>
      )}
      {currentIndex < words.length - 1 && (
        <button
          onClick={goToNext}
          className="btn btn-circle absolute top-9 right-2"
        >
          ❯
        </button>
      )}

      <div className="absolute top-2 flex gap-1 right-2 ">
        <kbd className="kbd kbd-sm">◀︎</kbd>
        <kbd className="kbd kbd-sm">▶︎</kbd>
      </div>
    </div>
  );
}
