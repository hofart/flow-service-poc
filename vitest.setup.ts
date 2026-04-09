import '@testing-library/jest-dom';
import { config } from '@vue/test-utils';
import { afterAll, beforeAll, vi } from 'vitest';
import DesignSystem from 'vsoft-design-system';
import MainLayout from './src/shared/layouts/MainLayout.vue';

const globalConfigBackup = config.global;

beforeAll(() => {
  config.global.plugins.unshift([DesignSystem]);
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
