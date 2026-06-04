import type {
  AnswerId,
  AnswerOption,
  Country,
  QuizQuestion,
  QuestionType,
} from "~/types";


const ANSWER_IDS: AnswerId[] = ["A", "B", "C", "D"];
const OPTIONS_COUNT = 4;


export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}


function pickRandom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}


function pickRandomExcluding<T>(
  array: T[],
  count: number,
  exclude: T
): T[] {
  const pool = array.filter((item) => item !== exclude);
  return shuffleArray(pool).slice(0, count);
}


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
   
    const type = pickRandom(types);

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
