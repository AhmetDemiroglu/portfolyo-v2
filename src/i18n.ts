import i18n from 'i18next';
import type { BackendModule, ReadCallback } from 'i18next';
import { initReactI18next } from 'react-i18next';
import tr from './locales/tr.json';

export const SUPPORTED_LANGUAGES = ['tr', 'en', 'de', 'es'] as const;
const STORAGE_KEY = 'i18nextLng';
const COOKIE_KEY = 'i18next';

/* Turkish ships inside the entry bundle, so the very first render never waits on
   a network round-trip. The other three are ordinary dynamic imports, which Vite
   emits as their own hashed chunks and only fetches when someone switches. */
const lazyLocales: Record<string, () => Promise<{ default: unknown }>> = {
  en: () => import('./locales/en.json'),
  de: () => import('./locales/de.json'),
  es: () => import('./locales/es.json'),
};

const lazyBackend: BackendModule = {
  type: 'backend',
  init: () => {},
  read: (language: string, _namespace: string, callback: ReadCallback) => {
    const load = lazyLocales[language];
    if (!load) {
      callback(null, {});
      return;
    }
    load()
      .then((mod) => callback(null, mod.default as never))
      .catch((error) => callback(error as Error, false));
  },
};

const isSupported = (value: string | null | undefined): value is string =>
  !!value && (SUPPORTED_LANGUAGES as readonly string[]).includes(value);

/* Detection is done by hand rather than with i18next-browser-languagedetector so
   that reading the preference and *applying* it can happen at different moments
   (see below), and so the inline script in index.html can use the same rules. */
function readStored(): string | undefined {
  try {
    const cookie = document.cookie.match(/(?:^|;\s*)i18next=([^;]*)/);
    const fromCookie = cookie && decodeURIComponent(cookie[1]);
    if (isSupported(fromCookie)) return fromCookie;
    const fromStorage = localStorage.getItem(STORAGE_KEY);
    if (isSupported(fromStorage)) return fromStorage;
  } catch {
    /* private mode or storage disabled: fall through to the browser locale */
  }
  return undefined;
}

function detect(): string {
  if (typeof document === 'undefined') return 'tr';
  const stored = readStored();
  if (stored) return stored;
  const fromNavigator = navigator.language?.split('-')[0];
  return isSupported(fromNavigator) ? fromNavigator : 'tr';
}

export const preferredLanguage = detect();

i18n
  .use(lazyBackend)
  .use(initReactI18next)
  .init({
    resources: { tr: { translation: tr } },
    // tr comes bundled; everything else still goes through the backend above.
    partialBundledLanguages: true,
    supportedLngs: [...SUPPORTED_LANGUAGES],
    lng: preferredLanguage,
    fallbackLng: 'tr',
    debug: import.meta.env.MODE === 'development',
    react: {
      // Turkish is bundled, so this never suspends for the common case. For the
      // other three it waits on one small same-origin chunk, which is cheaper
      // than showing Turkish first and swapping it out.
      useSuspense: true,
    },
  });

i18n.on('languageChanged', (lng) => {
  // Keep <html lang> in sync so CSS text-transform handles Turkish dotted and
  // dotless i correctly, and remember the choice for the next visit.
  document.documentElement.lang = lng;
  try {
    localStorage.setItem(STORAGE_KEY, lng);
  } catch {
    /* storage unavailable */
  }
  document.cookie = `${COOKIE_KEY}=${lng};path=/;max-age=31536000;samesite=lax`;
});

export default i18n;
