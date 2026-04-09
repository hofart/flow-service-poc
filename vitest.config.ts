import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      locales: path.resolve(__dirname, './src/locales'),
      core: path.resolve(__dirname, './src/core'),
      shared: path.resolve(__dirname, './src/shared'),
      modules: path.resolve(__dirname, './src/modules'),
      router: path.resolve(__dirname, './src/router'),
      __mocks__: path.resolve(__dirname, './src/__mocks__'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    include: ['src/**/*.spec.ts'],
    exclude: [
      'node_modules',
      'dist',
      'coverage',
      'package',
      '**/*.js',
      'src/**/index.ts',
      'src/**/*.spec.backup.ts',
      'src/**/__mocks__/**',
      'src/**/models/**',
      'src/**/contexts/**',
      'src/core/**',
      'src/**/RouterView.vue',
    ],
    coverage: {
      include: ['src/**/*.{js,ts,vue}'],
      exclude: [
        'src/**/*.d.ts',
        'src/**/assets/**',
        'src/**/index.ts',
        'node_modules/**',
        'test-config/**',
        'src/**/index.ts',
        '**/routes.ts',
        'lib/**',
        'src/main.ts',
        'src/**/__mocks__/**',
        'src/**/models/**',
        'src/**/contexts/**',
        'src/core/**',
        'src/**/RouterView.vue',
        'src/**/testUtils.ts',
      ],
      reporter: ['text', 'lcov'],
      all: true,
    },
    testTransformMode: {
      web: ['/\.[jt]sx$/'],
    },
  },
});
