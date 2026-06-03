import { useState } from "react";

interface FlagImageProps {
  src: string;
  alt: string;
}

/**
 * Imagen de bandera con lazy loading y estado de carga/error.
 * Muestra un skeleton mientras carga y un emoji 🏳 si falla.
 */
export function FlagImage({ src, alt }: FlagImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-40 rounded-xl bg-white/10 dark:bg-white/5 text-5xl">
        🏳️
      </div>
    );
  }

  return (
    <div className="relative w-full flex justify-center">
      {/* Skeleton mientras carga */}
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-56 h-36 rounded-xl bg-white/10 dark:bg-white/5 animate-pulse" />
        </div>
      )}

      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`
          max-h-44 max-w-full object-contain rounded-xl shadow-lg
          ring-2 ring-white/20 dark:ring-white/10
          transition-opacity duration-500
          ${loaded ? "opacity-100" : "opacity-0"}
        `}
      />
    </div>
  );
}
