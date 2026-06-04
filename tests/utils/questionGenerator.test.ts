import { describe, it, expect } from "vitest";
import { shuffleArray, generateQuestions } from "~/utils";
import type { Country } from "~/types";

// Datos de prueba 

const MOCK_COUNTRIES: Country[] = Array.from({ length: 10 }, (_, i) => ({
  name: `Country${i}`,
  capital: `Capital${i}`,
  flagSvg: `https://example.com/flag${i}.svg`,
  flagPng: `https://example.com/flag${i}.png`,
  flagAlt: `Flag of Country${i}`,
}));

// shuffleArray 

describe("shuffleArray", () => {
  it("no muta el array original", () => {
    const original = [1, 2, 3, 4, 5];
    const originalCopy = [...original];
    shuffleArray(original);
    expect(original).toEqual(originalCopy);
  });

  it("devuelve un array con los mismos elementos", () => {
    const original = ["a", "b", "c", "d"];
    const shuffled = shuffleArray(original);

    expect(shuffled).toHaveLength(original.length);
    expect(shuffled.sort()).toEqual([...original].sort());
  });
});

// generateQuestions 

describe("generateQuestions", () => {
  it("genera exactamente una opción correcta por pregunta", () => {
    const questions = generateQuestions(MOCK_COUNTRIES, 5);

    questions.forEach((q) => {
      const correctCount = q.options.filter((o) => o.isCorrect).length;
      expect(correctCount).toBe(1);
    });
  });

  it("las preguntas de bandera incluyen un flagUrl válido", () => {
    // Generamos muchas preguntas para asegurar que aparezca tipo 'flag'
    const questions = generateQuestions(MOCK_COUNTRIES, 30);
    const flagQuestions = questions.filter((q) => q.type === "flag");

    expect(flagQuestions.length).toBeGreaterThan(0);
    flagQuestions.forEach((q) => {
      expect(q.flagUrl).toBeTruthy();
      expect(q.flagUrl).toMatch(/https?:\/\/.+/);
    });
  });
});
