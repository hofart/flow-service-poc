import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import federation from '@originjs/vite-plugin-federation';
import path from 'path';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { sentryVitePlugin } from '@sentry/vite-plugin';

export default defineConfig(() => ({
  base: 'http://localhost:4173/',
  plugins: [
    vue(),
    tsconfigPaths({ projects: ['tsconfig.json'] }),
    vueJsx(),
    federation({
      name: 'flow_service_remote',
      filename: 'remoteEntry.js',
      exposes: {
        './ServiceFlowModule':
          './src/modules/service-flow/views/ServiceFlowAddView.vue',
      },
      shared: {
        vue: { singleton: true, requiredVersion: '^3.5.13' },
        'vue-router': { singleton: true, requiredVersion: '^4.0.3' },
        pinia: { singleton: true, requiredVersion: '^3.0.4' },
      },
    }),
  ],
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
      core: path.resolve(__dirname, './src/core'),
      shared: path.resolve(__dirname, './src/shared'),
      modules: path.resolve(__dirname, './src/modules'),
      __mocks__: path.resolve(__dirname, './src/__mocks__'),
    },
  },
  server: {
    allowedHosts: true,
  },
  preview: {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  build: {
    target: 'esnext',
    commonjsOptions: { transformMixedEsModules: true },
    sourcemap: true,
  },
}));
