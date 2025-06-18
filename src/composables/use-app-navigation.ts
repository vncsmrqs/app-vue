import { type RouteLocationNamedRaw } from 'vue-router';
import { v6 as uuid } from 'uuid';
import { useRouter } from '@/router';
import { PUSH_HISTORY_STATE } from '@/config/stack-view-config.ts';

const router = useRouter();

export const useAppNavigation = () => {
  return {
    navigate: async (to: RouteLocationNamedRaw) => {
      if (PUSH_HISTORY_STATE) {
        return router.push({ ...to, state: { stateId: uuid() } });
      }

      const currentPosition = (router.options.history.state?.position as number) || 0;

      await router.push({
        ...to,
        state: {
          stateId: uuid(),
          position: to.replace ? currentPosition : currentPosition + 1,
        },
      });
    },
  };
};
