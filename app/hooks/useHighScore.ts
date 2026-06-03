import { useState, useCallback } from "react";

const HIGH_SCORE_KEY = "quiz-highscore";

/**
 * Persiste el puntaje máximo alcanzado en localStorage.
 * Sobrevive recargas de página.
 */
export function useHighScore() {
  const [highScore, setHighScore] = useState<number>(() => {
    // Guard SSR: localStorage no existe en el servidor
    if (typeof window === "undefined") return 0;
    const saved = localStorage.getItem(HIGH_SCORE_KEY);
    return saved ? parseInt(saved, 10) : 0;
  });

  /**
   * Solo actualiza si `score` supera el récord actual.
   */
  const updateHighScore = useCallback(
    (score: number) => {
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem(HIGH_SCORE_KEY, score.toString());
      }
    },
    [highScore]
  );

  const resetHighScore = useCallback(() => {
    setHighScore(0);
    localStorage.removeItem(HIGH_SCORE_KEY);
  }, []);

  return { highScore, updateHighScore, resetHighScore };
}
