import type { NavigationGuard, NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '@/stores/auth-store.ts';

export const loadSessionMiddleware: NavigationGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
): Promise<void> => {
  const authStore = useAuthStore();
  try {
    if (!authStore.currentUser && !authStore.loadSessionError) {
      await authStore.loadSession();
    }
  } catch (_error: unknown) {
    console.error('loadSessionMiddleware::error', _error);
  } finally {
    next();
  }
};
