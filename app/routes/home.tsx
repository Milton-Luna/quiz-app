import { useNavigate } from "react-router";
import type { Route } from "./+types/home";
import { Layout } from "~/components";
import { useHighScore } from "~/hooks";

export function meta(_args: Route.MetaArgs) {
  return [
    { title: "Country Quiz — Inicio" },
    {
      name: "description",
      content:
        "Pon a prueba tu conocimiento sobre países, capitales y banderas del mundo.",
    },
  ];
}

const FEATURES = [
  { icon: "🏳️", label: "Identifica banderas del mundo" },
  { icon: "🗺️", label: "Adivina capitales de países" },
  { icon: "⏱️", label: "15 segundos por pregunta" },
  { icon: "🏆", label: "Guarda tu mejor racha" },
];

export default function Home() {
  const navigate = useNavigate();
  const { highScore } = useHighScore();

  return (
    <Layout>
      <div className="flex flex-col items-center gap-8 pt-6 pb-10">

        {/* ── Hero ── */}
        <div className="text-center space-y-3">
          <div className="text-7xl mb-2 drop-shadow-lg" aria-hidden="true">
            🌍
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Country Quiz
          </h2>
          <p className="text-indigo-200 dark:text-indigo-300 text-sm sm:text-base max-w-xs mx-auto leading-relaxed">
            ¿Cuánto sabes del mundo? Responde correctamente tantas preguntas
            como puedas antes de que el tiempo se acabe.
          </p>
        </div>

        {/* ── High Score (solo si ya jugó) ── */}
        {highScore > 0 && (
          <div
            className="
              flex items-center gap-2 px-5 py-2.5 rounded-2xl
              bg-amber-400/20 border border-amber-400/30
              text-amber-200 dark:text-amber-300 font-semibold text-sm
            "
          >
            <span aria-hidden="true">🏆</span>
            <span>
              Tu récord:{" "}
              <strong className="text-base">{highScore}</strong> correctas
            </span>
          </div>
        )}

        {/* ── Características ── */}
        <ul className="w-full space-y-2.5">
          {FEATURES.map(({ icon, label }) => (
            <li
              key={label}
              className="
                flex items-center gap-3 px-4 py-3 rounded-xl
                bg-white/8 dark:bg-white/5
                border border-white/10
                text-white/80 text-sm
              "
            >
              <span className="text-xl" aria-hidden="true">
                {icon}
              </span>
              {label}
            </li>
          ))}
        </ul>

        {/* ── Botón de inicio ── */}
        <button
          onClick={() => navigate("/quiz")}
          className="
            w-full py-4 rounded-2xl
            bg-gradient-to-r from-violet-500 to-indigo-500
            hover:from-violet-400 hover:to-indigo-400
            active:scale-[0.98]
            text-white font-extrabold text-lg tracking-wide
            shadow-lg shadow-indigo-900/40
            transition-all duration-200
            focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70
          "
        >
          Empezar Quiz 🚀
        </button>
      </div>
    </Layout>
  );
}
