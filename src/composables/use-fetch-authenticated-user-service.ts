import { ref } from 'vue';
import { type ComponentRequestController, useHttpClient } from '@/composables/use-http-client.ts';
import { AppError, GenericError } from '@/errors/app.error';
import type { AuthenticatedUserResponseDto } from '@/dto/auth/authenticated-user-response.dto.ts';

export const useFetchAuthenticatedUserService = (
  controllerParams: ComponentRequestController = {
    component: 'fetch-current-user-service',
    id: 'default',
  },
) => {
  const data = ref<AuthenticatedUserResponseDto | null>(null);
  const loading = ref<boolean>(false);
  const error = ref<AppError | null>(null);

  const httpClient = useHttpClient(import.meta.env.VITE_API_SERVER_URL!);

  const cancelFunction = ref<() => void>(() => {});

  const cancel = () => {
    cancelFunction.value();
  };

  const execute = async (): Promise<void> => {
    $reset();
    try {
      loading.value = true;

      const controller = httpClient.getAbortController(controllerParams);

      const request = httpClient.makeRequest<AuthenticatedUserResponseDto>(
        'GET',
        '/users/me',
        controller,
      );

      cancelFunction.value = request.cancel;

      const response = await request.execute();

      data.value = response.data;
    } catch (e: any) {
      if (AppError.is(e)) {
        error.value = e;
        return;
      }
      error.value = new GenericError(e.toString());
      console.error(error.value);
    } finally {
      loading.value = false;
    }
  };

  const $reset = () => {
    data.value = null;
    loading.value = false;
    error.value = null;
    cancelFunction.value = () => {};
  };

  return {
    data,
    loading,
    error,
    cancel,
    execute,
    $reset,
  };
};
