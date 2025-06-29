import { useState, useRef, useEffect } from "react";
import { toKana, toRomaji } from "wanakana";
import { useDeckStore } from "../stores/deckStore";
import { IDeckCard } from "../types/types";
import { processAnswer } from "../utils/utils";

interface WordCardProps {
  word: IDeckCard | null;
  onAnswer: (value: boolean | null) => void;
  isRomajiInput: boolean;
}

export function WordCard({ word, onAnswer }: WordCardProps) {
  const { inputMode, isRomajiInput } = useDeckStore();
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setInputValue(value);

    const realValue = toRomaji(toKana(value));

    if (word) {
      const answers = processAnswer(word.answer);
      const processedAnswers = isRomajiInput
        ? answers.map((answer) =>
            toRomaji(answer.toLowerCase(), {
              customRomajiMapping: {
                んな: "nnna",
                んに: "nnni",
                んぬ: "nnnu",
                んね: "nnne",
                んの: "nnno",
                んにゃ: "nnnya",
                んにゅ: "nnnyu",
                んにょ: "nnnyo"
              }
            }).replace("n'", "nn")
          )
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
      const activeElement = document.activeElement;
      const isInputFocused =
        activeElement &&
        (activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA" ||
          activeElement.getAttribute("contenteditable") === "true");

      // Don't process keys if input is focused (avoid conflicts)
      if (isInputFocused) return;

      if (!inputMode) {
        if (!showAnswer && event.key === " ") {
          event.preventDefault();
          setShowAnswer(true);
          onAnswer(null);
          return;
        }

        if (showAnswer) {
          if (event.key === "1") {
            event.preventDefault();
            onAnswer(false);
            setShowAnswer(false);
            return;
          }
          if (event.key === "2") {
            event.preventDefault();
            onAnswer(true);
            setShowAnswer(false);
            return;
          }
        }
      } else {
        // inputMode is true (typing mode)
        if (event.key === "1") {
          event.preventDefault();
          onAnswer(false);
          return;
        }
        if (event.key === "2") {
          event.preventDefault();
          onAnswer(true);
          return;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [inputMode, showAnswer, onAnswer]);

  useEffect(() => {
    if (inputRef.current) {
      setTimeout(() => {
        if (inputRef.current != null) inputRef.current.focus();
      }, 100);
    }
    setInputValue("");
    setShowAnswer(false);
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
                {!showAnswer ? (
                  <button
                    className="bg-base-300 w-full h-full hover:opacity-70 flex items-center justify-center"
                    onClick={() => {
                      setShowAnswer(true);
                      onAnswer(null);
                    }}
                  >
                    SHOW ANSWER
                    <span className="kbd kbd-sm text-base-content mb-3 ml-1">
                      _
                    </span>
                  </button>
                ) : (
                  <>
                    <button
                      className="bg-base-300 text-error w-full h-full hover:opacity-70 flex items-center justify-center"
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
                      </span>
                    </button>
                  </>
                )}
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
