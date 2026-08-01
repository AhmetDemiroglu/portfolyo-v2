import i18n from 'i18next';
import type { BackendModule, ReadCallback } from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import tr from './locales/tr.json';

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

i18n
  .use(lazyBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { tr: { translation: tr } },
    // tr comes bundled; everything else still goes through the backend above.
    partialBundledLanguages: true,
    supportedLngs: ['tr', 'en', 'es', 'de'],
    fallbackLng: 'tr',
    debug: import.meta.env.MODE === 'development',
    detection: {
      // A saved choice has to win over the browser locale, otherwise the
      // language switcher resets itself on every reload.
      order: ['cookie', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['cookie', 'localStorage'],
    },
    react: {
      useSuspense: true,
    },
  });

// Keep <html lang> in sync so CSS text-transform handles Turkish dotted/dotless i correctly.
i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
});
if (i18n.resolvedLanguage) {
  document.documentElement.lang = i18n.resolvedLanguage;
}

export default i18n;
