import App from './App.vue';
import { createApp } from 'vue';
import { initMsw } from 'core/msw';
import { createPinia } from 'pinia';
import DesignSystem, { install } from 'vsoft-design-system';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { createAppRouter } from 'router/routes';
import MainLayout from 'shared/layouts/MainLayout.vue';
import 'vsoft-design-system/style.css';

const bootstrap = async () => {
  await initMsw();

  const router = createAppRouter();

  const app = createApp(App)
    .use(createPinia())
    .use(router)
    .use(DesignSystem)
    .component('main-layout', MainLayout);

  install({ app, router: router as any });

  app.mount('#app');
};

bootstrap();
