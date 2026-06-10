import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: ['tr', 'en', 'es', 'de'],
    fallbackLng: 'tr', 
    debug: import.meta.env.MODE === 'development',
    detection: {
      order: ['navigator', 'cookie', 'htmlTag', 'localStorage', 'path', 'subdomain'],
      caches: ['cookie'],
    },
    backend: {
      loadPath: 'locales/{{lng}}/translation.json'
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