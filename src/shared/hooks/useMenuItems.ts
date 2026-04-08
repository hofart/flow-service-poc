import { useTranslation } from 'i18next-vue';

export const useMenuItems = () => {
  const { t } = useTranslation();

  const menuItems = [
    {
      label: t('routes.serviceFlow.name'),
      icon: 'v-flow',
      link: t('routes.serviceFlow.children.list.path'),
      children: [
        {
          label: t('routes.serviceFlow.children.list.name'),
          icon: 'v-dot',
          link: t('routes.serviceFlow.children.list.path'),
        },
        {
          label: t('routes.serviceFlow.children.add.name'),
          icon: 'v-dot',
          link: t('routes.serviceFlow.children.add.path'),
        },
      ],
    },
  ];

  return { menuItems };
};
