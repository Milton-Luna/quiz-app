// ─── Tipos de la API REST Countries ──────────────────────────────────────────

/** Forma raw que devuelve la API de restcountries.com */
export interface CountryRaw {
  name: {
    common: string;
    official: string;
  };
  capital: string[];
  flags: {
    png: string;
    svg: string;
    alt?: string;
  };
}

/** País normalizado para uso interno de la app */
export interface Country {
  name: string;    // nombre común
  capital: string; // primera capital (hay países con varias)
  flagSvg: string;
  flagPng: string;
  flagAlt: string;
}

// ─── Tipos del Quiz ───────────────────────────────────────────────────────────

/** Los dos tipos de pregunta posibles */
export type QuestionType = "flag" | "capital";

/** Las cuatro opciones de respuesta */
export type AnswerId = "A" | "B" | "C" | "D";

/** Una opción de respuesta individual */
export interface AnswerOption {
  id: AnswerId;
  text: string;
  isCorrect: boolean;
}

/** Una pregunta completa del quiz */
export interface QuizQuestion {
  id: string;
  type: QuestionType;
  /** Texto de la pregunta */
  question: string;
  /** Solo presente en preguntas de tipo 'flag' */
  flagUrl?: string;
  options: AnswerOption[];
  correctAnswer: string;
}

// ─── Estado del juego ─────────────────────────────────────────────────────────

/**
 * - idle      → en la pantalla de inicio
 * - loading   → cargando países desde la API
 * - playing   → jugando, timer corriendo
 * - answered  → el usuario seleccionó una respuesta (feedback visible)
 * - timeout   → el tiempo se acabó (cuenta como error)
 * - finished  → juego terminado (pantalla de resultados)
 */
export type GameStatus =
  | "idle"
  | "loading"
  | "playing"
  | "answered"
  | "timeout"
  | "finished";

/** Estado completo del quiz */
export interface QuizState {
  questions: QuizQuestion[];
  currentIndex: number;
  score: number;
  status: GameStatus;
  selectedAnswer: string | null;
}

// ─── High Score ───────────────────────────────────────────────────────────────

export interface HighScoreData {
  score: number;
  date: string; // ISO string
}

// ─── Errores ──────────────────────────────────────────────────────────────────

export interface ApiError {
  message: string;
  status?: number;
}
