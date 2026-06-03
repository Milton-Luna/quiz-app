import type { ReactNode } from "react";
import { DarkModeToggle } from "./DarkModeToggle";

interface LayoutProps {
  children: ReactNode;
}

/**
 * Layout principal de la aplicación.
 *
 * - Fondo degradado responsivo (oscuro/claro según tema)
 * - Header con título y toggle de tema
 * - Contenido centrado con ancho máximo
 */
export function Layout({ children }: LayoutProps) {
  return (
    <div
      className="
        min-h-screen w-full
        bg-gradient-to-br from-indigo-950 via-purple-900 to-violet-900
        dark:from-gray-950 dark:via-indigo-950 dark:to-gray-900
        transition-colors duration-300
      "
    >
      {/* ── Header ── */}
      <header className="w-full px-4 py-4 sm:py-5">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          {/* Logo / Título */}
          <div className="flex items-center gap-2">
            <span className="text-2xl select-none" aria-hidden="true">
              🌍
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Country Quiz
            </h1>
          </div>

          {/* Toggle de tema */}
          <DarkModeToggle />
        </div>
      </header>

      {/* ── Contenido principal ── */}
      <main className="w-full px-4 pb-8">
        <div className="max-w-lg mx-auto">{children}</div>
      </main>
    </div>
  );
}
