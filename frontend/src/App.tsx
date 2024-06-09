import { useState, useEffect, useRef, memo } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { useDeckStore } from "./stores/store";

import dataN1 from "./decks/n1.json";
import dataN2 from "./decks/n2.json";
import dataN3 from "./decks/n3.json";
import dataN4 from "./decks/n4.json";
import dataN5 from "./decks/n5.json";
import { IDeck, IDeckCard } from "./types/types";
import DeckTable from "./components/DeckTable";
import Precision from "./components/Precision";
import { formatElapsedTime, getRandomCards } from "./utils/utils";
import { FaArrowTurnDown } from "react-icons/fa6";
import { bind } from "wanakana";

interface WordCardProps {
  word: IDeckCard | null;
  onAnswer: (value: boolean) => void;
}

const WordCard: React.FC<WordCardProps> = memo(({ word, onAnswer }) => {
  const { inputMode } = useDeckStore();
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  console.log('render')

  useEffect(() => {
    const handleKeyDown = (event: { key: string }) => {
      if (event.key === "1") {
        onAnswer(false);
      } else if (!inputMode && (event.key === "2" || event.key === " ")) {
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
      // Assuming bind is a function you use to bind some functionality to the input
      // Replace with actual implementation if different
      // bind(inputRef.current);
    }
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    word && (
      <article className="w-96 shadow-xl bg-primary-content rounded-lg overflow-hidden">
        <div className="w-full h-40 text-5xl flex items-center justify-center">
          {word.question}
        </div>
        <footer className="flex flex-col h-min text-2xl">
          <div className="h-20 flex">
            <button
              className="bg-error w-full h-full hover:opacity-70 text-accent-content flex items-center justify-center"
              onClick={() => onAnswer(false)}
            >
              FAIL
              <span className="kbd kbd-sm text-base-content mb-3 ml-1">1</span>
            </button>
            {!inputMode ? (
              <button
                className="bg-primary w-full h-full hover:opacity-70 text-accent-content flex items-center justify-center"
                onClick={() => onAnswer(true)}
              >
                PASS
                <span className=" text-base-content mb-5 ml-1">
                  <span className="kbd kbd-sm mr-0.5">2</span>
                  <span className=" kbd kbd-sm">_</span>
                </span>
              </button>
            ) : (
              <div className="p-1">
                <input
                  type="text"
                  className="p-2 bg-primary-content h-full border-2 border-base-content rounded-lg"
                  value={inputValue}
                  onChange={handleInput}
                  ref={inputRef}
                />
              </div>
            )}
          </div>
        </footer>
      </article>
    )
  );
});

WordCard.whyDidYouRender = true;

function FailedWordCard({ word }: { word: IDeckCard | null }) {
  return (
    <article
      className={`w-full p-2 flex flex-col shadow-xl rounded-lg overflow-hidden bg-primary-content transition-all ${!word && "opacity-0"}`}
    >
      <div className="w-full flex-col h-28   text-5xl flex items-center justify-center pb-4 ">
        <span className="text-xl">{word?.answer.join(", ") || ""}</span>
        <span>{word?.question || ""}</span>
      </div>
      <div className="bg-neutral-content w-full h-1 "></div>
      <div className="w-full flex-col h-min bg-primary-content  p-4 text-5xl flex items-center justify-center ">
        <span className="text-xl">{word?.meaning || ""}</span>
      </div>
    </article>
  );
}

function FailedWordsCarrousel({ words }: { words: IDeckCard[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(words.length - 1);
  }, [words]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < words.length - 1 ? prevIndex + 1 : prevIndex
    );
  };

  return (
    <div className="relative w-[30rem] overflow-hidden">
      <div
        className="flex transition-transform duration-300"
        style={{
          width: `${words.length * 100}%`,
          transform: `translateX(-${currentIndex * (100 / words.length)}%)`,
        }}
      >
        {words.map((word, index) => (
          <div key={word.question} className="w-[30rem] flex-shrink-0">
            <FailedWordCard word={word} />
          </div>
        ))}
      </div>

      {currentIndex > 0 && (
        <button
          onClick={goToPrevious}
          className="btn btn-circle absolute top-9 left-2"
        >
          ❮
        </button>
      )}
      {currentIndex < words.length - 1 && (
        <button
          onClick={goToNext}
          className="btn btn-circle absolute top-9 right-2"
        >
          ❯
        </button>
      )}
    </div>
  );
}

function Results({ elapsedTime }: { elapsedTime: number }) {
  const { decks } = useDeckStore();
  console.log(decks);

  return (
    <article>
      <div className="   flex w-full justify-end">
        <div className="bg-base-200 w-fit p-4  rounded-box">
          Elapsed time: <b>{formatElapsedTime(elapsedTime)}</b>
        </div>
      </div>
      <h1 className="text-3xl mb-6">DOMINANCE</h1>
      <div className="gap-x-4 flex flex-col gap-2">
        {decks.map((deck) => (
          <div key={deck.name} className="flex gap-4  items-center">
            <span>{deck.name}</span>
            <progress
              className="progress w-56"
              value={deck.correctCount}
              max={deck.deckSize}
            ></progress>
            <span>
              {((deck.correctCount! * 100) / deck.deckSize!).toFixed(1) + "%"}
            </span>
          </div>
        ))}
      </div>
    </article>
  );
}

function CountDown({ isPlaying, answerTime }) {
  const renderTime = ({ remainingTime }) => {
    if (remainingTime === 0) {
      return <div className="timer">Too late...</div>;
    }

    return (
      <span className="countdown font-mono text-xl ">
        <span
          className="flex justify-center "
          style={{ "--value": remainingTime }}
        ></span>
      </span>
    );
  };

  return (
    <CountdownCircleTimer
      isPlaying={isPlaying}
      duration={answerTime}
      colors={["#F7B801", "#A30000", "#A30000"]}
      colorsTime={[7, 5, 2, 0]}
      strokeWidth={5}
      trailStrokeWidth={5}
      size={60}
    >
      {renderTime}
    </CountdownCircleTimer>
  );
}

function Game() {
  const { decks, setDecks } = useDeckStore();
  const [elapsedTime, setElapsedTime] = useState(0);

  const [decksEmpty, setDecksEmpty] = useState(false);
  const [deck, setDeck] = useState<IDeck | null>(null);
  const [deckIndex, setDeckIndex] = useState(0);
  const [word, setWord] = useState<IDeckCard | null>(null);
  const [failedWords, setFailedWords] = useState<IDeckCard[]>([]);
  const answerTime = 60;

  const shiftDeck = () => {
    if (!decksEmpty) {
      const nextDeckIndex = (deckIndex + 1) % decks.length;
      setDeckIndex(nextDeckIndex);
      setDeck(decks[nextDeckIndex]);
      setWord(decks[nextDeckIndex]?.cards[0] || null);
    } else {
      clearInterval(timerId);
    }
  };

  const shiftCard = () => {
    if (deck) {
      const updatedDeck = { ...deck };
      updatedDeck.cards.shift();
      setDeck(updatedDeck);

      if (updatedDeck.cards.length > 0) {
        setWord(updatedDeck.cards[0]);
      } else {
        shiftDeck();
      }
    }
  };

  const intervalId = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (!decksEmpty) {
      setDeck(decks[deckIndex]);
      setWord(decks[deckIndex]?.cards[0] || null);
      //timer
      intervalId.current = setInterval(() => {
        setElapsedTime((prevElapsedTime) => prevElapsedTime + 1);
      }, 1000);
    }
    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
    };
  }, [decksEmpty]);

  useEffect(() => {
    setDecksEmpty(decks.every((deck) => deck.cards.length === 0));
  }, [word]);

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect && deck) {
      const updatedDecks = decks;
      updatedDecks[deckIndex].correctCount! += 1;
      setDecks(updatedDecks);
    } else {
      if (word) {
        setFailedWords((prevFailedWords) => [...prevFailedWords, word]);
      }
    }
    shiftCard();
  };

  const remainingCards = decks.reduce(
    (accumulator, deck) => accumulator + (deck.cards.length ?? 0),
    0
  );

  return !decksEmpty ? (
    <>
      <div className="flex items-center gap-4">
        <h1 className="w-full flex justify-center items-center text-4xl">
          QUIZ
        </h1>
        <div
          className="collapse bg-base-200 w-fit shrink-0 hover:bg-base-300"
          title="current deck"
        >
          <input type="checkbox" />
          <div className="collapse-title text-xl flex gap-2 justify-center px-2">
            <b className="font-medium text-info">{deck?.name}</b>
            <i className="font-thin">{deck?.cards.length}</i>
          </div>
          <ul className="collapse-content">
            {decks.map((mappedDeck) =>
              !(deck?.name === mappedDeck.name) ? (
                <li
                  key={mappedDeck.name}
                  className="flex gap-3 w-full justify-between"
                >
                  <span>{mappedDeck.name}</span>
                  <i className="font-thin">{mappedDeck.deckSize}</i>
                </li>
              ) : null
            )}
          </ul>
        </div>
      </div>
      <h3>
        <b>{remainingCards}</b> total remaining words
      </h3>
      <div className="relative flex flex-col gap-6 justify-center items-center">
        <WordCard word={word} onAnswer={handleAnswer} />
        {<FailedWordsCarrousel words={failedWords} />}
        <div className="absolute left-2 top-2">
          {/* <CountDown isPlaying={true} answerTime={answerTime} /> */}
        </div>
      </div>
    </>
  ) : (
    <Results elapsedTime={elapsedTime} />
  );
}

