import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useHighScore } from "~/hooks";

// ─── useHighScore ─────────────────────────────────────────────────────────────

describe("useHighScore", () => {
  // Limpiamos localStorage antes de cada test para aislamiento total
  beforeEach(() => {
    localStorage.clear();
  });

  it("estado de carga: comienza en 0 cuando localStorage está vacío", () => {
    const { result } = renderHook(() => useHighScore());
    expect(result.current.highScore).toBe(0);
  });

  it("interactividad: actualiza el récord cuando el nuevo puntaje es mayor", () => {
    const { result } = renderHook(() => useHighScore());

    act(() => {
      result.current.updateHighScore(12);
    });

    expect(result.current.highScore).toBe(12);
    // Verifica que también persiste en localStorage
    expect(localStorage.getItem("quiz-highscore")).toBe("12");
  });

  it("error/límite: no sobreescribe si el nuevo puntaje es menor al récord actual", () => {
    const { result } = renderHook(() => useHighScore());

    act(() => {
      result.current.updateHighScore(20);
    });
    act(() => {
      result.current.updateHighScore(5); // Puntaje más bajo → no debe cambiar
    });

    expect(result.current.highScore).toBe(20);
    expect(localStorage.getItem("quiz-highscore")).toBe("20");
  });
});
