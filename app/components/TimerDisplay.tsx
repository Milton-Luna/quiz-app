import { useTimer } from "~/hooks";

interface TimerDisplayProps {
  questionId: string | undefined;
  isRunning: boolean;
  onTimeout: () => void;
}

/**
 * Muestra el tiempo restante con cambio de color según urgencia.
 * Incluye la barra de progreso visual.
 * Delega el estado del timer al hook useTimer.
 */
export function TimerDisplay({
  questionId,
  isRunning,
  onTimeout,
}: TimerDisplayProps) {
  const { timeLeft, timePercent, getTimerColor } = useTimer(
    questionId,
    isRunning,
    onTimeout
  );

  const isUrgent = timeLeft <= 5;

  return (
    <div className="flex items-center gap-3">
      {/* Ícono de reloj con animación de pulso en los últimos 5 segundos */}
      <span
        aria-hidden="true"
        className={`text-lg select-none ${isUrgent ? "animate-bounce" : ""}`}
      >
        ⏱️
      </span>

      {/* Número de segundos */}
      <span
        aria-live="polite"
        aria-label={`${timeLeft} segundos restantes`}
        className={`
          w-8 text-center font-bold text-xl tabular-nums transition-colors duration-300
          ${getTimerColor()}
          ${isUrgent ? "animate-pulse" : ""}
        `}
      >
        {timeLeft}
      </span>

      {/* Porcentaje para screen readers */}
      <span className="sr-only">{timePercent}% del tiempo restante</span>
    </div>
  );
}
