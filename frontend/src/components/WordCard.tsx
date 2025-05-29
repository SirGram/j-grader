import { useState, useRef, useEffect } from "react";
import { toKana, toRomaji } from "wanakana";
import { useDeckStore } from "../stores/deckStore";
import { IDeckCard } from "../types/types";
import { processAnswer } from "../utils/utils";

interface WordCardProps {
  word: IDeckCard | null;
  onAnswer: (value: boolean) => void;
  isRomajiInput: boolean;
}



export function WordCard({ word, onAnswer }: WordCardProps) {
  const { inputMode, isRomajiInput } = useDeckStore();
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setInputValue(value);

    const realValue = toRomaji(toKana(value));

    if (word) {
      const answers = processAnswer(word.answer);
      const processedAnswers = isRomajiInput
        ? answers.map((answer) => toRomaji(answer.toLowerCase(), { customRomajiMapping:{
          "んな":"nnna",
          "んに": "nnni",
          "んぬ": "nnnu",
          "んね": "nnne",
          "んの": "nnno",
          "んにゃ": "nnnya",
          "んにゅ": "nnnyu",
          "んにょ": "nnnyo",
            }}).replace("n'", "nn"))
        : answers;

      if (processedAnswers.includes(isRomajiInput ? realValue : value)) {
        onAnswer(true);
        setInputValue("");
      } else if (value.includes("1") || value.includes("１")) {
        onAnswer(false);
        setInputValue("");
      }
    }
  };
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "1") {
        onAnswer(false);
      } else if (
        (!inputMode && event.key === "2") ||
        (!inputMode && event.key === " ")
      ) {
        onAnswer(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onAnswer, inputMode]);

  useEffect(() => {
    if (inputRef.current) {
      setTimeout(() => {
        if (inputRef.current != null) inputRef.current.focus();
      }, 100);
    }
    setInputValue("");
  }, [word]);

  return (
    word && (
      <article className="w-96 shadow-xl  bg-primary-content rounded-lg overflow-hidden flex flex-col ">
        <div className="w-full my-6 h-min text-5xl text-primary flex items-center justify-center">
          {word.question}
        </div>
        <footer className="flex flex-col h-min text-2xl">
          <div className="h-20 flex">
            {!inputMode ? (
              <>
                <button
                  className="bg-base-300 text-error w-full h-full hover:opacity-70  flex items-center justify-center"
                  onClick={() => onAnswer(false)}
                >
                  FAIL
                  <span className="kbd kbd-sm text-base-content mb-3 ml-1">
                    1
                  </span>
                </button>

                <button
                  className="bg-base-200 w-full h-full hover:opacity-70 text-lime-600 flex items-center justify-center"
                  onClick={() => onAnswer(true)}
                >
                  PASS
                  <span className=" text-base-content mb-5 ml-1">
                    <span className="kbd kbd-sm mr-0.5">2</span>
                    <span className=" kbd kbd-sm">_</span>
                  </span>
                </button>
              </>
            ) : (
              <div className="p-2 w-full ">
                <div className="flex flex-col items-end relative">
                  <kbd className="kbd kbd-sm mb-1 text-error border-error absolute -top-2 -right-1">
                    1
                  </kbd>
                  <input
                    key={word.question}
                    type="text"
                    className="p-2  bg-primary-content text-neutral-content h-full w-full border-2 border-neutral-content rounded-lg"
                    value={inputValue}
                    onChange={(e) => handleInput(e)}
                    ref={inputRef}
                  />
                </div>
              </div>
            )}
          </div>
        </footer>
      </article>
    )
  );
}
