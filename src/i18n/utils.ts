import { DEFAULT_LANG, type Lang } from "./translations";

export { t, TRANSLATIONS, LANGS, DEFAULT_LANG } from "./translations";
export type { Lang };

/** Extract language from URL pathname: /es/... -> 'es', anything else -> 'en' */
export function getLangFromUrl(url: URL): Lang {
  const segment = url.pathname.split("/").filter(Boolean)[0];
  if (segment === "es") return "es";
  return DEFAULT_LANG;
}

/** Returns the other language */
export function alternateLang(lang: Lang): Lang {
  return lang === "en" ? "es" : "en";
}

/** Build URL path for a given lang, preserving the rest of the path */
export function pathForLang(url: URL, lang: Lang): string {
  const segments = url.pathname.split("/").filter(Boolean);
  // Strip existing locale prefix if present
  if (segments[0] === "es") segments.shift();
  const base = segments.join("/");
  if (lang === "en") {
    return base ? `/${base}` : "/";
  }
  return base ? `/es/${base}` : "/es/";
}

/** Canonical URL for a given lang, used in <link rel="alternate"> */
export function canonicalFor(url: URL, lang: Lang, siteUrl: string): string {
  return new URL(pathForLang(url, lang), siteUrl).toString();
}
