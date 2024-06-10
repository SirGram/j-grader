import { useCallback, useEffect, useRef, useState } from "react";

export default function useTimer(initialTime=0) {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(initialTime);
  let interval = useRef();

  const onStop = useCallback(() => {
    setIsRunning(false);
    setSeconds(initialTime);
    clearInterval(interval.current);
  }, [setIsRunning, setSeconds, initialTime]);
  
  const onPause = useCallback(() => {
    setIsRunning(false);
    clearInterval(interval.current);
  }, [setIsRunning]);

  const onStart = useCallback(() => {
    setIsRunning(true);
    interval.current = setInterval(() => {
      setSeconds((seconds:number) => seconds + 1);
    }, 1000);
  }, [setIsRunning]);

  useEffect(() => {
    if (seconds < 1) {
      onStop();
    }
  }, [seconds, onStop]);

  return {
    isRunning,
    startTimer: onStart,
    pauseTimer:onPause,
    stop: onStop,
    seconds
  };
}