import { useState, useCallback } from "react";

const HIGH_SCORE_KEY = "quiz-highscore";


export function useHighScore() {
  const [highScore, setHighScore] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    const saved = localStorage.getItem(HIGH_SCORE_KEY);
    return saved ? parseInt(saved, 10) : 0;
  });

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
