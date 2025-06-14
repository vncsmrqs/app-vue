import { ref } from 'vue';
import { clearSession, getSession, saveSession } from '@/utils/session';

const accessToken = ref<string | null>(null);
const refreshToken = ref<string | null>(null);
const simulatedUserToken = ref<string | null>(null);

let isLoaded = false;

export function usePersistedSessionTokens() {
  const load = async (force = false) => {
    if (!force && isLoaded) {
      return;
    }
    const session = await getSession();
    accessToken.value = session?.accessToken || null;
    refreshToken.value = session?.refreshToken || null;
    simulatedUserToken.value = session?.simulatedUserToken || null;
    isLoaded = !!session;
  };

  const save = async (data: {
    accessToken: string;
    refreshToken: string;
    simulatedUserToken?: string;
  }) => {
    await saveSession({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      simulatedUserToken: data.simulatedUserToken ?? undefined,
    });
    await load(true);
  };

  const clear = async () => {
    await clearSession();
    await load(true);
  };

  return {
    accessToken,
    refreshToken,
    simulatedUserToken,
    load,
    save,
    clear,
  };
}
