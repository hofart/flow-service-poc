import { createServiceFlowRoutes } from 'modules/service-flow/router/routes';
import { createRouter, createWebHistory } from 'vue-router';

export const createAppRouter = () => {
  const routes = [
    {
      path: '/',
      name: 'root',
      redirect: '/service-flow/add',
    },
    createServiceFlowRoutes(),
  ];

  const router = createRouter({
    history: createWebHistory('/'),
    routes,
  });

  router.beforeEach((to, from, next) => {
    document.title = `${String(to.name)} | VSOFT`;
    next();
  });

  return router;
};
