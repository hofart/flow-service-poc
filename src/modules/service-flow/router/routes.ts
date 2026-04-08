import { i18next } from 'core/i18n';
import { RouteRecordRaw } from 'vue-router';

const RouterView = () => import('modules/service-flow/views/RouterView.vue');

const ServiceFlowListView = () =>
  import('modules/service-flow/views/ServiceFlowListView.vue');

const ServiceFlowAddView = () =>
  import('modules/service-flow/views/ServiceFlowAddView.vue');

export const createServiceFlowRoutes = (): RouteRecordRaw => ({
  path: i18next.t('routes.serviceFlow.path', '/service-flow'),
  name: i18next.t('routes.serviceFlow.name', 'serviceflow'),
  component: RouterView,
  children: [
    {
      path: '',
      name: 'Redirect list',
      redirect: i18next.t(
        'routes.serviceFlow..children.list.path',
        '/service-flow./list'
      ),
    },
    {
      path: i18next.t(
        'routes.serviceFlow.children.list.path',
        '/service-flow/list'
      ),
      name: i18next.t(
        'routes.serviceFlow.children.list.name',
        'Service Flow List'
      ),
      meta: {
        key: i18next.t('routes.serviceFlow.children.list.key'),
        showSearch: true,
        initCollapsedMenu: false,
        requiresAuth: true,
      },
      component: ServiceFlowListView,
    },
    {
      path: i18next.t(
        'routes.serviceFlow.children.add.path',
        '/service-flow/add'
      ),
      name: i18next.t(
        'routes.serviceFlow.children.add.name',
        'Create Service Flow'
      ),
      meta: {
        key: i18next.t('routes.serviceFlow.children.add.key'),
        showSearch: false,
        initCollapsedMenu: true,
        requiresAuth: true,
      },
      component: ServiceFlowAddView,
    },
    {
      path: i18next.t(
        'routes.serviceFlow.children.edit.path',
        '/service-flow/:flowId/edit'
      ),
      meta: {
        key: i18next.t('routes.serviceFlow.children.edit.key'),
        showSearch: false,
        initCollapsedMenu: true,
        requiresAuth: true,
      },
      name: i18next.t(
        'routes.serviceFlow.children.edit.name',
        'Update Service Flow'
      ),
      component: ServiceFlowAddView,
    },
  ],
});
