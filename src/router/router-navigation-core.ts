import { ref, toRaw, computed } from 'vue';
import {
  type RouteLocationNormalizedGeneric,
  type RouteLocationNormalizedLoadedGeneric,
  type RouteLocationRaw,
} from 'vue-router';
import { useRouter } from '@/router';
import { PubSub } from '@/utils/pub-sub.ts';
import { LOG_NAVIGATOR_ROUTER_NAVIGATION_EVENTS } from '@/config/app-config.ts';
import lodash from 'lodash';

const router = useRouter();

export type NavigationAction = 'PUSH' | 'BACKWARD' | 'FORWARD' | 'REPLACE';

export type BackwardRoute = {
  position: number;
  fullPath: string;
  stateId?: string;
};

export type HistoryState = {
  position: number;
  replaced?: boolean;
  stateId?: string;
  back?: string;
  current: string;
  forward?: string;
};

export type AfterNavigationCallbackPayload = {
  to: RouteLocationNormalizedGeneric;
  from: RouteLocationNormalizedLoadedGeneric;
  action: NavigationAction;
  backwardRouteList: BackwardRoute[];
  currentPosition: number;
  lastPosition: number;
  currentState: HistoryState;
  lastState: HistoryState | null;
};

export type BeforeNavigationCallbackPayload = {
  to: RouteLocationNormalizedGeneric;
  from: RouteLocationNormalizedLoadedGeneric;
  action: NavigationAction;
};

export const pubSub = new PubSub<{
  onAfterRouterNavigate: AfterNavigationCallbackPayload;
  onBeforeRouterNavigate: BeforeNavigationCallbackPayload;
}>();

// Configurar limite de listeners para detectar memory leaks
pubSub.setMaxListeners(10);

let backwardRouteList: BackwardRoute[] = [];

const currentState = ref<HistoryState | null>(null);
const lastState = ref<HistoryState | null>(null);

const currentPosition = computed<number>(() => currentState.value?.position || 0);
const lastPosition = computed<number>(() => lastState.value?.position || 0);

const currentStateId = computed<string | undefined>(() => currentState.value?.stateId);
const lastStateId = computed<string | undefined>(() => lastState.value?.stateId);

/**
 * Ação pendente, registrada pelos wrappers de router.push/replace/back/forward/go
 * ou pelo listener de popstate. É consumida pelo beforeEach e então limpa.
 *
 * Exportada como getter para permitir acesso externo ao valor atualizado,
 * já que `let` exportado não é reativo para o consumidor em todos os contextos.
 */
export let routerPendingAction: NavigationAction | null = null;

let routerPendingActionSource:
  | 'PUSH_METHOD'
  | 'REPLACE_METHOD'
  | 'GO_METHOD'
  | 'BACK_METHOD'
  | 'FORWARD_METHOD'
  | 'BROWSER_BACK'
  | 'BROWSER_FORWARD'
  | null = null;

export const setPendingAction = (
  action: NavigationAction,
  source: typeof routerPendingActionSource,
) => {
  routerPendingAction = action;
  routerPendingActionSource = source;
};

const consumePendingAction = (): {
  action: typeof routerPendingAction;
  source: typeof routerPendingActionSource;
} => {
  return { action: routerPendingAction, source: routerPendingActionSource };
};

const clearPendingAction = () => {
  routerPendingAction = null;
  routerPendingActionSource = null;
};

/**
 * Intercepta as APIs de navegação do router para registrar a ação pretendida
 * ANTES que o beforeEach seja executado.
 */
const originalPush = router.push.bind(router);
const originalReplace = router.replace.bind(router);
const originalGo = router.go.bind(router);
const originalBack = router.back.bind(router);
const originalForward = router.forward.bind(router);

router.push = ((to: RouteLocationRaw) => {
  // router.push com { replace: true } é tratado como REPLACE pelo vue-router
  const isReplace =
    typeof to === 'object' &&
    to !== null &&
    'replace' in to &&
    (to as { replace?: boolean }).replace;
  setPendingAction(isReplace ? 'REPLACE' : 'PUSH', 'PUSH_METHOD');
  return originalPush(to);
}) as typeof router.push;

router.replace = ((to: RouteLocationRaw) => {
  setPendingAction('REPLACE', 'REPLACE_METHOD');
  return originalReplace(to);
}) as typeof router.replace;

router.go = ((delta: number) => {
  if (delta < 0) {
    setPendingAction('BACKWARD', 'GO_METHOD');
  } else if (delta > 0) {
    setPendingAction('FORWARD', 'GO_METHOD');
  }
  return originalGo(delta);
}) as typeof router.go;

router.back = (() => {
  setPendingAction('BACKWARD', 'BACK_METHOD');
  return originalBack();
}) as typeof router.back;

router.forward = (() => {
  setPendingAction('FORWARD', 'FORWARD_METHOD');
  return originalForward();
}) as typeof router.forward;

router.options.history.listen((_to, _from, options) => {
  if (options.direction === 'back') {
    setPendingAction('BACKWARD', 'BROWSER_BACK');
    return;
  }

  setPendingAction('FORWARD', 'BROWSER_FORWARD');
});

const getAfterNavigationAction = (
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

const buildHistoryStateSnapshot = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  state: any,
  previous: HistoryState | null,
): HistoryState => {
  const position = ((state?.position as number) || 0) + 1;
  return {
    replaced: (state?.replaced as boolean | undefined) || previous?.position === position,
    stateId: state?.stateId as string | undefined,
    back: state?.back as string | undefined,
    current: state?.current as string,
    forward: state?.forward as string | undefined,
    position,
  };
};

const defineCurrentState = () => {
  currentState.value = buildHistoryStateSnapshot(router.options.history.state, lastState.value);
};

const defineLastState = () => {
  lastState.value = lodash.cloneDeep(currentState.value);
};

defineCurrentState();

router.afterEach((to, from, failure) => {
  clearPendingAction();

  if (failure) {
    return;
  }

  defineCurrentState();

  const navigationAction = getAfterNavigationAction(to, backwardRouteList);

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

  if (LOG_NAVIGATOR_ROUTER_NAVIGATION_EVENTS) {
    console.log(`AFTER NAVIGATION ACTION::${navigationAction}`);
  }
});

router.beforeEach((to, from, next) => {
  const { action: navigationAction } = consumePendingAction();

  if (LOG_NAVIGATOR_ROUTER_NAVIGATION_EVENTS) {
    console.log(`BEFORE NAVIGATION ACTION::${navigationAction}`);
  }

  pubSub.publish('onBeforeRouterNavigate', {
    to,
    from,
    action: navigationAction ?? 'PUSH',
  });

  next();
});
