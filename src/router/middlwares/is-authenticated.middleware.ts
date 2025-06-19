import { useAuthStore } from '@/stores/auth-store.ts';
import type { NavigationGuard, NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

export const isAuthenticatedMiddleware: NavigationGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
): Promise<void> => {
  const authStore = useAuthStore();

  if (!authStore.isAuthenticated) {
    next({
      name: 'login',
    });
    return;
  }

  next();
};
