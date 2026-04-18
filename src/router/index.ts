import {
  createMemoryHistory,
  createRouter,
  createWebHistory,
  type RouteLocationNormalizedLoaded,
  type RouteRecordRaw,
} from 'vue-router';

import { h, markRaw, resolveComponent, shallowReactive, watch } from 'vue';
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
import { isMobile } from '@/utils/device.ts';
// import { isAuthenticatedMiddleware } from '@/router/middlwares/is-authenticated.middleware.ts';

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
            children: [
              {
                path: 'bag',
                name: 'order.bag',
                component: () => import('../views/app-layout/stack-views/order/BagView.vue'),
                meta: {
                  type: 'STACK',
                },
              },
              {
                path: 'delivery-mode',
                name: 'order.delivery-mode',
                component: () =>
                  import('../views/app-layout/stack-views/order/DeliveryModeView.vue'),
                meta: {
                  type: 'STACK',
                },
              },
              {
                path: 'payment-method',
                name: 'order.payment-method',
                component: () =>
                  import('../views/app-layout/stack-views/order/PaymentMethodView.vue'),
                meta: {
                  type: 'STACK',
                },
              },
              {
                path: 'order',
                name: 'order.order',
                component: () =>
                  import('../views/app-layout/stack-views/order/PaymentMethodView.vue'),
                meta: {
                  type: 'STACK',
                },
              },
            ],
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
                  forceMatchedRoot: false,
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
              stackMode: isMobile() ? 'BOTTOM_SHEET' : undefined,
              stackProps: { fullHeight: true },
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
              // middlewares: [isAuthenticatedMiddleware],
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
            path: 'bottom',
            name: 'bottom',
            component: () => import('../views/app-layout/stack-views/MenuView.vue'),
            meta: {
              type: 'STACK',
              stackMode: 'BOTTOM_SHEET',
            },
          },
          {
            path: 'bottom-short',
            name: 'bottom-short',
            component: () => import('../views/app-layout/stack-views/MenuViewShort.vue'),
            meta: {
              type: 'STACK',
              stackMode: 'BOTTOM_SHEET',
            },
          },
          {
            path: 'modal',
            name: 'modal',
            component: () => import('../views/app-layout/stack-views/MenuView.vue'),
            meta: {
              type: 'STACK',
              stackMode: 'MODAL',
              stackProps: { fullHeight: true },
            },
          },
          {
            path: 'fixed-bottom',
            name: 'fixed-bottom',
            component: () => import('../views/app-layout/stack-views/FixedView.vue'),
            meta: {
              type: 'STACK',
              stackMode: 'BOTTOM_SHEET',
              stackProps: { fullHeight: true },
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

let _route: RouteLocationNormalizedLoaded | undefined;
let _virtualRoute: RouteLocationNormalizedLoaded | undefined;

export const useRoute = () => {
  if (!_route) {
    _route = shallowReactive({
      ...navigatorRouter.currentRoute.value,
    }) as RouteLocationNormalizedLoaded;

    watch(
      navigatorRouter.currentRoute,
      (newRoute) => {
        Object.assign(_route!, newRoute);
      },
      { immediate: true },
    );
  }

  return _route;
};

export const useVirtualRoute = () => {
  if (!_virtualRoute) {
    _virtualRoute = shallowReactive({
      ...virtualRouter.currentRoute.value,
    }) as RouteLocationNormalizedLoaded;

    watch(
      virtualRouter.currentRoute,
      (newRoute) => {
        Object.assign(_virtualRoute!, newRoute);
      },
      { immediate: true },
    );
  }

  return _virtualRoute;
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
