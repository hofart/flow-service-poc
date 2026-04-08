import i18next from 'i18next';
import HttpBackend from 'i18next-http-backend';

const eLanguages: Record<string, string> = {
  pt: 'pt',
  en: 'en',
  es: 'es',
  PORTUGUESE: 'pt',
  ENGLISH: 'en',
  SPANISH: 'es',
};

const storageLang = localStorage.getItem('language');

const browserLang = navigator.language.split('-')[0];

const lng = storageLang
  ? eLanguages[storageLang] || 'pt'
  : eLanguages[browserLang] || 'pt';

const { VITE_APP_TOLGEE_TRANSLATIONS_STORAGE, MODE } = import.meta.env;

const isDev = MODE === 'development';

const config = {
  lng,
  fallbackLng: 'pt',
  supportedLngs: ['pt', 'en', 'es'],
  backend: {
    loadPath: isDev
      ? '/locales/{{lng}}.json'
      : `${VITE_APP_TOLGEE_TRANSLATIONS_STORAGE || '/locales'}/{{lng}}.json`,
    requestOptions: {
      headers: {
        Accept: 'application/json',
      },
    },
  },
  interpolation: {
    escapeValue: false,
  },
  initImmediate: true,
};

i18next.use(HttpBackend).init(config);

export { i18next };
