import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { useFetchAuthenticatedUserService } from '@/composables/use-fetch-authenticated-user-service.ts';
import { useLoginService } from '@/composables/use-login-service.ts';
import { AppError, AuthenticationError } from '@/errors/app.error';
import { usePersistedSessionTokens } from '@/composables/use-persisted-session-tokens.ts';
import type { PermissionEnum } from '@/enums/permissions.enum.ts';

export const useAuthStore = defineStore('auth', () => {
  const loginService = useLoginService();

  const {
    accessToken,
    save: persistTokens,
    clear: clearPersistedTokens,
    load: loadPersistedTokens,
  } = usePersistedSessionTokens();

  const {
    data: currentUser,
    error: loadCurrentUserError,
    $reset: clearCurrentUserData,
    execute: loadCurrentUser,
    loading: isLoadingCurrentUser,
    cancel: cancelLoadCurrentUser,
  } = useFetchAuthenticatedUserService();

  const unauthorizedRouteError = ref<AppError | null>(null);
  const isLoadingSession = ref<boolean>(false);
  const loadSessionError = ref<AuthenticationError | null>(null);

  const isAuthenticated = computed<boolean>(() => {
    return !!accessToken.value;
  });

  const permissions = computed<PermissionEnum[]>(() => currentUser.value?.permissions || []);

  const setUnauthorizedRoute = (e: AppError) => {
    unauthorizedRouteError.value = e;
  };

  const setAuthorizedRoute = () => {
    unauthorizedRouteError.value = null;
  };

  const login = async (code: string): Promise<void> => {
    await loginService.execute(code);

    if (!loginService.error.value) {
      await persistTokens({
        accessToken: loginService.data.value!.accessToken,
        refreshToken: loginService.data.value!.refreshToken,
      });
      clearCurrentUserData();
      loginService.$reset();
    }
  };

  const loadSession = async (): Promise<void> => {
    $reset();

    isLoadingSession.value = true;

    try {
      await loadPersistedTokens(true);

      clearCurrentUserData();

      if (!isAuthenticated.value) {
        return;
      }

      await loadCurrentUser();

      if (loadCurrentUserError.value) {
        if (AuthenticationError.is(loadCurrentUserError.value)) {
          await clearPersistedTokens();
        }
        return;
      }
    } finally {
      isLoadingSession.value = false;
    }
  };

  const logout = async (): Promise<void> => {
    $reset(true);
  };

  const setExpiredSession = (error: AuthenticationError): void => {
    loadSessionError.value = error;
  };

  const $reset = (logout = false) => {
    isLoadingSession.value = false;
    loadSessionError.value = null;
    clearCurrentUserData();
    cancelLoadCurrentUser();

    if (logout) {
      clearPersistedTokens().then(() => {});
    }
  };

  return {
    isAuthenticated,
    permissions,
    currentUser,
    isLoadingSession: computed(() => isLoadingSession.value || isLoadingCurrentUser.value),
    loadSessionError: computed(() => loadSessionError.value || loadCurrentUserError.value),
    unauthorizedRouteError,
    loginService,
    login,
    logout,
    loadSession,
    setExpiredSession,
    setUnauthorizedRoute,
    setAuthorizedRoute,
  };
});
