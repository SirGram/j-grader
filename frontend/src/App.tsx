import { useState, useEffect, useMemo } from "react";
import { useDeckStore } from "./stores/deckStore";

import dataN1 from "./decks/n1.json";
import dataN2 from "./decks/n2.json";
import dataN3 from "./decks/n3.json";
import dataN4 from "./decks/n4.json";
import dataN5 from "./decks/n5.json";
import { IDeck, IDeckCard, IDeckCardWithState } from "./types/types";
import DeckTable from "./components/DeckTable";
import Precision from "./components/Precision";
import { getRandomCards } from "./utils/utils";
import { FaArrowTurnDown } from "react-icons/fa6";
import useTimer, { useCountDown } from "./hooks/hooks";
import CircleProgress from "./components/CircleProgress";
import { WordsCarrousel } from "./components/WordCarrousel";
import { WordCard } from "./components/WordCard";
import { Results } from "./components/Results";
import ThemeSelector from "./components/ThemeSelector";
import { BsArrowLeft } from "react-icons/bs";

function Game() {
  const {
    decks,
    setDecks,
    isRomajiInput,
    setIsRomajiInput,
    inputMode,
    answerTime,
  } = useDeckStore();

  const { startTimer, pauseTimer, seconds } = useTimer();
  const {
    startCountdown,
    countdownSeconds,
    isCountdownRunning,
    togglePause,
    resetCountdown,
    stopCountdown,
  } = useCountDown(answerTime);

  const [decksEmpty, setDecksEmpty] = useState(false);
  const [deck, setDeck] = useState<IDeck | null>(null);
  const [deckIndex, setDeckIndex] = useState(0);
  const [word, setWord] = useState<IDeckCard | null>(null);
  const [words, setWords] = useState<IDeckCardWithState[]>([]);
  const [failedWordsNumber, setFailedWordsNumber] = useState(0);

  const [buttonPressed, setButtonPressed] = useState<boolean>(false);

  const shiftDeck = () => {
    if (!decksEmpty) {
      const nextDeckIndex = (deckIndex + 1) % decks.length;
      setDeckIndex(nextDeckIndex);
      setDeck(decks[nextDeckIndex]);
      setWord(decks[nextDeckIndex]?.cards[0] || null);
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

  useEffect(() => {
    if (!decksEmpty) {
      setDeck(decks[deckIndex]);
      setWord(decks[deckIndex]?.cards[0] || null);
      startTimer();
    } else {
      console.log("could u pause");
      pauseTimer();
    }
  }, [decksEmpty]);

  useEffect(() => {
    if (countdownSeconds === 0) {
      handleAnswer(false);
    }
  }, [countdownSeconds]);

  useEffect(() => {
    setDecksEmpty(decks.every((deck) => deck.cards.length === 0));
  }, [word]);

  useEffect(() => {
    if (answerTime !== 0) {
      resetCountdown();
      startCountdown();

      if (decksEmpty) stopCountdown();
    }
  }, [word, decksEmpty]);

  const handleAnswer = (isCorrect: boolean) => {
    if (word) {
      if (isCorrect) {
        setWords((prevWords) => [...prevWords, { ...word, state: "passed" }]);
        if (deck) {
          const updatedDecks = decks;
          updatedDecks[deckIndex].correctCount! += 1;
          setDecks(updatedDecks);
        }
      } else {
        setFailedWordsNumber((prev) => prev + 1);
        setWords((prevWords) => [...prevWords, { ...word, state: "failed" }]);
      }
      setButtonPressed(true);
    }

    shiftCard();
  };

  const remainingCards = decks.reduce(
    (accumulator, deck) => accumulator + (deck.cards.length ?? 0),
    0
  );

  const wordComponent = useMemo(
    () => (
      <WordCard
        word={word}
        onAnswer={handleAnswer}
        isRomajiInput={isRomajiInput}
      />
    ),
    [word]
  );

  const wordCarrouselComponent = useMemo(
    () => <WordsCarrousel words={words} />,
    [words]
  );

  return !decksEmpty ? (
    <section className="flex flex-col lg:flex-row lg:gap-20 gap-4 items-center">
      <div className=" bg-opacity-70 bg-base-200 p-4 rounded-lg backd">
        <div className="flex items-center justify-center gap-4">
          <div
            className="collapse bg-base-100 w-fit mb-3 shrink-0 hover:bg-base-200"
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
                    <i className="font-thin">{mappedDeck.sampleSize}</i>
                  </li>
                ) : null
              )}
            </ul>
          </div>
        </div>

        <div className="stats stats-horizontal shadow text-center">
          <div className="stat ">
            <div className="stat-title">Remaining words</div>
            <div className="stat-value text-xl">{remainingCards}</div>
          </div>

          <div className="stat">
            <div className="stat-title">Failed</div>
            <div className="stat-value text-xl">{failedWordsNumber}</div>
          </div>

          <div className="stat">
            <div className="stat-title">Passed</div>
            <div className="stat-value text-xl">
              {words.length - failedWordsNumber}
            </div>
          </div>
        </div>

        {inputMode && (
          <label
            htmlFor="inputRomaji"
            className="flex mt-6 w-full justify-around"
          >
            {" "}
            Romaji Input
            <input
              type="checkbox"
              className="toggle"
              checked={isRomajiInput}
              id="inputRomaji"
              onChange={() => setIsRomajiInput(!isRomajiInput)}
            />
          </label>
        )}
      </div>
      <div className="flex flex-col justify-center gap-10  items-center">
        <div className="relative">
          {wordComponent}
          {answerTime !== 0 && (
            <button
              onClick={() => togglePause()}
              className="absolute right-1 top-1 text-neutral-content"
            >
              <CircleProgress
                countdownSeconds={countdownSeconds}
                answerTime={answerTime}
                isRunning={isCountdownRunning}
                buttonPressed={buttonPressed}
                setButtonPressed={setButtonPressed}
              />
            </button>
          )}
        </div>
        {wordCarrouselComponent}
      </div>
    </section>
  ) : (
    <>
      <Results elapsedTime={seconds} />
    </>
  );
}

