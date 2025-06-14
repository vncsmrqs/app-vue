import { onMounted, onUnmounted, ref, toRaw } from 'vue';
import {
  type RouteLocationNormalizedGeneric,
  type RouteLocationNormalizedLoadedGeneric,
} from 'vue-router';
import { useRouter } from '@/router';
import { PubSub } from '@/utils/pub-sub.ts';
import { LOG_NAVIGATOR_ROUTER_NAVIGATION_EVENTS } from '@/config/app-config.ts';

const router = useRouter();

export type NavigationAction = 'PUSH' | 'BACKWARD' | 'FORWARD';

type BackwardRoute = {
  position: number;
  fullPath: string;
  stateId?: string;
};

const pubSub = new PubSub<{
  onAfterRouterNavigate: {
    to: RouteLocationNormalizedGeneric;
    from: RouteLocationNormalizedLoadedGeneric;
    action: NavigationAction;
    currentPosition: number;
    lastPosition: number;
    backwardRouteList: BackwardRoute[];
  };
}>();

let backwardRouteList: BackwardRoute[] = [];

const currentPosition = ref(0);
const lastPosition = ref(0);

const currentStateId = ref<string | undefined>();
const lastStateId = ref<string | undefined>();

const getNavigationAction = (
  to: RouteLocationNormalizedGeneric,
  list: BackwardRoute[],
): NavigationAction => {
  if (currentPosition.value < lastPosition.value) {
    return 'BACKWARD';
  }

  const routeLeftBehind = list.find(({ position }) => position === currentPosition.value);

  if (
    routeLeftBehind &&
    routeLeftBehind.fullPath === to.fullPath &&
    routeLeftBehind.position === currentPosition.value &&
    routeLeftBehind.stateId === currentStateId.value
  ) {
    return 'FORWARD';
  }

  return 'PUSH';
};

const handleNavigationAction = (
  from: RouteLocationNormalizedLoadedGeneric,
  navigationAction: NavigationAction,
  list: BackwardRoute[],
) => {
  if (navigationAction === 'BACKWARD') {
    return [
      ...list,
      toRaw({
        position: currentPosition.value + 1,
        fullPath: from.fullPath,
        stateId: lastStateId.value,
      }),
    ];
  }

  if (navigationAction === 'FORWARD') {
    return list.filter((r) => r.position !== currentPosition.value);
  }

  return [];
};

const defineCurrent = () => {
  currentPosition.value = ((router.options.history.state.position as number) || 0) + 1;
  currentStateId.value = router.options.history.state.stateId as string;
};

const defineLast = () => {
  lastPosition.value = currentPosition.value;
  lastStateId.value = currentStateId.value;
};

defineCurrent();

router.afterEach((to, from, failure) => {
  if (failure) {
    return;
  }

  defineCurrent();

  const navigationAction = getNavigationAction(to, backwardRouteList);

  backwardRouteList = handleNavigationAction(from, navigationAction, backwardRouteList);

  pubSub.publish('onAfterRouterNavigate', {
    to,
    from,
    backwardRouteList: backwardRouteList,
    action: navigationAction,
    currentPosition: currentPosition.value,
    lastPosition: lastPosition.value,
  });

  defineLast();

  if (LOG_NAVIGATOR_ROUTER_NAVIGATION_EVENTS) {
    console.log(`NAVIGATION METHOD::${navigationAction}`);
  }
});

type NavigationCallbackPayload = {
  to: RouteLocationNormalizedGeneric;
  from: RouteLocationNormalizedLoadedGeneric;
  action: NavigationAction;
  backwardRouteList: BackwardRoute[];
  currentPosition: number;
  lastPosition: number;
};

type NavigationCallback = (payload: NavigationCallbackPayload) => void;

export const onAfterRouterNavigate = (callback: NavigationCallback) => {
  let unsubscribe = () => {};

  onMounted(() => {
    unsubscribe();
    unsubscribe = pubSub.subscribe('onAfterRouterNavigate', callback);
  });

  onUnmounted(unsubscribe);

  return unsubscribe;
};
