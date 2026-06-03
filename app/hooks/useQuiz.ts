import { useState, useCallback, useRef } from "react";
import { fetchCountries } from "~/services";
import { generateQuestions, generateOneQuestion } from "~/utils";
import type { Country, GameStatus, QuizQuestion } from "~/types";

// ─── Constantes ───────────────────────────────────────────────────────────────

/** Preguntas generadas por batch para evitar generar una a una */
const BATCH_SIZE = 10;

// ─── Tipos internos ───────────────────────────────────────────────────────────

export interface QuizHookReturn {
  /** Lista completa de preguntas generadas hasta ahora */
  questions: QuizQuestion[];
  /** Pregunta activa en este momento */
  currentQuestion: QuizQuestion | null;
  /** Índice de la pregunta actual (0-based) */
  currentIndex: number;
  /** Puntaje acumulado de respuestas correctas */
  score: number;
  /** Estado actual del juego */
  status: GameStatus;
  /** Respuesta seleccionada por el usuario (texto del país) */
  selectedAnswer: string | null;
  /** true si la última respuesta fue correcta */
  isLastAnswerCorrect: boolean;
  /** Mensaje de error si el fetch falla */
  errorMessage: string | null;
  /** Inicia o reinicia el juego completo */
  startQuiz: () => Promise<void>;
  /** El usuario selecciona una respuesta */
  handleAnswer: (answer: string) => void;
  /** Avanza a la siguiente pregunta (solo si la última fue correcta) */
  nextQuestion: () => void;
  /** El timer llegó a 0 → se llama externamente desde useTimer */
  handleTimeout: () => void;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Gestiona todo el estado del quiz:
 * carga de países, generación de preguntas, puntuación y transiciones de estado.
 *
 * El timer (useTimer), el sonido (useSoundEffect) y el high score (useHighScore)
 * se componen FUERA de este hook para mantener la separación de responsabilidades.
 */
export function useQuiz(): QuizHookReturn {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<GameStatus>("idle");
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isLastAnswerCorrect, setIsLastAnswerCorrect] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Ref para acceder a countries dentro de callbacks sin dependencias obsoletas
  const countriesRef = useRef<Country[]>([]);

  // ─── Pregunta actual ─────────────────────────────────────────────────────

  const currentQuestion = questions[currentIndex] ?? null;

  // ─── Inicio / Reinicio ───────────────────────────────────────────────────

  const startQuiz = useCallback(async () => {
    setStatus("loading");
    setErrorMessage(null);
    setScore(0);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsLastAnswerCorrect(false);

    try {
      const fetchedCountries = await fetchCountries();
      countriesRef.current = fetchedCountries;

      const initialQuestions = generateQuestions(fetchedCountries, BATCH_SIZE);
      setQuestions(initialQuestions);

      setStatus("playing");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al cargar los países.";
      setErrorMessage(message);
      setStatus("idle");
    }
  }, []);

  // ─── Selección de respuesta ──────────────────────────────────────────────

  const handleAnswer = useCallback(
    (answer: string) => {
      // Ignorar clicks si no estamos jugando
      if (status !== "playing" || !currentQuestion) return;

      const isCorrect = answer === currentQuestion.correctAnswer;
      setSelectedAnswer(answer);
      setIsLastAnswerCorrect(isCorrect);

      if (isCorrect) {
        setScore((prev) => prev + 1);
        setStatus("answered");
      } else {
        // Respuesta incorrecta → fin del juego
        // Pasamos por 'answered' brevemente para mostrar el feedback visual
        setStatus("answered");
        // El componente de la página usará isLastAnswerCorrect para decidir
        // si mostrar "Siguiente" o redirigir a resultados
      }
    },
    [status, currentQuestion]
  );

  // ─── Siguiente pregunta ──────────────────────────────────────────────────

  const nextQuestion = useCallback(() => {
    if (status !== "answered") return;

    // Si la respuesta fue incorrecta, el juego termina
    if (!isLastAnswerCorrect) {
      setStatus("finished");
      return;
    }

    const nextIdx = currentIndex + 1;

    // Si nos quedamos sin preguntas, generar una nueva
    if (nextIdx >= questions.length) {
      const moreQuestion = generateOneQuestion(countriesRef.current);
      setQuestions((prev) => [...prev, moreQuestion]);
    }

    setCurrentIndex(nextIdx);
    setSelectedAnswer(null);
    setIsLastAnswerCorrect(false);
    setStatus("playing");
  }, [status, isLastAnswerCorrect, currentIndex, questions.length]);

  // ─── Timeout ─────────────────────────────────────────────────────────────

  const handleTimeout = useCallback(() => {
    // Solo actuar si el juego está activo (no si ya respondió)
    if (status !== "playing") return;

    setSelectedAnswer(null);
    setIsLastAnswerCorrect(false);
    setStatus("finished");
  }, [status]);

  // ─── Return ──────────────────────────────────────────────────────────────

  return {
    questions,
    currentQuestion,
    currentIndex,
    score,
    status,
    selectedAnswer,
    isLastAnswerCorrect,
    errorMessage,
    startQuiz,
    handleAnswer,
    nextQuestion,
    handleTimeout,
  };
}
