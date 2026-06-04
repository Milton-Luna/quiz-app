import type { Country, CountryRaw } from "~/types";

const BASE_URL = "https://restcountries.com/v3.1";

const FIELDS = "name,capital,flags";

const MIN_COUNTRIES = 10;


let countriesCache: Country[] | null = null;


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



export async function fetchCountries(): Promise<Country[]> {
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

  countriesCache = countries;
  return countries;
}


export function clearCountriesCache(): void {
  countriesCache = null;
}
