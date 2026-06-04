import { useDarkMode } from "~/hooks";


export function DarkModeToggle() {
  const { isDark, toggleDarkMode } = useDarkMode();

  return (
    <button
      onClick={toggleDarkMode}
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      title={isDark ? "Modo claro" : "Modo oscuro"}
      className="
        relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none
        focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2
        focus-visible:ring-offset-indigo-900
        bg-indigo-300 dark:bg-indigo-600
      "
    >
      {}
      <span className="sr-only">{isDark ? "Modo claro" : "Modo oscuro"}</span>

      {}
      <span
        className="
          absolute top-0.5 left-0.5 w-5 h-5 rounded-full
          flex items-center justify-center text-xs
          transition-transform duration-300 shadow-sm
          bg-white dark:translate-x-6
        "
        aria-hidden="true"
      >
        {isDark ? "☀️" : "🌙"}
      </span>
    </button>
  );
}
