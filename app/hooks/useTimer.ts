import { useState, useEffect, useRef, useCallback } from "react";

export const TIMER_DURATION = 15;

/**
 * Temporizador regresivo de 15 segundos por pregunta.
 *
 * - Se reinicia automáticamente cuando cambia `questionId`.
 * - Se detiene cuando `isRunning` es false (ej: usuario respondió).
 * - Llama a `onTimeout` cuando llega a 0.
 */
export function useTimer(
  /** ID de la pregunta actual — cambiar este valor reinicia el contador */
  questionId: string | undefined,
  /** false pausa el timer (ej: durante feedback de respuesta) */
  isRunning: boolean,
  /** Se llama una sola vez cuando el tiempo llega a 0 */
  onTimeout: () => void
) {
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  // Ref para evitar stale closure en el callback de timeout
  const onTimeoutRef = useRef(onTimeout);

  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  });

  // Reiniciar y arrancar el timer cuando cambia la pregunta o el estado
  useEffect(() => {
    if (!isRunning || !questionId) {
      return;
    }

    // Reset al comenzar una nueva pregunta
    setTimeLeft(TIMER_DURATION);

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId);
          onTimeoutRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [questionId, isRunning]); // Se re-ejecuta en cada nueva pregunta

  /**
   * Porcentaje restante del tiempo (100 → 0).
   * Útil para la barra de progreso del timer.
   */
  const timePercent = Math.round((timeLeft / TIMER_DURATION) * 100);

  /**
   * Clase de color según urgencia:
   * - verde (>50%), amarillo (25–50%), rojo (<25%)
   */
  const getTimerColor = useCallback(() => {
    if (timeLeft > 7) return "text-green-500 dark:text-green-400";
    if (timeLeft > 4) return "text-yellow-500 dark:text-yellow-400";
    return "text-red-500 dark:text-red-400";
  }, [timeLeft]);

  return { timeLeft, timePercent, getTimerColor };
}