export default function App() {
  const {
    decks,
    setDecks,
    precision,
    inputMode,
    setInputMode,
    answerTime,
    setAnswerTime,
  } = useDeckStore();

  const availableDecks = [dataN1, dataN2, dataN3, dataN4, dataN5];
  const [selectedDecksNames, setSelectedDecksNames] = useState<string[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const answerTimeOptions = [0, 3, 4, 5, 6, 7, 10];
  const answerTimeLastOption = answerTimeOptions[answerTimeOptions.length - 1];
  const answerTimeProgress = (answerTime * 100) / answerTimeLastOption;

  const handleDeckSelection = (deckName: string) => {
    if (deckName === "all") {
      if (selectedDecksNames.length === availableDecks.length) {
        setSelectedDecksNames([]);
      } else {
        setSelectedDecksNames(availableDecks.map((deck) => deck.name));
      }
    } else {
      setSelectedDecksNames((prevSelectedDecks) =>
        prevSelectedDecks.includes(deckName)
          ? prevSelectedDecks.filter((name) => name !== deckName)
          : [...prevSelectedDecks, deckName]
      );
    }
  };

  const startGame = () => {
    setGameStarted(true);
  };

  const restartGame = () => {
    setGameStarted(false);
    setDecks([]);
    setSelectedDecksNames([]);
  };

  const [totalCardCountSample, setTotalCardCountSample] = useState(0);
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
        sampleSize: randomCards.length,
      };
    });

    setDecks(decksWithRandomCards);
    setTotalCardCountSample(
      decksWithRandomCards.reduce(
        (accumulator, deck) => accumulator + (deck.cards.length ?? 0),
        0
      )
    );
  }, [selectedDecksNames, precision]);
  console.log(decks);

  const handleNextAnswerTimeOption = () => {
    const currentIndex = answerTimeOptions.indexOf(answerTime);
    const nextIndex = (currentIndex + 1) % answerTimeOptions.length;
    setAnswerTime(answerTimeOptions[nextIndex]);
  };

  const getTimeRange = () => {
    if (answerTime !== 0) {
      return `${((totalCardCountSample * answerTime) / 60).toFixed(2)} min`;
    } else {
      return !inputMode
        ? `${((totalCardCountSample * 2) / 60).toFixed(2)}~
           ${((totalCardCountSample * 3) / 60).toFixed(2)} min`
        : `${((totalCardCountSample * 4) / 60).toFixed(2)}~
           ${((totalCardCountSample * 6) / 60).toFixed(2)} min`;
    }
  };

  return (
    <>
      <header className="w-full p-4 absolute sm:text-7xl md:text-8xl top-0 left-0 -z-30 ">
        <div className="absolute inset-0 bg-[url('/bg.png')] bg-left-top bg-contain bg-no-repeat opacity-60  -z-20"></div>
        <h1 className="font-hiroshi relative z-10">
          j<span className="text-red-800">-GRADE</span>
          <span className="text-red-950">r</span>
          <span className="ml-2 badge badge-outline badge-primary md:text-2xl p-4 font-sans">
            BETA
          </span>
        </h1>
        <h2 className="ml-10 text-base relative z-10">
          For a fun grading and reviewing experience
        </h2>
      </header>
      <ThemeSelector />
      <main
        className={`flex  flex-col gap-6 min-h-screen justify-center items-center `}
      >
        {!gameStarted ? (
          <div className="  bg-base-100  flex  gap-20 flex-col md:flex-row">
            <div>
              <div
                className={`flex w-full justify-end pr-6 ${decks.length > 0 ? "opacity-0" : ""}`}
              >
                <div className="animate-bounce animate-infinite flex items-end ">
                  <span className="mb-1">Select a deck</span>
                  <FaArrowTurnDown />
                </div>
              </div>
              <DeckTable
                availableDecks={availableDecks}
                handleChange={handleDeckSelection}
                selectedDecksNames={selectedDecksNames}
              />
            </div>
            <div className="flex flex-col gap-4">
              <Precision />
              <label
                htmlFor="inputType"
                className="flex w-full justify-between"
              >
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
              <label
                htmlFor="inputType"
                className="flex w-full justify-between place-items-center"
              >
                {" "}
                <span className={`${answerTime === 0 ? " line-through" : ""} `}>
                  Answer Time
                </span>
                <button
                  onClick={handleNextAnswerTimeOption}
                  className="radial-progress bg-base-200"
                  style={{
                    "--value": answerTimeProgress.toString() ,
                    "--size": "4rem",
                    "--thickness": "10px",
                  }as React.CSSProperties}
                  role="progressbar"
                >
                  {answerTime}s
                </button>
              </label>

              <div className="   flex w-full justify-end">
                <div className="bg-base-200 w-fit p-4  rounded-box">
                  Total cards: <b>{totalCardCountSample}</b>
                </div>
              </div>
              <div
                className={`   flex w-full justify-end  ${decks.length > 0 ? "" : "opacity-0"}`}
              >
                <div className="bg-base-200 w-fit p-4  rounded-box">
                  Estimated time: <b>{getTimeRange()}</b>
                </div>
              </div>
              <button
                className={`btn w-full btn-accent text-xl `}
                onClick={startGame}
                disabled={decks.length < 1 || totalCardCountSample < 1}
              >
                START
              </button>
            </div>
          </div>
        ) : (
          <>
              <button
                className={`ml-4 sm:ml-20 btn w-fit btn-accent text-xl left-0 self-start mr-auto`}
                onClick={restartGame}
              >
                <BsArrowLeft />
                BACK
              </button>
          
            <Game />
          </>
        )}
      </main>
    </>
  );
}
