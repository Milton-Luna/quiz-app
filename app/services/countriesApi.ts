import type { Country, CountryRaw } from "~/types";

// ─── Constantes ───────────────────────────────────────────────────────────────

const BASE_URL = "https://restcountries.com/v3.1";
/** Solo pedimos los campos que necesitamos para reducir el payload */
const FIELDS = "name,capital,flags";

/** Países mínimos necesarios para generar opciones de respuesta diversas */
const MIN_COUNTRIES = 10;

// ─── Caché en memoria ─────────────────────────────────────────────────────────

/**
 * Evita hacer múltiples fetches durante la misma sesión.
 * Se resetea al recargar la página (es solo en memoria).
 */
let countriesCache: Country[] | null = null;

// ─── Normalización ────────────────────────────────────────────────────────────

/**
 * Convierte el objeto raw de la API al formato interno `Country`.
 * Filtra países sin capital o sin bandera (algunos territorios).
 */
function normalizeCountry(raw: CountryRaw): Country | null {
  const capital = raw.capital?.[0];
  const flagSvg = raw.flags?.svg;
  const flagPng = raw.flags?.png;

  if (!capital || !flagSvg || !flagPng) return null;

  return {
    name: raw.name.common,
    capital,
    flagSvg,
    flagPng,
    flagAlt: raw.flags?.alt ?? `Bandera de ${raw.name.common}`,
  };
}

// ─── Fetching ─────────────────────────────────────────────────────────────────

/**
 * Obtiene todos los países de la REST Countries API.
 * Usa caché en memoria para no repetir el request en la misma sesión.
 *
 * @throws Error si el request falla o si no hay países suficientes
 */
export async function fetchCountries(): Promise<Country[]> {
  // Devolver caché si ya tenemos datos
  if (countriesCache !== null) {
    return countriesCache;
  }

  const response = await fetch(`${BASE_URL}/all?fields=${FIELDS}`);

  if (!response.ok) {
    throw new Error(
      `Error al obtener países: ${response.status} ${response.statusText}`
    );
  }

  const raw: CountryRaw[] = await response.json();

  const countries = raw
    .map(normalizeCountry)
    .filter((c): c is Country => c !== null);

  if (countries.length < MIN_COUNTRIES) {
    throw new Error(
      `Se obtuvieron muy pocos países (${countries.length}). Verifica tu conexión.`
    );
  }

  // Guardar en caché
  countriesCache = countries;
  return countries;
}

/**
 * Limpia la caché manualmente (útil para testing).
 */
export function clearCountriesCache(): void {
  countriesCache = null;
}
