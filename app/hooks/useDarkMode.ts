import { useState, useCallback, useEffect } from "react";

const THEME_KEY = "quiz-theme";

/**
 * Controla el modo oscuro/claro usando la clase `dark` en `<html>`.
 * Se sincroniza con localStorage para persistir entre sesiones.
 *
 * El script anti-FOUC en root.tsx aplica la clase ANTES del primer render,
 * por lo que este hook solo necesita leer el estado actual del DOM.
 */
export function useDarkMode() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    // Guard SSR
    if (typeof document === "undefined") return false;
    return document.documentElement.classList.contains("dark");
  });

  // Sincronizar el estado React si el DOM ya tiene la clase (por el script anti-FOUC)
  useEffect(() => {
    const hasDarkClass = document.documentElement.classList.contains("dark");
    setIsDark(hasDarkClass);
  }, []);

  const toggleDarkMode = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;

      if (next) {
        document.documentElement.classList.add("dark");
        localStorage.setItem(THEME_KEY, "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem(THEME_KEY, "light");
      }

      return next;
    });
  }, []);

  /**
   * Fuerza un modo específico sin toggle.
   */
  const setDarkMode = useCallback((dark: boolean) => {
    setIsDark(dark);
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem(THEME_KEY, "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem(THEME_KEY, "light");
    }
  }, []);

  return { isDark, toggleDarkMode, setDarkMode };
}
