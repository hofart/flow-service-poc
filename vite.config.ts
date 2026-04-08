import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import path from 'path';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { sentryVitePlugin } from '@sentry/vite-plugin';

export default defineConfig(({ mode }) => ({
  plugins: [
    vue(),
    tsconfigPaths(),
    vueJsx(),
    mode === 'production' &&
      process.env.VITE_SENTRY_DSN &&
      sentryVitePlugin({
        org: process.env.SENTRY_ORG,
        project: process.env.SENTRY_PROJECT,
        authToken: process.env.SENTRY_AUTH_TOKEN,
        sourcemaps: {
          assets: './dist/**',
          ignore: ['node_modules'],
          filesToDeleteAfterUpload: './dist/**/*.map',
        },
      }),
  ].filter(Boolean),
  optimizeDeps: {
    exclude: ['fsevents'],
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
        @use "shared/assets/styles/scss/index.scss" as *;
        @use "vsoft-design-system/resources/scss/main.scss" as *;
        `,
      },
    },
  },
  resolve: {
    alias: {
      router: path.resolve(__dirname, './src/router'),
locales: path.resolve(__dirname, './public/locales'),
      core: path.resolve(__dirname, './src/core'),
      shared: path.resolve(__dirname, './src/shared'),
      modules: path.resolve(__dirname, './src/modules'),
      __mocks__: path.resolve(__dirname, './src/__mocks__'),
    },
  },
  server: {
    allowedHosts: true,
  },
  build: {
    commonjsOptions: { transformMixedEsModules: true },
    sourcemap: true,
  },
}));
