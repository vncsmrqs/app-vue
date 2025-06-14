import { type RouteLocationNamedRaw } from 'vue-router';
import { v6 as uuid } from 'uuid';
import { useRouter } from '@/router';
import { isIosApp } from '@/utils/device.ts';

const router = useRouter();

export const useAppNavigation = () => {
  return {
    navigate: async (to: RouteLocationNamedRaw) => {
      if (isIosApp()) {
        return router.replace({ ...to, state: { stateId: uuid() } });
      }
      return router.push({ ...to, state: { stateId: uuid() } });
    },
  };
};
