import { createMemoryHistory, createRouter, createWebHistory } from 'vue-router';

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

const history = PUSH_HISTORY_STATE
  ? createWebHistory(import.meta.env.BASE_URL)
  : createMemoryHistory(import.meta.env.BASE_URL);

export const navigatorRouter = createRouter({
  history,
  routes: [
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
          // components: {
          //   default: () => import('../views/InitialView.vue'),
          // },
          redirect: { name: 'home' },
        },
        {
          path: '/',
          name: 'app-layout',
          component: () => import('../views/app-layout/AppLayout.vue'),
          children: [
            {
              path: '/home',
              name: 'home',
              components: {
                default: () => import('../views/app-layout/HomeView.vue'),
              },
              props: true,
              meta: {
                isRoot: true,
              },
            },
            {
              path: '/search',
              name: 'search',
              components: {
                default: () => import('../views/app-layout/SearchView.vue'),
              },
              props: true,
              meta: {
                isRoot: true,
              },
            },
            {
              path: '/orders',
              name: 'orders',
              components: {
                default: () => import('../views/app-layout/OrderListView.vue'),
              },
              props: true,
              meta: {
                isRoot: true,
              },
            },
            {
              path: '/merchant/:merchantId',
              name: 'merchant',
              components: {
                default: () => import('@/views/app-layout/MerchantView.vue'),
              },
              props: true,
              meta: {
                isRoot: true,
                paramsToMap: ['merchantId'],
              },
              // beforeEnter: (to, from, next) => {
              //   to.params = {
              //     ...to.params,
              //   };
              //   return next();
              // },
              children: [
                {
                  path: 'products/:productId',
                  name: 'merchant.product',
                  components: {
                    stackView: () =>
                      import('@/views/app-layout/stack-views/merchant/DetailProductView.vue'),
                  },
                  props: {
                    stackView: true,
                  },
                },
              ],
            },
            {
              path: '/address-list',
              name: 'address-list',
              components: {
                stackView: () => import('../views/app-layout/stack-views/AddressListView.vue'),
              },
              props: true,
              children: [
                {
                  path: 'add',
                  name: 'address-list.add',
                  components: {
                    stackView: () => import('../views/app-layout/stack-views/AddressListView.vue'),
                  },
                },
              ],
            },
            {
              path: '/chats',
              name: 'chat-list',
              components: {
                default: () => import('../views/app-layout/ChatListView.vue'),
              },
              props: true,
              meta: {
                isRoot: true,
              },
              children: [
                {
                  path: ':chatId',
                  name: 'chat-list.conversation',
                  meta: {
                    isRoot: true,
                  },
                  props: true,
                  components: {
                    default: () => import('../views/app-layout/ChatConversationView.vue'),
                  },
                },
              ],
            },
            {
              path: '/favorites',
              name: 'favorites',
              components: {
                default: () => import('../views/app-layout/FavoriteListView.vue'),
              },
              meta: { isRoot: true },
            },
            {
              path: '/menu',
              name: 'menu',
              components: {
                stackView: () => import('../views/app-layout/stack-views/MenuView.vue'),
              },
            },
            {
              path: '/notifications',
              name: 'notifications',
              components: {
                stackView: () => import('../views/app-layout/stack-views/NotificationsView.vue'),
              },
            },
            {
              path: '/bag',
              name: 'bag',
              components: {
                stackView: () => import('../views/app-layout/stack-views/BagView.vue'),
              },
            },
            {
              path: '/fixed',
              name: 'fixed',
              components: {
                stackView: () => import('../views/app-layout/stack-views/FixedView.vue'),
              },
              meta: {
                mode: 'MODAL',
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
  ],
});

const routes = markRaw(navigatorRouter.getRoutes().filter((route) => !route.components?.stackView));

export const virtualRouter = createRouter({
  history: createMemoryHistory(import.meta.env.BASE_URL),
  routes,
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
