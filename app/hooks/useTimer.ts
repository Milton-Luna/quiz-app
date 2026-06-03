import { useState, useEffect, useRef, useCallback } from "react";

export const TIMER_DURATION = 15;

/**
 * Temporizador regresivo de 15 segundos por pregunta.
 *
 * - Se reinicia automáticamente cuando cambia `questionId`.
 * - Se pausa cuando `isRunning` es false.
 * - Llama a `onTimeout` mediante un setTimeout independiente
 *   (no dentro de un state updater) para evitar doble disparo en Strict Mode.
 */
export function useTimer(
  questionId: string | undefined,
  isRunning: boolean,
  onTimeout: () => void
) {
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const onTimeoutRef = useRef(onTimeout);

  // Mantener la ref actualizada sin re-ejecutar el efecto
  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  });

  useEffect(() => {
    if (!isRunning || !questionId) return;

    // Reiniciar al comenzar una nueva pregunta
    setTimeLeft(TIMER_DURATION);

    // Intervalo que decrementa el contador cada segundo
    const intervalId = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    // Timeout independiente que dispara el callback al expirar
    // (fuera del state updater → no se llama dos veces en Strict Mode)
    const timeoutId = setTimeout(() => {
      onTimeoutRef.current();
    }, TIMER_DURATION * 1000);

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [questionId, isRunning]);

  /** Porcentaje de tiempo restante (100 → 0), para la ProgressBar */
  const timePercent = Math.round((timeLeft / TIMER_DURATION) * 100);

  /** Clase Tailwind de color según urgencia */
  const getTimerColor = useCallback(() => {
    if (timeLeft > 7) return "text-green-400 dark:text-green-300";
    if (timeLeft > 4) return "text-yellow-400 dark:text-yellow-300";
    return "text-red-400 dark:text-red-300";
  }, [timeLeft]);

  return { timeLeft, timePercent, getTimerColor };
}
