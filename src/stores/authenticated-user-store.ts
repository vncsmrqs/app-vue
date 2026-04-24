import { computed } from 'vue';
import { defineStore } from 'pinia';
import { useFetchAuthenticatedUserService } from '@/composables/use-fetch-authenticated-user-service.ts';
import type { PermissionEnum } from '@/enums/permissions.enum.ts';

export const useAuthenticatedUserStore = defineStore('user', () => {
  const authenticatedUserService = useFetchAuthenticatedUserService();

  const permissions = computed<PermissionEnum[]>(
    () => authenticatedUserService.data.value?.permissions || [],
  );

  const fetch = async () => {
    await authenticatedUserService.execute();
  };

  const $reset = () => {
    authenticatedUserService.$reset();
    authenticatedUserService.cancel();
  };

  return {
    currentUser: authenticatedUserService.data,
    permissions,
    isLoading: authenticatedUserService.loading,
    error: authenticatedUserService.error,
    fetch,
    $reset,
  };
});