export default function App() {
  const availableDecks = [dataN1, dataN2, dataN3, dataN4, dataN5];
  const [selectedDecksNames, setSelectedDecksNames] = useState<string[]>([]);
  const [gameStarted, setGameStarted] = useState(false);

  const handleDeckSelection = (deckName: string) => {
    setSelectedDecksNames((prevSelectedDecks) =>
      prevSelectedDecks.includes(deckName)
        ? prevSelectedDecks.filter((name) => name !== deckName)
        : [...prevSelectedDecks, deckName]
    );
  };

  const { decks, setDecks, precision, inputMode, setInputMode } =
    useDeckStore();

  const startGame = () => {
    setGameStarted(true);
  };

  const [totalCardCount, setTotalCardCount] = useState(0);
  useEffect(() => {
    const selectedDecks: IDeck[] = availableDecks
      .filter((deck) => selectedDecksNames.includes(deck.name))
      .map((deck) => ({
        ...deck,
        deckSize: deck.cards.length,
        correctCount: 0,
      }));

    // Pick random cards based on precision value size
    const decksWithRandomCards = selectedDecks.map((deck) => {
      const randomCards = getRandomCards(deck, precision);

      return {
        ...deck,
        cards: randomCards,
        deckSize: randomCards.length,
      };
    });

    setDecks(decksWithRandomCards);
    setTotalCardCount(
      decksWithRandomCards.reduce(
        (accumulator, deck) => accumulator + (deck.cards.length ?? 0),
        0
      )
    );
  }, [selectedDecksNames, precision]);
  console.log(decks);

  return (
    <main className="flex overx flex-col gap-6 min-h-screen justify-center items-center">
      <header className="absolute text-9xl top-6 left-10">
        <h1>
          J-GRADER
          <span className="ml-2 badge badge-outline badge-primary text-2xl p-4">
            BETA
          </span>
        </h1>
        <h2 className="ml-4 text-base">
          For a fun grading and reviewing experience
        </h2>
      </header>
      {!gameStarted ? (
        <div className="  bg-base-100  flex  gap-20">
          <div>
            <div
              className={`flex w-full justify-end pr-6 ${decks.length > 0 ? "opacity-0" : ""}`}
            >
              <div className="animate-pulse animate-infinite flex items-end ">
                <span className="mb-1">Select a deck</span>
                <FaArrowTurnDown />
              </div>
            </div>
            <DeckTable
              availableDecks={availableDecks}
              handleChange={handleDeckSelection}
            />
          </div>
          <div className="flex flex-col gap-4">
            <Precision />
            <label htmlFor="inputType" className="flex w-full justify-between">
              {" "}
              Write answers?
              <input
                type="checkbox"
                className="toggle"
                checked={inputMode}
                id="inputType"
                onChange={() => setInputMode(!inputMode)}
              />
            </label>

            <div className="   flex w-full justify-end">
              <div className="bg-base-200 w-fit p-4  rounded-box">
                Total cards: <b>{totalCardCount}</b>
              </div>
            </div>
            <div
              className={`   flex w-full justify-end  ${decks.length > 0 ? "" : "opacity-0"}`}
            >
              <div className="bg-base-200 w-fit p-4  rounded-box">
                Estimated time:{" "}
                <b>
                  {((totalCardCount * 3) / 60).toFixed(2)}~
                  {((totalCardCount * 4) / 60).toFixed(2)} min
                </b>
              </div>
            </div>
            <button
              className={`btn w-full btn-primary text-xl `}
              onClick={startGame}
              disabled={decks.length < 1}
            >
              START
            </button>
          </div>
        </div>
      ) : (
        <Game />
      )}
    </main>
  );
}
