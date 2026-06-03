interface TimerDisplayProps {
  timeLeft: number;
  colorClass: string;
}

/**
 * Componente presentacional: muestra los segundos restantes.
 * El estado real viene de useTimer, que se usa en la página Quiz.
 */
export function TimerDisplay({ timeLeft, colorClass }: TimerDisplayProps) {
  const isUrgent = timeLeft <= 5;

  return (
    <div className="flex items-center gap-2" aria-live="polite">
      <span
        aria-hidden="true"
        className={`text-lg select-none ${isUrgent ? "animate-bounce" : ""}`}
      >
        ⏱️
      </span>
      <span
        aria-label={`${timeLeft} segundos restantes`}
        className={`
          w-7 text-center font-bold text-xl tabular-nums
          transition-colors duration-300
          ${colorClass}
          ${isUrgent ? "animate-pulse" : ""}
        `}
      >
        {timeLeft}
      </span>
    </div>
  );
}
