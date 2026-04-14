import { onMounted, onUnmounted, ref, toRaw, computed } from 'vue';
import {
  type RouteLocationNormalizedGeneric,
  type RouteLocationNormalizedLoadedGeneric,
} from 'vue-router';
import { useRouter } from '@/router';
import { PubSub } from '@/utils/pub-sub.ts';
import { LOG_NAVIGATOR_ROUTER_NAVIGATION_EVENTS } from '@/config/app-config.ts';
import { PUSH_HISTORY_STATE } from '@/config/stack-view-config.ts';
import lodash from 'lodash';

const router = useRouter();

export type NavigationAction = 'PUSH' | 'BACKWARD' | 'FORWARD' | 'REPLACE';

type BackwardRoute = {
  position: number;
  fullPath: string;
  stateId?: string;
};

type NavigationCallbackPayload = {
  to: RouteLocationNormalizedGeneric;
  from: RouteLocationNormalizedLoadedGeneric;
  action: NavigationAction;
  backwardRouteList: BackwardRoute[];
  currentPosition: number;
  lastPosition: number;
  currentState: HistoryState;
  lastState: HistoryState | null;
};

const pubSub = new PubSub<{
  onAfterRouterNavigate: NavigationCallbackPayload;
}>();

// Configurar limite de listeners para detectar memory leaks
pubSub.setMaxListeners(10);

let backwardRouteList: BackwardRoute[] = [];

type HistoryState = {
  position: number;
  replaced?: boolean;
  stateId?: string;
  back?: string;
  current: string;
  forward?: string;
};

const currentState = ref<HistoryState | null>(null);
const lastState = ref<HistoryState | null>(null);

const currentPosition = computed<number>(() => currentState.value?.position || 0);
const lastPosition = computed<number>(() => lastState.value?.position || 0);

const currentStateId = computed<string | undefined>(() => currentState.value?.stateId);
const lastStateId = computed<string | undefined>(() => lastState.value?.stateId);

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

  if (currentState.value?.replaced) {
    return 'REPLACE';
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

const defineCurrentState = () => {
  const state = router.options.history.state;
  const currentPosition = ((state.position as number) || 0) + 1;
  currentState.value = {
    replaced:
      (state.replaced as boolean | undefined) || lastState.value?.position === currentPosition,
    stateId: state.stateId as string | undefined,
    back: state.back as string | undefined,
    current: state.current as string,
    forward: state.forward as string | undefined,
    position: currentPosition,
  };
};

const defineLastState = () => {
  lastState.value = lodash.cloneDeep(currentState.value);
};

defineCurrentState();

router.afterEach((to, from, failure) => {
  if (failure) {
    return;
  }

  defineCurrentState();

  const navigationAction = getNavigationAction(to, backwardRouteList);

  backwardRouteList = handleNavigationAction(from, navigationAction, backwardRouteList);

  pubSub.publish('onAfterRouterNavigate', {
    to,
    from,
    backwardRouteList: backwardRouteList,
    action: navigationAction,
    currentPosition: currentPosition.value,
    lastPosition: lastPosition.value,
    currentState: currentState.value as HistoryState,
    lastState: lastState.value,
  });

  defineLastState();

  if (!PUSH_HISTORY_STATE) {
    window.history.replaceState({}, '', to.fullPath);
  }

  if (LOG_NAVIGATOR_ROUTER_NAVIGATION_EVENTS) {
    console.log(`NAVIGATION METHOD::${navigationAction}`);
  }
});

type NavigationCallback = (payload: NavigationCallbackPayload) => void;

/**
 * Hook para se inscrever em eventos de navegação após rota
 * Garante cleanup automático ao desmontar o componente
 */
export const onAfterRouterNavigate = (callback: NavigationCallback) => {
  let subscription: ReturnType<typeof pubSub.subscribe> | null = null;

  onMounted(() => {
    if (subscription?.isActive()) {
      subscription?.unsubscribe();
    }
    subscription = pubSub.subscribe('onAfterRouterNavigate', callback);
  });

  onUnmounted(() => {
    if (subscription?.isActive()) {
      subscription?.unsubscribe();
    }
    subscription = null;
  });

  return () => {
    if (subscription?.isActive()) {
      subscription?.unsubscribe();
    }
  };
};
