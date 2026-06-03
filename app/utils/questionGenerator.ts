import type {
  AnswerId,
  AnswerOption,
  Country,
  QuizQuestion,
  QuestionType,
} from "~/types";

// ─── Constantes ───────────────────────────────────────────────────────────────

const ANSWER_IDS: AnswerId[] = ["A", "B", "C", "D"];
const OPTIONS_COUNT = 4;

// ─── Utilidades de aleatoriedad ───────────────────────────────────────────────

/**
 * Mezcla un array in-place usando el algoritmo Fisher-Yates.
 * Devuelve un nuevo array (no muta el original).
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Elige un elemento aleatorio de un array.
 */
function pickRandom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Devuelve `count` elementos aleatorios del array excluyendo `exclude`.
 */
function pickRandomExcluding<T>(
  array: T[],
  count: number,
  exclude: T
): T[] {
  const pool = array.filter((item) => item !== exclude);
  return shuffleArray(pool).slice(0, count);
}

// ─── Construcción de opciones ─────────────────────────────────────────────────

/**
 * Construye el array de 4 AnswerOption con las letras A/B/C/D.
 * La opción correcta va mezclada entre las incorrectas.
 */
function buildOptions(
  correct: Country,
  wrongCountries: Country[],
  getLabel: (c: Country) => string
): AnswerOption[] {
  const all = shuffleArray([correct, ...wrongCountries]);

  return all.map((country, index) => ({
    id: ANSWER_IDS[index],
    text: getLabel(country),
    isCorrect: country === correct,
  }));
}

// ─── Generadores por tipo ─────────────────────────────────────────────────────

/**
 * Genera una pregunta de bandera:
 * Muestra la bandera → el usuario elige el nombre del país.
 */
function generateFlagQuestion(
  countries: Country[],
  correctCountry: Country
): QuizQuestion {
  const wrongCountries = pickRandomExcluding(
    countries,
    OPTIONS_COUNT - 1,
    correctCountry
  );

  return {
    id: crypto.randomUUID(),
    type: "flag",
    question: "¿A qué país pertenece esta bandera?",
    flagUrl: correctCountry.flagSvg || correctCountry.flagPng,
    options: buildOptions(correctCountry, wrongCountries, (c) => c.name),
    correctAnswer: correctCountry.name,
  };
}

/**
 * Genera una pregunta de capital:
 * Muestra el nombre de la capital → el usuario elige el país.
 */
function generateCapitalQuestion(
  countries: Country[],
  correctCountry: Country
): QuizQuestion {
  const wrongCountries = pickRandomExcluding(
    countries,
    OPTIONS_COUNT - 1,
    correctCountry
  );

  return {
    id: crypto.randomUUID(),
    type: "capital",
    question: `${correctCountry.capital} es la capital de...`,
    options: buildOptions(correctCountry, wrongCountries, (c) => c.name),
    correctAnswer: correctCountry.name,
  };
}

// ─── Exportación principal ────────────────────────────────────────────────────

/**
 * Genera `count` preguntas alternando de forma aleatoria entre
 * preguntas de bandera y de capital.
 *
 * Se asegura de no repetir el mismo país correcto consecutivamente.
 */
export function generateQuestions(
  countries: Country[],
  count: number = 10
): QuizQuestion[] {
  if (countries.length < OPTIONS_COUNT) {
    throw new Error(
      `Se necesitan al menos ${OPTIONS_COUNT} países para generar preguntas.`
    );
  }

  const types: QuestionType[] = ["flag", "capital"];
  const questions: QuizQuestion[] = [];
  let lastCountry: Country | null = null;

  for (let i = 0; i < count; i++) {
    // Elegir tipo de forma aleatoria
    const type = pickRandom(types);

    // Elegir el país correcto (diferente al anterior para no repetir)
    let correctCountry: Country;
    do {
      correctCountry = pickRandom(countries);
    } while (correctCountry === lastCountry);

    lastCountry = correctCountry;

    const question =
      type === "flag"
        ? generateFlagQuestion(countries, correctCountry)
        : generateCapitalQuestion(countries, correctCountry);

    questions.push(question);
  }

  return questions;
}

/**
 * Genera UNA pregunta adicional del tipo que se necesite.
 * Útil para extender el quiz on-demand.
 */
export function generateOneQuestion(
  countries: Country[],
  excludeCountry?: Country
): QuizQuestion {
  const types: QuestionType[] = ["flag", "capital"];
  const type = pickRandom(types);

  let correctCountry: Country;
  do {
    correctCountry = pickRandom(countries);
  } while (excludeCountry && correctCountry === excludeCountry);

  return type === "flag"
    ? generateFlagQuestion(countries, correctCountry)
    : generateCapitalQuestion(countries, correctCountry);
}
