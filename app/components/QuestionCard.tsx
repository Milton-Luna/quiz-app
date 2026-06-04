import type { QuizQuestion } from "~/types";
import { AnswerButton } from "./AnswerButton";
import { FlagImage } from "./FlagImage";

interface QuestionCardProps {
  question: QuizQuestion;
  questionNumber: number;
  selectedAnswer: string | null;
  isAnswered: boolean;
  onAnswer: (answer: string) => void;
}

/** Delay de entrada en ms para cada opción (efecto stagger) */
const STAGGER_DELAYS = [0, 80, 160, 240] as const;

/**
 * Tarjeta principal del quiz.
 * Usa `animate-fade-in-up` para animar la entrada — la página Quiz la monta
 * con una `key` distinta por pregunta, forzando re-mount y re-animación.
 */
export function QuestionCard({
  question,
  questionNumber,
  selectedAnswer,
  isAnswered,
  onAnswer,
}: QuestionCardProps) {
  return (
    <div
      className="
        w-full rounded-2xl overflow-hidden
        bg-white/10 dark:bg-white/5
        backdrop-blur-sm
        border border-white/20 dark:border-white/10
        shadow-2xl
        animate-fade-in-up
      "
    >
      {/* ── Header ── */}
      <div className="px-5 pt-5 pb-4 border-b border-white/10 sm:px-6 sm:pt-6">
        <p className="text-[11px] font-bold uppercase tracking-widest text-white/40 mb-3">
          Pregunta {questionNumber}
        </p>

        {/* Bandera (solo en preguntas tipo 'flag') */}
        {question.type === "flag" && question.flagUrl && (
          <div className="mb-4">
            <FlagImage
              src={question.flagUrl}
              alt={`Bandera de la pregunta ${questionNumber}`}
            />
          </div>
        )}

        {/* Texto de la pregunta */}
        <h2 className="text-lg sm:text-xl font-extrabold text-white leading-snug">
          {question.question}
        </h2>
      </div>

      {/* ── Opciones ── */}
      <div className="p-4 sm:p-5 space-y-2.5">
        {question.options.map((option, index) => (
          <AnswerButton
            key={option.id}
            id={option.id}
            text={option.text}
            isSelected={selectedAnswer === option.text}
            isCorrect={option.isCorrect}
            isAnswered={isAnswered}
            delay={STAGGER_DELAYS[index]}
            onClick={() => onAnswer(option.text)}
          />
        ))}
      </div>
    </div>
  );
}
