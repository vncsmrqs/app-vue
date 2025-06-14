import { ref } from 'vue';
import { useHttpClient } from '@/composables/use-http-client.ts';
import { AppError, GenericError } from '@/errors/app.error';
import type { LoginResponseDto } from '@/dto/auth/login-response.dto.ts';

export const useLoginService = () => {
  const data = ref<LoginResponseDto | null>(null);
  const loading = ref<boolean>(false);
  const error = ref<AppError | null>(null);

  const httpClient = useHttpClient(import.meta.env.VITE_API_SERVER_URL!);

  const execute = async (code: string): Promise<void> => {
    $reset();
    try {
      loading.value = true;

      const controller = httpClient.getAbortController({
        component: 'login-service',
        id: 'default',
      });

      const request = httpClient.makeRequest<LoginResponseDto>(
        'POST',
        '/auth/authenticate/oidc',
        {
          data: { code },
        },
        controller,
      );

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
  };

  return {
    $reset,
    data,
    loading,
    error,
    execute,
  };
};
