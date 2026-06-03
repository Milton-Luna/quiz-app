import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTimer, TIMER_DURATION } from "~/hooks";

// ─── useTimer ─────────────────────────────────────────────────────────────────

describe("useTimer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("estado inicial: arranca en TIMER_DURATION cuando isRunning es true", () => {
    const onTimeout = vi.fn();
    const { result } = renderHook(() =>
      useTimer("pregunta-1", true, onTimeout)
    );

    expect(result.current.timeLeft).toBe(TIMER_DURATION);
  });

  it("countdown: decrementa 1 segundo por tick", () => {
    const onTimeout = vi.fn();
    const { result } = renderHook(() =>
      useTimer("pregunta-1", true, onTimeout)
    );

    act(() => {
      vi.advanceTimersByTime(3000); // avanza 3 segundos
    });

    expect(result.current.timeLeft).toBe(TIMER_DURATION - 3);
  });

  it("timeout: llama a onTimeout exactamente una vez al llegar a 0", () => {
    const onTimeout = vi.fn();
    renderHook(() => useTimer("pregunta-1", true, onTimeout));

    act(() => {
      vi.advanceTimersByTime(TIMER_DURATION * 1000);
    });

    expect(onTimeout).toHaveBeenCalledTimes(1);
  });

  it("reset: reinicia el contador cuando cambia questionId", () => {
    const onTimeout = vi.fn();
    const { result, rerender } = renderHook(
      ({ qId }: { qId: string }) => useTimer(qId, true, onTimeout),
      { initialProps: { qId: "pregunta-1" } }
    );

    // Avanzar 6 segundos en la primera pregunta
    act(() => {
      vi.advanceTimersByTime(6000);
    });
    expect(result.current.timeLeft).toBe(TIMER_DURATION - 6);

    // Cambiar a una nueva pregunta → el timer debe resetear a TIMER_DURATION
    rerender({ qId: "pregunta-2" });

    expect(result.current.timeLeft).toBe(TIMER_DURATION);
  });
});
