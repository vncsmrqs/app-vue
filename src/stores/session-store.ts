import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { usePersistedSessionTokens } from '@/composables/use-persisted-session-tokens.ts';

export const useSessionStore = defineStore('session', () => {
  const tokensService = usePersistedSessionTokens();

  const loading = ref(false);
  const error = ref<Error | null>(null);

  const isAuthenticated = computed(() => !!tokensService.accessToken.value);

  const load = async () => {
    loading.value = true;
    error.value = null;

    try {
      await tokensService.load(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (e) {
      error.value = e as Error;
    } finally {
      loading.value = false;
    }
  };

  const save = async (accessToken: string, refreshToken: string) => {
    await tokensService.save({ accessToken, refreshToken });
  };

  const clear = async () => {
    await tokensService.clear();
  };

  return {
    accessToken: tokensService.accessToken,
    isAuthenticated,
    isLoading: computed(() => loading.value),
    error,
    load,
    save,
    clear,
  };
});
