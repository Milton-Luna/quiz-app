import type { AnswerId } from "~/types";

interface AnswerButtonProps {
  id: AnswerId;
  text: string;
  /** El usuario hizo clic en ESTE botón */
  isSelected: boolean;
  /** Esta opción ES la respuesta correcta */
  isCorrect: boolean;
  /** El quiz ya tiene una respuesta seleccionada (status = 'answered') */
  isAnswered: boolean;
  onClick: () => void;
  /** Retraso de animación en ms para efecto stagger (0, 80, 160, 240) */
  delay?: number;
}

// ─── Helpers de estilo ────────────────────────────────────────────────────────

const LETTER_COLORS: Record<AnswerId, string> = {
  A: "bg-violet-500  dark:bg-violet-600",
  B: "bg-indigo-500  dark:bg-indigo-600",
  C: "bg-purple-500  dark:bg-purple-600",
  D: "bg-fuchsia-500 dark:bg-fuchsia-600",
};

function getButtonStyle(
  isAnswered: boolean,
  isSelected: boolean,
  isCorrect: boolean
): string {
  if (!isAnswered) {
    return `
      bg-white/10 dark:bg-white/5
      border-white/25 dark:border-white/15
      hover:bg-white/20 dark:hover:bg-white/15
      hover:border-white/50 dark:hover:border-white/30
      hover:scale-[1.015] active:scale-[0.985]
      text-white cursor-pointer
    `;
  }
  if (isSelected && isCorrect) {
    return `
      bg-emerald-500/90 dark:bg-emerald-600/90
      border-emerald-400 dark:border-emerald-500
      text-white scale-[1.01]
    `;
  }
  if (isSelected && !isCorrect) {
    return `
      bg-red-500/90 dark:bg-red-600/90
      border-red-400 dark:border-red-500
      text-white scale-[1.01]
    `;
  }
  if (!isSelected && isCorrect) {
    return `
      bg-emerald-500/20 dark:bg-emerald-600/20
      border-emerald-400 dark:border-emerald-500
      text-emerald-200 dark:text-emerald-300
    `;
  }
  return `
    bg-white/5 dark:bg-white/5
    border-white/10 dark:border-white/10
    text-white/40 dark:text-white/30
    opacity-50
  `;
}

function getIcon(
  isAnswered: boolean,
  isSelected: boolean,
  isCorrect: boolean
): string {
  if (!isAnswered) return "";
  if (isSelected && isCorrect) return "✓";
  if (isSelected && !isCorrect) return "✗";
  if (!isSelected && isCorrect) return "✓";
  return "";
}

// ─── Componente ───────────────────────────────────────────────────────────────

/**
 * Botón de respuesta con 5 estados visuales y animación de entrada stagger.
 * idle | selected-correct | selected-wrong | reveal-correct | disabled
 */
export function AnswerButton({
  id,
  text,
  isSelected,
  isCorrect,
  isAnswered,
  onClick,
  delay = 0,
}: AnswerButtonProps) {
  const buttonStyle = getButtonStyle(isAnswered, isSelected, isCorrect);
  const icon = getIcon(isAnswered, isSelected, isCorrect);

  return (
    <button
      onClick={onClick}
      disabled={isAnswered}
      aria-pressed={isSelected}
      aria-label={`Opción ${id}: ${text}${isAnswered && isCorrect ? " (respuesta correcta)" : ""}`}
      style={{ animationDelay: `${delay}ms` }}
      className={`
        w-full flex items-center gap-3 px-4 py-3.5
        rounded-xl border-2 font-semibold text-left
        transition-all duration-200
        animate-fade-in-up
        focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70
        disabled:cursor-not-allowed
        ${buttonStyle}
      `}
    >
      {/* Badge de letra (A/B/C/D) */}
      <span
        className={`
          flex-shrink-0 w-8 h-8 rounded-lg
          flex items-center justify-center
          text-white text-sm font-bold
          transition-all duration-200
          ${isAnswered ? "bg-white/20" : LETTER_COLORS[id]}
        `}
        aria-hidden="true"
      >
        {id}
      </span>

      {/* Texto de la opción */}
      <span className="flex-1 text-sm sm:text-base leading-snug">{text}</span>

      {/* Ícono de resultado con animación scale-in */}
      {icon && (
        <span
          className="flex-shrink-0 text-lg font-bold animate-scale-in"
          aria-hidden="true"
        >
          {icon}
        </span>
      )}
    </button>
  );
}
