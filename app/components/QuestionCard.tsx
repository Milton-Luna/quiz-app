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

/**
 * Tarjeta principal del quiz.
 * Muestra la bandera (preguntas de tipo flag) o el texto de la pregunta,
 * seguido de los 4 botones de respuesta.
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
      "
    >
      {/* ── Header de la tarjeta ── */}
      <div className="px-6 pt-6 pb-4 border-b border-white/10">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-2">
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
        <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">
          {question.question}
        </h2>
      </div>

      {/* ── Opciones de respuesta ── */}
      <div className="p-4 sm:p-6 space-y-3">
        {question.options.map((option) => (
          <AnswerButton
            key={option.id}
            id={option.id}
            text={option.text}
            isSelected={selectedAnswer === option.text}
            isCorrect={option.isCorrect}
            isAnswered={isAnswered}
            onClick={() => onAnswer(option.text)}
          />
        ))}
      </div>
    </div>
  );
}
