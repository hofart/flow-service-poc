import { RouteRecordRaw } from 'vue-router';

const RouterView = () => import('modules/service-flow/views/RouterView.vue');

const ServiceFlowAddView = () =>
  import('modules/service-flow/views/ServiceFlowAddView.vue');

export const createServiceFlowRoutes = (): RouteRecordRaw => ({
  path: '/service-flow',
  name: 'serviceflow',
  component: RouterView,
  children: [
    {
      path: '/service-flow/add',
      name: 'Create Service Flow',
      meta: {
        key: 'serviceflowadd',
        showSearch: false,
        initCollapsedMenu: true,
        requiresAuth: true,
      },
      component: ServiceFlowAddView,
    },
    {
      path: '/service-flow/:flowId/edit',
      meta: {
        key: 'serviceflowedit',
        showSearch: false,
        initCollapsedMenu: true,
        requiresAuth: true,
      },
      name: 'Update Service Flow',
      component: ServiceFlowAddView,
    },
  ],
});
