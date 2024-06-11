import { useCallback, useEffect, useRef, useState } from "react";

export default function useTimer(initialTime=0) {
  const [seconds, setSeconds] = useState(initialTime);
  let interval = useRef<NodeJS.Timeout | null>(null);

  const onReset = () => {
    if (interval.current)    clearInterval(interval.current);
    setSeconds(initialTime);
  }
  
  const onPause = () => {
    if (interval.current)    clearInterval(interval.current);
  }

  const onStart = () => {
    if (interval.current)    clearInterval(interval.current);
    interval.current = setInterval(() => {
      setSeconds((seconds:number) => seconds + 1);
    }, 1000);
  };
  

  useEffect(() => {
    return () => {
      if (interval.current) {
        clearInterval(interval.current);
      }
    };
  }, []);


  return {
    startTimer: onStart,
    pauseTimer:onPause,
    resetTimer: onReset,
    seconds
  };
}


export function useCountDown(timeInSeconds: number) {
  const [countdownSeconds, setCountdownSeconds] = useState(timeInSeconds);
  const [isCountdownRunning, setIsCountdownRunning] = useState(true);
  let interval = useRef<NodeJS.Timeout | null>(null);

  const onReset = () => {
    setCountdownSeconds(timeInSeconds);
    if (interval.current)    clearInterval(interval.current);
  }
  const onStop = () => {
    setCountdownSeconds(timeInSeconds);
    setIsCountdownRunning(false)
    if (interval.current)    clearInterval(interval.current);

  }

  const togglePause = () => {
    setIsCountdownRunning(!isCountdownRunning)
  }
  

  const decrementCountdown = () => {
    setCountdownSeconds((prevSeconds) => {
      if (prevSeconds === 0) {
        if (interval.current )clearInterval(interval.current);
        return 0;
      }
      return prevSeconds - 1;
    });
  };
  
  const onStart = useCallback(() => {
    if (interval.current) clearInterval(interval.current);
    if (isCountdownRunning)    interval.current = setInterval(decrementCountdown, 1000);

  },[isCountdownRunning])


  useEffect(() => {
    if (isCountdownRunning) {
      onStart();
    } else if (interval.current) {
      clearInterval(interval.current);
      interval.current = null;
    }

    return () => {
      if (interval.current) {
        clearInterval(interval.current);
      }
    };
  }, [isCountdownRunning, onStart]);


  return {
    startCountdown: onStart,
    resetCountdown: onReset,
    stopCountdown:onStop,
    togglePause,
    countdownSeconds, isCountdownRunning
  };
}