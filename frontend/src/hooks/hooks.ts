import { useCallback, useEffect, useRef, useState } from "react";

export default function useTimer(initialTime=0) {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(initialTime);
  let interval = useRef<NodeJS.Timeout | null>(null);

  const onStop = useCallback(() => {
    setIsRunning(false);
    setSeconds(initialTime);
    if (interval.current)    clearInterval(interval.current);
  }, [setIsRunning, setSeconds, initialTime]);
  
  const onPause = useCallback(() => {
    setIsRunning(false);
    if (interval.current)    clearInterval(interval.current);
  }, [setIsRunning]);

  const onStart = useCallback(() => {
    setIsRunning(true);
    interval.current = setInterval(() => {
      setSeconds((seconds:number) => seconds + 1);
    }, 1000);
  }, [setIsRunning]);


  return {
    isRunning,
    startTimer: onStart,
    pauseTimer:onPause,
    stop: onStop,
    seconds
  };
}


export function useCountDown(timeInSeconds: number) {
  const [isRunningCountdown, setIsRunningCountdown] = useState(false);
  const [countdownSeconds, setCountdownSeconds] = useState(timeInSeconds);
  let interval = useRef<NodeJS.Timeout | null>(null);

  const onStop = useCallback(() => {
    setIsRunningCountdown(false);
    setCountdownSeconds(timeInSeconds);
    if (interval.current)    clearInterval(interval.current);
  }, [setIsRunningCountdown, setCountdownSeconds, timeInSeconds]);
  
  const onPause = useCallback(() => {
    setIsRunningCountdown(false);
    if (interval.current)    clearInterval(interval.current);
  }, [setIsRunningCountdown]);

  const onStart = useCallback(() => {
    setIsRunningCountdown(true);
    interval.current = setInterval(() => {
      setCountdownSeconds((countdownSeconds:number) => countdownSeconds - 1);
    }, 1000);
  }, [setIsRunningCountdown]);

  useEffect(() => {
    return () => {
      if (interval.current) {
        clearInterval(interval.current);
      }
    };
  }, []);


  return {
    isRunningCountdown,
    startCountdown: onStart,
    pauseCountdown:onPause,
    stopCountdown: onStop,
    countdownSeconds
  };
}