import { useAuthStore } from '@/stores/auth-store.ts';
import type {
  NavigationGuard,
  NavigationGuardNext,
  RouteLocationNormalized,
  RouteRecordNormalized,
} from 'vue-router';
import type { PermissionEnum } from '@/enums/permissions.enum.ts';
import { AuthorizationError } from '@/errors/app.error.ts';

const isAuthorized = (to: RouteLocationNormalized, permissions: PermissionEnum[] = []) => {
  const allRequiredPermissions: PermissionEnum[] = to.matched.reduce<PermissionEnum[]>(
    (list: PermissionEnum[], matchedRoute: RouteRecordNormalized): PermissionEnum[] => {
      const requiredPermissions: PermissionEnum[] | undefined = matchedRoute?.meta?.permissions;

      if (requiredPermissions && requiredPermissions.length) {
        list = list.concat(requiredPermissions);
      }

      return list;
    },
    [],
  );

  return allRequiredPermissions.every((requiredPermission) => {
    return permissions.includes(requiredPermission);
  });
};

export const isAuthorizedMiddleware: NavigationGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
): Promise<void> => {
  const authStore = useAuthStore();

  if (isAuthorized(to, authStore.permissions)) {
    next();
    authStore.setAuthorizedRoute();
    return;
  }

  authStore.setUnauthorizedRoute(
    new AuthorizationError('Você não tem permissão para acessar esta página'),
  );

  next();
};
