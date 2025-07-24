import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'ic:baseline-view-in-ar',
      keepAlive: true,
      order: 1000,
      title: $t('short_links.tools'),
    },
    name: 'Tools',
    path: '/tools',
    children: [
      {
        meta: {
          title: $t('short_links.originalLink'),
        },
        name: 'OriginalLink',
        path: '/tools/original-link',
        component: () => import('#/views/tools/original-link/index.vue'),
      },
      {
        meta: {
          title: $t('short_links.safeShortLink'),
        },
        name: 'SafeShortLink',
        path: '/tools/safe-shork-link',
        component: () => import('#/views/tools/safe-short-link/index.vue'),
      },
    ],
  },
];

export default routes;
