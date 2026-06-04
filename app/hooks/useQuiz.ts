import { useState, useCallback, useRef } from "react";
import { fetchCountries } from "~/services";
import { generateQuestions, generateOneQuestion } from "~/utils";
import type { Country, GameStatus, QuizQuestion } from "~/types";


const BATCH_SIZE = 10;



export interface QuizHookReturn {
  questions: QuizQuestion[];
  currentQuestion: QuizQuestion | null;
  currentIndex: number;
  score: number;
  status: GameStatus;
  selectedAnswer: string | null;
  isLastAnswerCorrect: boolean;
  errorMessage: string | null;
  startQuiz: () => Promise<void>;
  handleAnswer: (answer: string) => void;
  nextQuestion: () => void;
  handleTimeout: () => void;
}

export function useQuiz(): QuizHookReturn {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<GameStatus>("idle");
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isLastAnswerCorrect, setIsLastAnswerCorrect] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);


  const countriesRef = useRef<Country[]>([]);

  const currentQuestion = questions[currentIndex] ?? null;



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

  const handleAnswer = useCallback(
    (answer: string) => {
      if (status !== "playing" || !currentQuestion) return;

      const isCorrect = answer === currentQuestion.correctAnswer;
      setSelectedAnswer(answer);
      setIsLastAnswerCorrect(isCorrect);

      if (isCorrect) {
        setScore((prev) => prev + 1);
        setStatus("answered");
      } else {
        setStatus("answered");
      }
    },
    [status, currentQuestion]
  );


  const nextQuestion = useCallback(() => {
    if (status !== "answered") return;

    if (!isLastAnswerCorrect) {
      setStatus("finished");
      return;
    }

    const nextIdx = currentIndex + 1;

    if (nextIdx >= questions.length) {
      const moreQuestion = generateOneQuestion(countriesRef.current);
      setQuestions((prev) => [...prev, moreQuestion]);
    }

    setCurrentIndex(nextIdx);
    setSelectedAnswer(null);
    setIsLastAnswerCorrect(false);
    setStatus("playing");
  }, [status, isLastAnswerCorrect, currentIndex, questions.length]);


  const handleTimeout = useCallback(() => {
    if (status !== "playing") return;

    setSelectedAnswer(null);
    setIsLastAnswerCorrect(false);
    setStatus("finished");
  }, [status]);


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
