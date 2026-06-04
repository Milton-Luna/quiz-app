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
      <div className="flex flex-col items-center gap-7 pt-4 pb-10">

        {}
        <div className="text-center space-y-3 animate-fade-in-up">
          {}
          <div className="relative inline-flex items-center justify-center mb-1">
            <span
              className="absolute w-24 h-24 rounded-full bg-indigo-400/20 dark:bg-indigo-500/20 animate-ping"
              aria-hidden="true"
            />
            <span className="relative text-7xl select-none drop-shadow-lg">
              🌍
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Country Quiz
          </h2>
          <p className="text-indigo-200 dark:text-indigo-300 text-sm sm:text-base max-w-xs mx-auto leading-relaxed">
            ¿Cuánto sabes del mundo? Responde correctamente tantas preguntas
            como puedas antes de que el tiempo se acabe.
          </p>
        </div>

        {}
        {highScore > 0 && (
          <div
            className="
              flex items-center gap-2 px-5 py-2.5 rounded-2xl
              bg-amber-400/20 border border-amber-400/30
              text-amber-200 dark:text-amber-300 font-semibold text-sm
              animate-slide-down
            "
          >
            <span aria-hidden="true">🏆</span>
            <span>
              Tu récord:{" "}
              <strong className="text-base">{highScore}</strong>{" "}
              {highScore === 1 ? "correcta" : "correctas"}
            </span>
          </div>
        )}

        {}
        <ul className="w-full space-y-2.5">
          {FEATURES.map(({ icon, label }, i) => (
            <li
              key={label}
              style={{ animationDelay: `${i * 70}ms` }}
              className="
                flex items-center gap-3 px-4 py-3 rounded-xl
                bg-white/8 dark:bg-white/5
                border border-white/10
                text-white/80 text-sm
                animate-fade-in-up
              "
            >
              <span className="text-xl" aria-hidden="true">
                {icon}
              </span>
              {label}
            </li>
          ))}
        </ul>

        {}
        <button
          onClick={() => navigate("/quiz")}
          style={{ animationDelay: "280ms" }}
          className="
            w-full py-4 rounded-2xl
            bg-gradient-to-r from-violet-500 to-indigo-500
            hover:from-violet-400 hover:to-indigo-400
            active:scale-[0.98]
            text-white font-extrabold text-lg tracking-wide
            shadow-lg shadow-indigo-900/50
            transition-all duration-200
            animate-fade-in-up
            focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70
          "
        >
          Empezar Quiz 🚀
        </button>
      </div>
    </Layout>
  );
}
