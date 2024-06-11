import { useState, useEffect, useRef,  useMemo } from "react";
import { useDeckStore } from "./stores/deckStore";

import dataN1 from "./decks/n1.json";
import dataN2 from "./decks/n2.json";
import dataN3 from "./decks/n3.json";
import dataN4 from "./decks/n4.json";
import dataN5 from "./decks/n5.json";
import { IDeck, IDeckCard, IDeckCardWithState } from "./types/types";
import DeckTable from "./components/DeckTable";
import Precision from "./components/Precision";
import {  calculateResultWithError,  formatElapsedTime, getRandomCards } from "./utils/utils";
import { FaArrowTurnDown } from "react-icons/fa6";
import {  toRomaji } from "wanakana";
import useTimer, { useCountDown } from "./hooks/hooks";
import Progress from "./components/Progress";
import CircleProgress from "./components/CircleProgress";

interface WordCardProps {
  word: IDeckCard | null;
  onAnswer: (value: boolean) => void;
  isRomajiInput: boolean;
}


function WordCard({ word, onAnswer }: WordCardProps) {
  const { inputMode, isRomajiInput } = useDeckStore();
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);



  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setInputValue(value);
    console.log(value)


  const answers = isRomajiInput ? word?.answer.map(answer => toRomaji(answer.toLowerCase())): word?.answer ;

    if (answers && answers.includes(value)) {
      onAnswer(true);        
      setInputValue(""); 
     }else if(value.includes("1" || "１")){
      onAnswer(false)
     
      setInputValue(""); 
     }
  };

  useEffect(() => {
    
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "1") {
        onAnswer(false);
      } else if ((!inputMode && event.key === "2" )||(!inputMode && event.key === " "  )) {
        onAnswer(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onAnswer, inputMode]);

  useEffect(() => {    
    if (inputRef.current ) {
      setTimeout(() => {
        if (inputRef.current !=null )     inputRef.current.focus()
      }, 100);
    }
    setInputValue("");
  }, [word]);


  return (
    word && (
      <article className="w-96 shadow-xl  bg-primary-content rounded-lg overflow-hidden flex flex-col ">
        <div className="w-full my-6 h-min text-5xl flex items-center justify-center">
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
              <span className="kbd kbd-sm text-base-content mb-3 ml-1">1</span>
            </button>
           
              <button
                className="bg-base-200 w-full h-full hover:opacity-70 text-lime-300 flex items-center justify-center"
                onClick={() => onAnswer(true)}
              >
                PASS
                <span className=" text-base-content mb-5 ml-1">
                  <span className="kbd kbd-sm mr-0.5">2</span>
                  <span className=" kbd kbd-sm">_</span>
                </span>
              </button></>
            ) : (
              <div className="p-2 w-full ">
                <div className="flex flex-col items-end">
        <kbd className="kbd kbd-sm mb-1 text-error border-error">1</kbd>
                <input
                key={word.question}
                  type="text"
                  className="p-2 bg-primary-content h-full w-full border-2 border-base-content rounded-lg"
                  value={inputValue}
                  onChange={e=>handleInput(e)}
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


function PastWordCard({ word }: { word: IDeckCardWithState | null }) {
  return (
    <article
      className={`w-full p-2 flex flex-col shadow-xl rounded-lg overflow-hidden bg-primary-content transition-all ${!word && "opacity-0"}`}
    >
      <div className={`w-full flex-col h-28   text-5xl flex items-center justify-center pb-4 ${word?.state === "failed" ? "text-red-500" : "text-green-500"}`}>
        <span className="text-xl">{word?.answer.join(", ") || ""}</span>
        <span className={`text-5xl `}>{word?.question || ""}</span>
    </div>
      <div className="bg-base-300 w-full h-1 "></div>
      <div className="w-full flex-col h-min bg-primary-content  p-4 text-5xl flex items-center justify-center ">
        <span className="text-xl">{word?.meaning || ""}</span>
      </div>
    </article>
  );
}

function WordsCarrousel({ words }: { words: IDeckCardWithState[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(words.length - 1);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        goToPrevious();
      } else if (event.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
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
        {words.map((word) => (
          <div key={word.question} className="w-[30rem] flex-shrink-0">
            <PastWordCard word={word} />
          </div>
        ))}
      </div>

      {currentIndex > 0 && (<>
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
      <h1 className="text-3xl mb-6">VOCABULARY KNOWLEDGE</h1>
      <div className="gap-x-4 flex flex-col gap-2">
        {decks.map((deck) => (
          <div key={deck.name} className="flex gap-4  items-center">
            <span>{deck.name}</span>
            <Progress value={deck.correctCount } max={deck.sampleSize}/>
           
            
            <span>{calculateResultWithError(deck.correctCount!, deck.sampleSize!, deck.deckSize!, ((deck.correctCount! * 100) / deck.sampleSize!))}</span>
          </div>
        ))}
      </div>
    </article>
  );
}


function Game() {
  const { decks, setDecks, isRomajiInput, setIsRomajiInput, inputMode, answerTime} = useDeckStore();

  const { 
    startTimer,
    pauseTimer,
    seconds} = useTimer()
  const  { startCountdown,  countdownSeconds, isCountdownRunning, togglePause, resetCountdown, stopCountdown } = useCountDown(answerTime)

  const [decksEmpty, setDecksEmpty] = useState(false);
  const [deck, setDeck] = useState<IDeck | null>(null);
  const [deckIndex, setDeckIndex] = useState(0);
  const [word, setWord] = useState<IDeckCard | null>(null);
  const [words, setWords] = useState<IDeckCardWithState[]>([]);
  const [failedWordsNumber, setFailedWordsNumber] = useState(0)

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
      startTimer()
     
    }else{
      console.log("could u pause")
      pauseTimer()
    }
  }, [decksEmpty]);

  
  useEffect(() => {
    if(countdownSeconds === 0){
      handleAnswer(false)
    }
    
  }, [countdownSeconds]);


  useEffect(() => {
    setDecksEmpty(decks.every((deck) => deck.cards.length === 0));   
    
  }, [word]);

  useEffect(()=>{
    if (answerTime !== 0){
      resetCountdown()
      startCountdown()
  
    if(decksEmpty)  stopCountdown()
    }

  },[word, decksEmpty])

  const handleAnswer = (isCorrect: boolean) => {
  
    if (word) {
      if (isCorrect) {
        setWords(prevWords => [...prevWords, { ...word, state: "passed" }]);
        if(deck){
            const updatedDecks = decks;
            updatedDecks[deckIndex].correctCount! += 1;
            setDecks(updatedDecks);
          
        }
      } else {
        setFailedWordsNumber(prev=>prev + 1)
        setWords(prevWords => [...prevWords, { ...word, state: "failed" }]);
      }
      setButtonPressed(true)
    }
    
    shiftCard();
  };

  const remainingCards = decks.reduce(
    (accumulator, deck) => accumulator + (deck.cards.length ?? 0),
    0
  );

  const wordComponent = useMemo(() => <WordCard word={word} onAnswer={handleAnswer} isRomajiInput={isRomajiInput} />, [word]);

  const wordCarrouselComponent = useMemo(() => <WordsCarrousel words={words} />, [words]);


  return !decksEmpty ? (
    <section className="flex flex-col lg:flex-row lg:gap-20 gap-4 items-center">
      <div className=" bg-opacity-70 bg-base-200 p-4 rounded-lg backd">
      <div className="flex items-center justify-center gap-4">
        
        <div
          className="collapse bg-base-300 w-fit mb-3 shrink-0 hover:bg-base-100"
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
    <div className="stat-value text-xl">{words.length - failedWordsNumber}</div>
    </div>
    </div>

      
      
        {inputMode &&
      <label htmlFor="inputRomaji" className="flex mt-6 w-full justify-around">
              {" "}
              Romaji Input
              <input
                type="checkbox"
                className="toggle"
                checked={isRomajiInput}
                id="inputRomaji"
                onChange={() => setIsRomajiInput(!isRomajiInput)}
              />
            </label>}
      </div>
      <div className="flex flex-col justify-center gap-10  items-center">
        {wordCarrouselComponent}
        <div className="relative">

      {wordComponent}
      {answerTime !== 0 &&
      <button onClick={()=>togglePause()} className="absolute right-1 top-1">
        
        <CircleProgress countdownSeconds={countdownSeconds} answerTime={answerTime} isRunning = {isCountdownRunning} buttonPressed={buttonPressed} setButtonPressed={setButtonPressed}/>
        
        </button>}
      </div>
      </div>
      </section>
      
  ) : (
    <Results elapsedTime={seconds} />
  );
}

export default function App() {
  
    const { decks, setDecks, precision, inputMode, setInputMode, answerTime, setAnswerTime } =
      useDeckStore();

  const availableDecks = [dataN1, dataN2, dataN3, dataN4, dataN5];
  const [selectedDecksNames, setSelectedDecksNames] = useState<string[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
const answerTimeOptions = [0,3,4,5,6,7,10]
const answerTimeLastOption = answerTimeOptions[answerTimeOptions.length -1]
const answerTimeProgress = answerTime *100 / answerTimeLastOption

  const handleDeckSelection = (deckName: string) => {
    if (deckName === "all"){
      if (selectedDecksNames.length === availableDecks.length) {
        setSelectedDecksNames([]);
      } else {
        setSelectedDecksNames(availableDecks.map(deck => deck.name));
      }
    }else{
      
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
    <main className="flex overx flex-col gap-6 min-h-screen justify-center items-center">
      <header className="absolute sm:text-5xl md:text-9xl top-0 left-0 -z-30">
        <h1>
          J-GRADER
          <span className="ml-2 badge badge-outline badge-primary md:text-2xl p-4">
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
              selectedDecksNames={selectedDecksNames}
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
            <label htmlFor="inputType" className="flex w-full justify-between place-items-center">
              {" "}
              <span className={`${answerTime === 0 ? ' line-through' : ''} `}>
        Answer Time
      </span>
  
              <button onClick={handleNextAnswerTimeOption} className="radial-progress bg-base-200" style={{ "--value": answerTimeProgress.toString(), "--size": "4rem", "--thickness": "10px" }} role="progressbar">{answerTime}s</button>

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
                Estimated time:{" "}
                <b>
    {getTimeRange()}
  </b>
</div>
            </div>
            <button
              className={`btn w-full btn-primary text-xl `}
              onClick={startGame}
              disabled={decks.length < 1 || totalCardCountSample< 1}
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
