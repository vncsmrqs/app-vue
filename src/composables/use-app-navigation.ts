import { type RouteLocationNamedRaw } from 'vue-router';
import { v6 as uuid } from 'uuid';
import { useRouter } from '@/router';
import { PUSH_HISTORY_STATE } from '@/config/stack-view-config.ts';
import { useNavStack } from '@/composables/use-nav-stack.ts';

const router = useRouter();

const navStack = useNavStack();

export const useAppNavigation = () => {
  return {
    navigate: async (to: RouteLocationNamedRaw) => {
      if (PUSH_HISTORY_STATE) {
        return router.push({ ...to, state: { stateId: uuid() } });
      }

      navStack.push({ ...to, state: { stateId: uuid() } });
      // return router.replace({ ...to, state: { stateId: uuid() } });
    },
  };
};
