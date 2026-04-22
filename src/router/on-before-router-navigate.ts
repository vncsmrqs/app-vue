import { type BeforeNavigationCallbackPayload, pubSub } from '@/router/router-navigation-core.ts';
import { onMounted, onUnmounted } from 'vue';

type BeforeNavigationCallback = (payload: BeforeNavigationCallbackPayload) => void;

/**
 * Hook para se inscrever em eventos de navegação antes da rota.
 * Garante cleanup automático ao desmontar o componente.
 */
export const onBeforeRouterNavigate = (callback: BeforeNavigationCallback) => {
  let subscription: ReturnType<typeof pubSub.subscribe> | null = null;

  onMounted(() => {
    if (subscription?.isActive()) {
      subscription?.unsubscribe();
    }
    subscription = pubSub.subscribe('onBeforeRouterNavigate', callback);
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
