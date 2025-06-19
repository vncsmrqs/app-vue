import {
  createMemoryHistory,
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from 'vue-router';

import { h, markRaw, resolveComponent } from 'vue';
import { isGuestMiddleware } from '@/router/middlwares/is-guest.middleware.ts';
import { loadSessionMiddleware } from '@/router/middlwares/load-session.middleware.ts';
import { middlewarePipeline } from '@/router/middleware-pipeline.ts';
import { syncNavigatorToVirtualRouter } from '@/router/sync-navigator-to-virtual-router.ts';
import { logRouterNavigation } from '@/router/log-router-navigation.ts';
import { logRouterErrors } from '@/router/log-router-errors.ts';
import {
  LOG_NAVIGATOR_ROUTER_NAVIGATION_EVENTS,
  LOG_VIRTUAL_ROUTER_NAVIGATION_EVENTS,
} from '@/config/app-config.ts';
import { PUSH_HISTORY_STATE } from '@/config/stack-view-config.ts';
import { isAuthenticatedMiddleware } from '@/router/middlwares/is-authenticated.middleware.ts';

const history = PUSH_HISTORY_STATE
  ? createWebHistory(import.meta.env.BASE_URL)
  : createMemoryHistory(import.meta.env.BASE_URL);

const routes: Readonly<RouteRecordRaw[]> = [
  {
    path: '/',
    component: {
      render() {
        return h(resolveComponent('router-view'));
      },
    },
    meta: {
      middlewares: [loadSessionMiddleware],
    },
    children: [
      {
        path: '/',
        name: 'index',
        component: () => import('../views/InitialView.vue'),
      },
      {
        path: '/app',
        name: 'app-layout',
        component: () => import('../views/app-layout/AppLayout.vue'),
        meta: {
          middlewares: [],
        },
        children: [
          {
            path: '',
            name: 'app',
            redirect: {
              name: 'home',
            },
          },
          {
            path: 'home',
            name: 'home',
            component: () => import('../views/app-layout/HomeView.vue'),
            props: true,
            meta: {
              type: 'ROOT',
            },
          },
          {
            path: 'search',
            name: 'search',
            component: () => import('../views/app-layout/SearchView.vue'),
            props: true,
            meta: {
              type: 'ROOT',
            },
          },
          {
            path: 'orders',
            name: 'orders',
            component: () => import('../views/app-layout/OrderListView.vue'),
            props: true,
            meta: {
              type: 'ROOT',
            },
          },
          {
            path: 'merchant/:merchantId',
            name: 'merchant',
            component: () => import('@/views/app-layout/MerchantView.vue'),
            props: true,
            meta: {
              type: 'ROOT',
            },
            children: [
              {
                path: 'products/:productId',
                name: 'merchant.product',
                component: () =>
                  import('@/views/app-layout/stack-views/merchant/DetailProductView.vue'),
                meta: {
                  type: 'STACK',
                },
                props: true,
              },
            ],
          },
          {
            path: 'address-list',
            name: 'address-list',
            component: () => import('../views/app-layout/stack-views/AddressListView.vue'),
            meta: {
              type: 'STACK',
            },
            props: true,
            children: [
              {
                path: 'add',
                name: 'address-list.add',
                component: () => import('../views/app-layout/stack-views/AddressListView.vue'),
                meta: {
                  type: 'STACK',
                },
              },
            ],
          },
          {
            path: '',
            name: 'app.authenticated',
            meta: {
              middlewares: [isAuthenticatedMiddleware],
            },
            children: [
              {
                path: 'chats',
                name: 'chat-list',
                component: () => import('../views/app-layout/ChatListView.vue'),
                props: true,
                meta: {
                  type: 'ROOT',
                },
                children: [
                  {
                    path: ':chatId',
                    name: 'chat-list.conversation',
                    meta: {
                      type: 'ROOT',
                    },
                    props: true,
                    component: () => import('../views/app-layout/ChatConversationView.vue'),
                  },
                ],
              },
              {
                path: 'notifications',
                name: 'notifications',
                component: () => import('../views/app-layout/stack-views/NotificationsView.vue'),
                meta: {
                  type: 'STACK',
                },
              },
              {
                path: 'favorites',
                name: 'favorites',
                component: () => import('../views/app-layout/FavoriteListView.vue'),
                meta: {
                  type: 'ROOT',
                },
              },
            ],
          },
          {
            path: 'menu',
            name: 'menu',
            component: () => import('../views/app-layout/stack-views/MenuView.vue'),
            meta: {
              type: 'STACK',
            },
          },
          {
            path: 'bag',
            name: 'bag',
            component: () => import('../views/app-layout/stack-views/BagView.vue'),
            meta: {
              type: 'STACK',
            },
          },
          {
            path: 'fixed',
            name: 'fixed',
            component: () => import('../views/app-layout/stack-views/FixedView.vue'),
            meta: {
              type: 'STACK',
            },
          },
        ],
      },
      {
        path: '/',
        name: 'guest',
        meta: {
          middlewares: [isGuestMiddleware],
        },
        children: [
          {
            path: '/entrar',
            name: 'login',
            component: () => import('../views/LoginView.vue'),
          },
        ],
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFoundView.vue'),
  },
];

export const navigatorRouter = createRouter({
  history,
  routes,
});

const nonStackViewRoutes = markRaw(
  navigatorRouter.getRoutes().filter((route) => route.meta.type !== 'STACK'),
);

export const virtualRouter = createRouter({
  history: createMemoryHistory(import.meta.env.BASE_URL),
  routes: nonStackViewRoutes,
});

export const useRoute = () => {
  return navigatorRouter.currentRoute.value;
};

export const useRouter = () => {
  return navigatorRouter;
};

export const startRouterSync = () => {
  syncNavigatorToVirtualRouter({ navigatorRouter, virtualRouter });

  if (LOG_NAVIGATOR_ROUTER_NAVIGATION_EVENTS) {
    logRouterNavigation('NAVIGATOR ROUTER', navigatorRouter);
    logRouterErrors('NAVIGATOR ROUTER', navigatorRouter);
  }

  if (LOG_VIRTUAL_ROUTER_NAVIGATION_EVENTS) {
    logRouterNavigation('VIRTUAL ROUTER', virtualRouter);
    logRouterErrors('VIRTUAL ROUTER', virtualRouter);
  }

  navigatorRouter.beforeEach(middlewarePipeline);
};
