import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { useLoginService } from '@/composables/use-login-service.ts';
import { AuthenticationError, AppError } from '@/errors/app.error';
import { useSessionStore } from './session-store';
import { useAuthenticatedUserStore } from './authenticated-user-store';

export const useAuthStore = defineStore('auth', () => {
  const sessionStore = useSessionStore();
  const authenticatedUserStore = useAuthenticatedUserStore();
  const loginService = useLoginService();

  const initialized = ref(false);
  const unauthorizedRouteError = ref<AppError | null>(null);
  const sessionError = ref<AuthenticationError | null>(null);

  const loading = ref(false);

  const isAuthenticated = computed(() => sessionStore.isAuthenticated);

  const login = async (code: string) => {
    await loginService.execute(code);

    if (loginService.error.value) {
      sessionError.value = loginService.error.value;
      return;
    }

    const { accessToken, refreshToken } = loginService.data.value!;

    await sessionStore.save(accessToken, refreshToken);

    await loadSession(true);
  };

  const loadSession = async (force = false) => {
    if (initialized.value && !force) {
      return;
    }

    await resetState();

    loading.value = true;

    try {
      await sessionStore.load();

      if (!sessionStore.isAuthenticated) {
        return;
      }

      await loadUser();
    } finally {
      initialized.value = true;
      loading.value = false;
    }
  };

  const loadUser = async () => {
    await authenticatedUserStore.fetch();

    if (authenticatedUserStore.error && AuthenticationError.is(authenticatedUserStore.error)) {
      sessionError.value = authenticatedUserStore.error;
      await sessionStore.clear();
    }
  };

  const logout = async () => {
    await sessionStore.clear();
    await resetState();
  };

  const resetState = async () => {
    initialized.value = false;
    loading.value = false;
    sessionError.value = null;
    unauthorizedRouteError.value = null;
    authenticatedUserStore.$reset();
    loginService.$reset();
  };

  const setExpiredSession = (error: AppError) => {
    sessionError.value = error;
  };

  const setUnauthorizedRoute = (error: AppError) => {
    unauthorizedRouteError.value = error;
  };

  const setAuthorizedRoute = () => {
    unauthorizedRouteError.value = null;
  };

  return {
    isAuthenticated,
    isLoading: computed(() => loading.value),
    currentUser: authenticatedUserStore.currentUser,
    permissions: authenticatedUserStore.permissions,
    sessionError: computed(() => sessionError.value),
    unauthorizedRouteError: computed(() => unauthorizedRouteError.value),
    login,
    logout,
    loadSession,
    setExpiredSession,
    setUnauthorizedRoute,
    setAuthorizedRoute,
  };
});
