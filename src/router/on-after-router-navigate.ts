import { type AfterNavigationCallbackPayload, pubSub } from '@/router/router-navigation-core.ts';
import { onMounted, onUnmounted } from 'vue';

type AfterNavigationCallback = (payload: AfterNavigationCallbackPayload) => void;

/**
 * Hook para se inscrever em eventos de navegação após rota.
 * Garante cleanup automático ao desmontar o componente.
 */
export const onAfterRouterNavigate = (callback: AfterNavigationCallback) => {
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
