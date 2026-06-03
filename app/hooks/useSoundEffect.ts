import { useRef, useCallback } from "react";

/**
 * Genera efectos de sonido cortos usando la Web Audio API.
 * No requiere archivos de audio externos — sintetiza tonos en tiempo real.
 *
 * - `playSuccess`: arpegio ascendente (C5 → E5 → G5) — respuesta correcta.
 * - `playError`: tonos descendentes (Bb4 → F4) — respuesta incorrecta.
 *
 * Falla silenciosamente si el navegador no soporta Web Audio API.
 */
export function useSoundEffect() {
  const audioCtxRef = useRef<AudioContext | null>(null);

  /** Obtiene o crea el AudioContext (lazy init para cumplir política de autoplay) */
  const getAudioContext = useCallback((): AudioContext | null => {
    if (typeof window === "undefined") return null;

    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext();
      }
      // Reanudar contexto si fue suspendido por política del navegador
      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }
      return audioCtxRef.current;
    } catch {
      return null;
    }
  }, []);

  /**
   * Reproduce un tono puro.
   * @param frequency  Frecuencia en Hz
   * @param duration   Duración en segundos
   * @param startDelay Retraso desde `now` en segundos (para encadenar tonos)
   * @param type       Forma de onda del oscilador
   * @param volume     Volumen (0.0 – 1.0), por defecto 0.12 (sutil)
   */
  const playTone = useCallback(
    (
      frequency: number,
      duration: number,
      startDelay: number = 0,
      type: OscillatorType = "sine",
      volume: number = 0.12
    ) => {
      const ctx = getAudioContext();
      if (!ctx) return;

      try {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(
          frequency,
          ctx.currentTime + startDelay
        );

        // Fade in → fade out para evitar clicks
        gainNode.gain.setValueAtTime(0, ctx.currentTime + startDelay);
        gainNode.gain.linearRampToValueAtTime(
          volume,
          ctx.currentTime + startDelay + 0.02
        );
        gainNode.gain.exponentialRampToValueAtTime(
          0.001,
          ctx.currentTime + startDelay + duration
        );

        oscillator.start(ctx.currentTime + startDelay);
        oscillator.stop(ctx.currentTime + startDelay + duration);
      } catch {
        // Falla silenciosamente
      }
    },
    [getAudioContext]
  );

  /**
   * Arpegio ascendente: Do5 → Mi5 → Sol5
   * Indica respuesta correcta.
   */
  const playSuccess = useCallback(() => {
    playTone(523.25, 0.18, 0.0);   // C5
    playTone(659.25, 0.18, 0.12);  // E5
    playTone(783.99, 0.25, 0.24);  // G5
  }, [playTone]);

  /**
   * Tonos descendentes: Sib4 → Fa4
   * Indica respuesta incorrecta.
   */
  const playError = useCallback(() => {
    playTone(466.16, 0.22, 0.0, "sawtooth", 0.1);  // Bb4
    playTone(349.23, 0.35, 0.18, "sawtooth", 0.1); // F4
  }, [playTone]);

  /**
   * Tono de advertencia: Do4 corto
   * Se puede usar cuando el timer está por expirar.
   */
  const playTick = useCallback(() => {
    playTone(261.63, 0.08, 0, "square", 0.05); // C4 muy suave
  }, [playTone]);

  return { playSuccess, playError, playTick };
}
