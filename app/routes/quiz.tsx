import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import type { Route } from "./+types/quiz";
import {
  Layout,
  QuestionCard,
  ScoreBadge,
  TimerDisplay,
  ProgressBar,
} from "~/components";
import {
  useQuiz,
  useTimer,
  useHighScore,
  useSoundEffect,
} from "~/hooks";

export function meta(_args: Route.MetaArgs) {
  return [
    { title: "Country Quiz — Jugando" },
    { name: "description", content: "Responde preguntas sobre países del mundo." },
  ];
}

// ─── Spinner de carga ─────────────────────────────────────────────────────────

function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <div
        className="w-14 h-14 rounded-full border-4 border-white/20 border-t-white animate-spin"
        role="status"
        aria-label="Cargando países..."
      />
      <p className="text-white/70 text-sm font-medium animate-pulse">
        Cargando países...
      </p>
    </div>
  );
}

// ─── Pantalla de error ────────────────────────────────────────────────────────

function ErrorScreen({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-5 py-16 text-center">
      <span className="text-5xl" aria-hidden="true">😵</span>
      <div>
        <h2 className="text-xl font-bold text-white mb-1">Error al cargar</h2>
        <p className="text-red-300 text-sm max-w-xs">{message}</p>
      </div>
      <button
        onClick={onRetry}
        className="
          px-6 py-3 rounded-xl
          bg-white/15 hover:bg-white/25
          text-white font-semibold
          transition-colors
          focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70
        "
      >
        Reintentar
      </button>
    </div>
  );
}

// ─── Página Quiz ──────────────────────────────────────────────────────────────

export default function Quiz() {
  const navigate = useNavigate();

  // ── Hooks ────────────────────────────────────────────────────────────────
  const {
    currentQuestion,
    currentIndex,
    score,
    status,
    selectedAnswer,
    isLastAnswerCorrect,
    errorMessage,
    startQuiz,
    handleAnswer,
    handleTimeout,
    nextQuestion,
  } = useQuiz();

  const { highScore, updateHighScore } = useHighScore();
  const { playSuccess, playError } = useSoundEffect();

  const isTimerRunning = status === "playing";

  const { timeLeft, timePercent, getTimerColor } = useTimer(
    currentQuestion?.id,
    isTimerRunning,
    handleTimeout
  );

  // ── Efectos ───────────────────────────────────────────────────────────────

  // 1) Iniciar el quiz al montar la página
  useEffect(() => {
    startQuiz();
  }, [startQuiz]);

  // 2) Reproducir sonido cuando cambia a 'answered'
  const wasAnsweredRef = useRef(false);
  useEffect(() => {
    const isNowAnswered = status === "answered";
    if (isNowAnswered && !wasAnsweredRef.current) {
      if (isLastAnswerCorrect) {
        playSuccess();
      } else {
        playError();
      }
    }
    wasAnsweredRef.current = isNowAnswered;
  }, [status, isLastAnswerCorrect, playSuccess, playError]);

  // 3) Auto-avanzar cuando la respuesta es incorrecta (1.5 s de feedback)
  useEffect(() => {
    if (status === "answered" && !isLastAnswerCorrect) {
      const id = setTimeout(() => nextQuestion(), 1500);
      return () => clearTimeout(id);
    }
  }, [status, isLastAnswerCorrect, nextQuestion]);

  // 4) Navegar a resultados cuando el juego termina
  useEffect(() => {
    if (status === "finished") {
      updateHighScore(score);
      navigate("/results", { state: { score }, replace: true });
    }
  }, [status, score, updateHighScore, navigate]);

  // ── Renders condicionales ─────────────────────────────────────────────────

  const isLoading = status === "idle" || status === "loading";

  return (
    <Layout>
      {/* Error */}
      {errorMessage && (
        <ErrorScreen message={errorMessage} onRetry={startQuiz} />
      )}

      {/* Cargando */}
      {!errorMessage && isLoading && <LoadingScreen />}

      {/* Juego activo */}
      {!errorMessage && !isLoading && currentQuestion && (
        <div className="flex flex-col gap-4">

          {/* ── Fila superior: Score + Timer ── */}
          <div className="flex items-center justify-between">
            <ScoreBadge score={score} highScore={highScore} />
            <TimerDisplay
              timeLeft={timeLeft}
              colorClass={getTimerColor()}
            />
          </div>

          {/* ── Barra de progreso del timer ── */}
          <ProgressBar percent={timePercent} />

          {/* ── Tarjeta de pregunta ── */}
          <QuestionCard
            question={currentQuestion}
            questionNumber={currentIndex + 1}
            selectedAnswer={selectedAnswer}
            isAnswered={status === "answered"}
            onAnswer={handleAnswer}
          />

          {/* ── Botón "Siguiente" (solo si acertó) ── */}
          {status === "answered" && isLastAnswerCorrect && (
            <button
              onClick={nextQuestion}
              className="
                w-full py-4 rounded-2xl
                bg-gradient-to-r from-emerald-500 to-teal-500
                hover:from-emerald-400 hover:to-teal-400
                active:scale-[0.98]
                text-white font-extrabold text-base tracking-wide
                shadow-lg shadow-emerald-900/40
                transition-all duration-200
                focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70
              "
            >
              Siguiente pregunta →
            </button>
          )}

          {/* ── Mensaje de respuesta incorrecta (auto-navega en 1.5s) ── */}
          {status === "answered" && !isLastAnswerCorrect && (
            <div
              className="
                w-full py-3 px-4 rounded-xl text-center
                bg-red-500/20 border border-red-400/30
                text-red-200 text-sm font-semibold
                animate-pulse
              "
              role="alert"
            >
              ¡Respuesta incorrecta! Mostrando resultados...
            </div>
          )}
        </div>
      )}
    </Layout>
  );
}
