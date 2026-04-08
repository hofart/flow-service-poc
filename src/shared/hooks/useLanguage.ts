import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import i18next from 'i18next';

export type LanguageTypes = string;

const languageMap: Record<string, string> = {
  PORTUGUESE: 'pt',
  ENGLISH: 'en',
  SPANISH: 'es',
  pt: 'pt',
  en: 'en',
  es: 'es',
};

export const useLanguage = defineStore('language', () => {
  const getInitialLanguage = () => {
    const storedLang = localStorage.getItem('language');
    return storedLang || 'PORTUGUESE';
  };

  const language = ref<LanguageTypes>(getInitialLanguage());

  const state = computed(() => ({
    language: language.value,
  }));

  const update = (key: 'language', value: LanguageTypes) => {
    if (key === 'language') {
      language.value = value;
    }
  };

  const updateLanguage = (lang: LanguageTypes) => {
    update('language', lang);

    const i18nLang = languageMap[lang] || 'pt';

    localStorage.setItem('language', lang);

    i18next.loadLanguages(i18nLang);

    i18next.changeLanguage(i18nLang);

    window.location.href = '/';
  };

  return {
    ...state.value,
    updateLanguage,
  };
});
