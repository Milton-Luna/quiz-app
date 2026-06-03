import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import type { Route } from "./+types/results";
import { Layout } from "~/components";
import { useHighScore } from "~/hooks";

export function meta(_args: Route.MetaArgs) {
  return [
    { title: "Country Quiz — Resultados" },
    { name: "description", content: "Revisa tu puntaje final." },
  ];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

interface ScoreMessage {
  emoji: string;
  title: string;
  subtitle: string;
}

function getScoreMessage(score: number): ScoreMessage {
  if (score === 0)
    return {
      emoji: "💪",
      title: "¡Tú puedes!",
      subtitle: "La práctica hace al maestro. ¡Inténtalo de nuevo!",
    };
  if (score < 5)
    return {
      emoji: "👍",
      title: "¡Buen comienzo!",
      subtitle: "Vas aprendiendo. ¡Sigue practicando!",
    };
  if (score < 10)
    return {
      emoji: "🎉",
      title: "¡Muy bien hecho!",
      subtitle: "Tienes buen conocimiento del mundo.",
    };
  if (score < 20)
    return {
      emoji: "🌟",
      title: "¡Impresionante!",
      subtitle: "Eres todo un experto en geografía.",
    };
  return {
    emoji: "🏆",
    title: "¡Leyenda!",
    subtitle: "Conocimiento del mundo nivel enciclopedia.",
  };
}

// ─── Página Results ───────────────────────────────────────────────────────────

export default function Results() {
  const navigate = useNavigate();
  const location = useLocation();
  const { highScore } = useHighScore();

  // Recuperar el score pasado desde la página Quiz
  const locationState = location.state as { score?: number } | null;
  const score = locationState?.score;

  // Si alguien entra directamente a /results sin jugar, redirigir al inicio
  useEffect(() => {
    if (score === undefined) {
      navigate("/", { replace: true });
    }
  }, [score, navigate]);

  if (score === undefined) return null;

  const { emoji, title, subtitle } = getScoreMessage(score);
  const isNewRecord = score > 0 && score >= highScore;

  return (
    <Layout>
      <div className="flex flex-col items-center gap-6 pt-6 pb-10 text-center">

        {/* ── Emoji resultado ── */}
        <div
          className="text-7xl drop-shadow-lg"
          aria-hidden="true"
        >
          {emoji}
        </div>

        {/* ── Mensaje ── */}
        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            {title}
          </h2>
          <p className="text-indigo-200 dark:text-indigo-300 text-sm max-w-xs mx-auto">
            {subtitle}
          </p>
        </div>

        {/* ── Badge de nuevo récord ── */}
        {isNewRecord && (
          <div
            className="
              flex items-center gap-2 px-5 py-2 rounded-full
              bg-amber-400/25 border border-amber-400/40
              text-amber-200 font-bold text-sm
              animate-bounce
            "
            role="status"
          >
            <span aria-hidden="true">🎊</span>
            ¡Nuevo récord personal!
          </div>
        )}

        {/* ── Tarjeta de puntaje ── */}
        <div
          className="
            w-full rounded-2xl overflow-hidden
            bg-white/10 dark:bg-white/5
            border border-white/20
            shadow-xl
          "
        >
          {/* Score principal */}
          <div className="py-8 px-6 border-b border-white/10">
            <p className="text-xs uppercase tracking-widest text-white/50 mb-1 font-semibold">
              Tu puntaje
            </p>
            <p
              className="text-7xl font-black text-white leading-none"
              aria-label={`Puntaje: ${score} respuestas correctas`}
            >
              {score}
            </p>
            <p className="text-indigo-200 text-sm mt-1">
              respuestas correctas
            </p>
          </div>

          {/* High Score */}
          <div className="py-5 px-6 flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-300">
              <span aria-hidden="true">🏆</span>
              <span className="text-sm font-semibold">Mejor racha</span>
            </div>
            <span className="text-2xl font-extrabold text-amber-300">
              {highScore}
            </span>
          </div>
        </div>

        {/* ── Acciones ── */}
        <div className="w-full space-y-3">
          {/* Volver a jugar */}
          <button
            onClick={() => navigate("/quiz")}
            className="
              w-full py-4 rounded-2xl
              bg-gradient-to-r from-violet-500 to-indigo-500
              hover:from-violet-400 hover:to-indigo-400
              active:scale-[0.98]
              text-white font-extrabold text-base tracking-wide
              shadow-lg shadow-indigo-900/40
              transition-all duration-200
              focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70
            "
          >
            Intentar de nuevo 🔄
          </button>

          {/* Ir al inicio */}
          <button
            onClick={() => navigate("/")}
            className="
              w-full py-3.5 rounded-2xl
              bg-white/10 hover:bg-white/20
              border border-white/20 hover:border-white/30
              text-white font-semibold text-sm
              transition-all duration-200
              focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70
            "
          >
            Ir al inicio 🏠
          </button>
        </div>
      </div>
    </Layout>
  );
}
