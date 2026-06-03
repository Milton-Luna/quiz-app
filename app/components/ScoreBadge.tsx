interface ScoreBadgeProps {
  score: number;
  highScore: number;
}

/**
 * Muestra el puntaje actual y el récord guardado en localStorage.
 */
export function ScoreBadge({ score, highScore }: ScoreBadgeProps) {
  return (
    <div className="flex items-center gap-3 text-sm font-semibold">
      {/* Puntaje actual */}
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 dark:bg-white/10 text-white">
        <span aria-hidden="true">⭐</span>
        <span>
          <span className="opacity-75">Score:</span>{" "}
          <span className="text-base font-bold">{score}</span>
        </span>
      </div>

      {/* Récord máximo */}
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400/20 dark:bg-amber-500/20 text-amber-200 dark:text-amber-300">
        <span aria-hidden="true">🏆</span>
        <span>
          <span className="opacity-75">Best:</span>{" "}
          <span className="text-base font-bold">{highScore}</span>
        </span>
      </div>
    </div>
  );
}
