import { createServiceFlowRoutes } from 'modules/service-flow/router/routes';
import { createRouter, createWebHistory } from 'vue-router';

export const createAppRouter = () => {
  const routes = [
    {
      path: '/',
      name: 'root',
      redirect: '/service-flow/list',
    },
    createServiceFlowRoutes(),
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: { template: '<div>404 - Not Found</div>' },
      meta: {
        requiresAuth: false,
      },
    },
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
