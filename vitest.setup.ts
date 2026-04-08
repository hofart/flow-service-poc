import '@testing-library/jest-dom';
import { config } from '@vue/test-utils';
import i18next from 'i18next';
import i18nextVue from 'i18next-vue';
import { afterAll, beforeAll, vi } from 'vitest';
import DesignSystem from 'vsoft-design-system';
import MainLayout from './src/shared/layouts/MainLayout.vue';

const globalConfigBackup = config.global;

beforeAll(() => {
  config.global.plugins.unshift([DesignSystem, {}, [i18nextVue, { i18next }]]);
  config.global.components = {
    'main-layout': MainLayout,
  };

  globalThis.IntersectionObserver = class IntersectionObserver {
    readonly root: Element | null = null;
    readonly rootMargin: string = '';
    readonly thresholds: ReadonlyArray<number> = [];

    constructor() {}
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  } as any;
});

afterAll(() => {
  config.global = globalConfigBackup;
});

vi.mock('i18next-vue', () => ({
  default: {
    install: () => {},
  },
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('shared/contexts/LanguageContext', () => ({
  useLanguage: () => ({
    t: (key: string) => key,
    currentLanguage: 'PORTUGUESE',
  }),
}));
