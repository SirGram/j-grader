import { useState, useEffect, useMemo } from "react";
import { useDeckStore } from "./stores/deckStore";

import dataN1 from "./decks/n1.json";
import dataN2 from "./decks/n2.json";
import dataN3 from "./decks/n3.json";
import dataN4 from "./decks/n4.json";
import dataN5 from "./decks/n5.json";
import data1K from "./decks/1k.json";
import data2K from "./decks/2.5k.json";
import data5K from "./decks/5k.json";
import data10K from "./decks/10k.json";
import data20k from "./decks/20k.json";
import data25k from "./decks/25k.json";
import data30k from "./decks/30k.json";
import data35k from "./decks/35k.json";
import data40k from "./decks/40k.json";
import data50k from "./decks/50k.json";
import data60k from "./decks/60k.json";
import data70k from "./decks/70k.json";
import data80k from "./decks/80k.json";
import data90k from "./decks/90k.json";

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
import WordTable from "./components/WordTable";

function Game() {
  const {
    decks,
    setDecks,
    isRomajiInput,
    setIsRomajiInput,
    inputMode,
    answerTime
  } = useDeckStore();

  const { startTimer, pauseTimer, seconds } = useTimer();
  const {
    startCountdown,
    countdownSeconds,
    isCountdownRunning,
    togglePause,
    resetCountdown,
    stopCountdown
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

  const handleAnswer = (isCorrect: boolean | null) => {
    if (!word) return;

    // Determine new state based on isCorrect
    const newState =
      isCorrect === true
        ? "passed"
        : isCorrect === false
          ? "failed"
          : "unrated";

    setWords((prevWords) => {
      // Find index of existing word by question
      const index = prevWords.findIndex((w) => w.question === word.question);

      if (index === -1) {
        return [...prevWords, { ...word, state: newState }];
      } else {
        const newWords = [...prevWords];
        newWords[index] = { ...newWords[index], state: newState };
        return newWords;
      }
    });

    if (isCorrect === true) {
      if (deck) {
        // Update decks immutably
        const updatedDecks = decks.map((d, i) =>
          i === deckIndex
            ? { ...d, correctCount: (d.correctCount ?? 0) + 1 }
            : d
        );
        setDecks(updatedDecks);
      }
      shiftCard();
    } else if (isCorrect === false) {
      setFailedWordsNumber((prev) => prev + 1);
      shiftCard();
    }

    setButtonPressed(true);
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
      <div className=" bg-opacity-70 bg-base-200 rounded-lg ">
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
          {answerTime !== 0 && inputMode && (
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
    <section className="flex flex-col gap-10 justify-center items-center">
      <Results elapsedTime={seconds} />
      <WordTable words={words} />
    </section>
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
    setAnswerTime
  } = useDeckStore();

  const jlptDecks: IDeck[] = [dataN1, dataN2, dataN3, dataN4, dataN5];
  const frequencyDecks: IDeck[] = [
    data1K,
    data2K,
    data5K,
    data10K,
    data20k,
    data25k,
    data30k,
    data35k,
    data40k,
    data50k,
    data60k,
    data70k,
    data80k,
    data90k
  ];
  const { setPrecision } = useDeckStore();
  const [activeTab, setActiveTab] = useState<"noken" | "frequency">(
    "frequency"
  );
  const availableDecks: IDeck[] =
    activeTab === "noken" ? jlptDecks : frequencyDecks;

  const [selectedDecksNames, setSelectedDecksNames] = useState<string[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const answerTimeOptions = [0, 5, 10, 20];
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
        correctCount: 0
      }));

    // Pick random cards based on precision value size
    const decksWithRandomCards = selectedDecks.map((deck) => {
      const randomCards = getRandomCards(deck, precision);

      return {
        ...deck,
        cards: randomCards,
        sampleSize: randomCards.length
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
    if (!inputMode) return;
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

  useEffect(() => {
    setSelectedDecksNames([]);
    if (activeTab === "frequency") {
      setPrecision(2);
    } else {
      setPrecision(15);
    }
  }, [activeTab]);

  useEffect(() => {
    if (!inputMode) {
      setAnswerTime(0);
    }
  }, [inputMode, setAnswerTime]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full p-4 bg-[url('/bg.png')] bg-left-top bg-contain bg-no-repeat bg-opacity-60 relative md:text-5xl">
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
        className={`flex items-center w-full flex-1 h-full p-4 pb-10   flex-col gap-6  justify-center  `}
      >
        {!gameStarted ? (
          <div className="bg-base-100 flex gap-20 flex-col md:flex-row">
            {/* Left panel: Tabs + deck selection */}
            <div className="min-w-[300px] flex-shrink-0">
              <div role="tablist" className="tabs tabs-bordered pb-2">
                <a
                  role="tab"
                  className={`tab ${activeTab === "noken" ? "tab-active" : ""}`}
                  onClick={() => setActiveTab("noken")}
                >
                  JLPT
                </a>
                <a
                  role="tab"
                  className={`tab ${activeTab === "frequency" ? "tab-active" : ""}`}
                  onClick={() => setActiveTab("frequency")}
                >
                  FREQUENCY
                </a>
              </div>

              <div
                className={`flex w-full justify-end pr-6 min-h-[40px] ${
                  decks.length > 0 ? "invisible" : "visible"
                }`}
              >
                <div className="animate-bounce animate-infinite flex items-end">
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

            {/* Right panel: Controls */}
            <div className="flex flex-col gap-4 min-w-[300px] flex-shrink-0">
              <Precision />
              <label
                htmlFor="inputType"
                className="flex w-full justify-between"
              >
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
                className="flex w-full justify-between place-items-center gap-2"
                title="Set answer time. 0 means unlimited time (timer disabled)."
              >
                <span
                  className={`font-semibold ${answerTime === 0 ? "text-red-600 line-through" : ""}`}
                >
                  Answer Time
                </span>

                <button
                  onClick={handleNextAnswerTimeOption}
                  className={`radial-progress bg-base-200 w-16 h-16 flex flex-col items-center justify-center select-none
      ${answerTime === 0 ? "border-2 border-red-600 text-red-600" : "text-neutral-content"}
    `}
                  style={
                    {
                      "--value":
                        answerTime === 0
                          ? "100"
                          : answerTimeProgress.toString(),
                      "--size": "4rem",
                      "--thickness": "10px"
                    } as React.CSSProperties
                  }
                  role="progressbar"
                  aria-label={`Answer time set to ${answerTime === 0 ? "unlimited" : answerTime + " seconds"}`}
                >
                  {answerTime === 0 ? (
                    <>
                      <span className="text-sm font-bold">Off</span>
                    </>
                  ) : (
                    <span className="text-lg font-bold">{answerTime}s</span>
                  )}
                </button>
              </label>

              <div className="flex w-full justify-end">
                <div className="bg-base-200 w-fit p-4 rounded-box">
                  Total cards: <b>{totalCardCountSample}</b>
                </div>
              </div>

              <div
                className={`flex w-full justify-end min-h-[48px] ${
                  decks.length > 0 ? "visible" : "invisible"
                }`}
              >
                <div className="bg-base-200 w-fit p-4 rounded-box">
                  Estimated time: <b>{getTimeRange()}</b>
                </div>
              </div>

              <button
                className="btn w-full btn-accent text-xl"
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
    </div>
  );
}
