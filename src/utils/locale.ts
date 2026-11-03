export type SiteLanguage = 'en' | 'sw';

/** Countries where Kiswahili is a primary / widely used language */
const SWAHILI_COUNTRY_CODES = new Set([
  'TZ', // Tanzania
  'KE', // Kenya
  'UG', // Uganda
  'RW', // Rwanda
  'BI', // Burundi
  'CD', // DR Congo (eastern)
]);

const SWAHILI_TIMEZONES = new Set([
  'Africa/Dar_es_Salaam',
  'Africa/Nairobi',
  'Africa/Kampala',
  'Africa/Kigali',
  'Africa/Bujumbura',
  'Africa/Lubumbashi',
  'Africa/Kinshasa',
]);

/**
 * Infer preferred site language from the reader's country signals
 * (timezone + browser locale). No API key required.
 */
export function detectLanguageFromCountry(): SiteLanguage {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (SWAHILI_TIMEZONES.has(tz)) return 'sw';

    const locale = String(navigator.language || navigator.languages?.[0] || '').toLowerCase();
    if (locale.startsWith('sw')) return 'sw';

    const regionMatch = locale.match(/[-_]([a-z]{2})$/i);
    const region = regionMatch?.[1]?.toUpperCase();
    if (region && SWAHILI_COUNTRY_CODES.has(region)) return 'sw';
  } catch {
    // fall through
  }
  return 'en';
}

/** Optional IP country lookup — used only when timezone/locale are ambiguous. */
export async function detectLanguageFromIp(): Promise<SiteLanguage | null> {
  try {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 2500);
    const res = await fetch('https://ipwho.is/?fields=success,country_code', {
      signal: controller.signal,
    });
    window.clearTimeout(timer);
    if (!res.ok) return null;
    const data = (await res.json()) as { success?: boolean; country_code?: string };
    if (!data?.success || !data.country_code) return null;
    return SWAHILI_COUNTRY_CODES.has(data.country_code.toUpperCase()) ? 'sw' : 'en';
  } catch {
    return null;
  }
}
