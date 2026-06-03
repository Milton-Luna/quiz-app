interface ProgressBarProps {
  /** Porcentaje actual (0–100) */
  percent: number;
}

/**
 * Barra de progreso horizontal para el temporizador.
 * Cambia de color según el porcentaje restante:
 * - Verde  (>50%)
 * - Amarillo (25–50%)
 * - Rojo   (<25%)
 */
export function ProgressBar({ percent }: ProgressBarProps) {
  const clampedPercent = Math.min(100, Math.max(0, percent));

  const trackColor =
    clampedPercent > 50
      ? "bg-emerald-400 dark:bg-emerald-500"
      : clampedPercent > 25
        ? "bg-yellow-400 dark:bg-yellow-500"
        : "bg-red-400 dark:bg-red-500";

  return (
    <div
      role="progressbar"
      aria-valuenow={clampedPercent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Tiempo restante"
      className="w-full h-2 rounded-full bg-white/20 dark:bg-white/10 overflow-hidden"
    >
      <div
        className={`h-full rounded-full transition-all duration-1000 ease-linear ${trackColor}`}
        style={{ width: `${clampedPercent}%` }}
      />
    </div>
  );
}
