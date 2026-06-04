import { useState, useEffect, useRef, useCallback } from "react";

export const TIMER_DURATION = 15;

export function useTimer(
  questionId: string | undefined,
  isRunning: boolean,
  onTimeout: () => void
) {
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const onTimeoutRef = useRef(onTimeout);

  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  });

  useEffect(() => {
    if (!isRunning || !questionId) return;

    setTimeLeft(TIMER_DURATION);

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    const timeoutId = setTimeout(() => {
      onTimeoutRef.current();
    }, TIMER_DURATION * 1000);

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [questionId, isRunning]);

  const timePercent = Math.round((timeLeft / TIMER_DURATION) * 100);


  const getTimerColor = useCallback(() => {
    if (timeLeft > 7) return "text-green-400 dark:text-green-300";
    if (timeLeft > 4) return "text-yellow-400 dark:text-yellow-300";
    return "text-red-400 dark:text-red-300";
  }, [timeLeft]);

  return { timeLeft, timePercent, getTimerColor };
}
