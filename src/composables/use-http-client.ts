import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import {
  AuthenticationError,
  AuthorizationError,
  ClientError,
  NotFoundError,
  CanceledError,
  ServiceError,
  ValidationError,
  AppError,
} from '@/errors/app.error';
import { useAuthStore } from '@/stores/auth-store.ts';
import { usePersistedSessionTokens } from '@/composables/use-persisted-session-tokens.ts';
import { useAppStore } from '@/stores/app-store.ts';
import { useRoute } from '@/router';

export type ComponentRequestController = {
  component: string;
  id: string;
  concurrency?: boolean;
};

const persistedSession = usePersistedSessionTokens();

const GeneralErrorMessage = 'Error: Please refresh and try again, or contact the support team.';

export const parseErrorByHttpCode = (status: number, data?: { message?: string }) => {
  if (status <= 500) {
    if (status === 404) {
      return new NotFoundError(data?.message);
    }

    if (status === 500) {
      return new ServiceError(data?.message);
    }

    if (status === 401) {
      return new AuthenticationError(data?.message);
    }

    if (status === 403) {
      return new AuthorizationError(data?.message);
    }

    if (status === 409 || status === 422) {
      return new ValidationError(data?.message);
    }

    return new ClientError(data?.message);
  }

  return new ServiceError(data?.message ?? GeneralErrorMessage, data);
};

const parseError = (error: AxiosError | AppError | Error) => {
  if (AppError.is(error)) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    if (axios.isCancel(error)) {
      return new CanceledError('Request canceled');
    }

    const { request, response, code, message } = error;

    if (code) {
      if (code === 'ERR_CANCELED') {
        return new CanceledError(`Request canceled (${message})`);
      }
      if (code === 'ECONNABORTED')
        return new ServiceError(`The server is taking too long to respond (${message})`);

      if (code === 'ERR_ADDRESS_UNREACHABLE')
        return new ServiceError(`The server address is invalid (${message})`);

      if (code === 'ERR_INTERNET_DISCONNECTED')
        return new ServiceError(`You are disconnected from internet (${message})`);
    }

    if (response) {
      const { data, status } = response;
      return parseErrorByHttpCode(status, data);
    }

    if (request) {
      return new ServiceError(GeneralErrorMessage);
    }
  }
  //todo: return parseErrorByHttpCode(500, error.toJSON());
  return parseErrorByHttpCode(500, error);
};

const abortControllers: Record<string, Record<string, AbortController>> = {};

export const getAbortController = (params: ComponentRequestController): AbortController => {
  if (!abortControllers[params.component]) {
    abortControllers[params.component] = {};
  }

  const componentControllers = abortControllers[params.component];

  if (componentControllers[params.id] && !componentControllers[params.id].signal.aborted) {
    if (params.concurrency) {
      return componentControllers[params.id];
    }
    componentControllers[params.id].abort();
  }

  componentControllers[params.id] = new AbortController();

  return componentControllers[params.id];
};

export const cancelComponentRequests = (component: string) => {
  if (!abortControllers[component]) {
    abortControllers[component] = {};
  }

  const componentControllers = abortControllers[component];

  Object.keys(componentControllers).forEach((id) => {
    if (componentControllers[id] && !componentControllers[id]?.signal.aborted) {
      componentControllers[id]?.abort();
    }
    delete componentControllers[id];
  });
};

export const useHttpClient = (
  baseURL: string,
  headers?: Record<string, string | number>,
  configs?: Record<string, string | number>,
) => {
  const client = axios.create({
    baseURL,
    headers: {
      'cache-control': 'no-cache, no-store',
      expires: 0,
      ...headers,
    },
    ...(configs ?? {}),
    timeout: 20000,
  });

  const appStore = useAppStore();
  const authStore = useAuthStore();
  const route = useRoute();

  //todo: consertar implementacao do axios retry

  // axiosRetry(client, {
  //   retries: 0,
  //   retryDelay: () => 1000,
  //   retryCondition: (error: any) => isNetworkOrIdempotentRequestError(error),
  //   shouldResetTimeout: false,
  //   // onRetry: (retryCount, error, requestConfig) => {}, //todo: refresh token
  //   // onMaxRetryTimesExceeded: (error, retryCount) => {},
  //   // validateResponse: (response) => {}
  // });

  const getAuthorizationToken = async (): Promise<string | null> => {
    await persistedSession.load(true);

    const simulatedUserToken = persistedSession.simulatedUserToken.value;
    const currentUserToken = persistedSession.accessToken.value;

    if (simulatedUserToken) {
      return simulatedUserToken;
    }

    return currentUserToken;
  };

  const handleError = async (error: Error) => {
    appStore.endNavigationLoading();

    const parsedError = parseError(error);

    if (AuthenticationError.is(parsedError)) {
      const isAuthenticatedRoute = route.matched.some(({ name }) => name === 'authenticated');

      if (isAuthenticatedRoute) {
        authStore.setExpiredSession(parsedError);
      }
    }

    return Promise.reject(parsedError);
  };

  client.interceptors.request.use(async (request: InternalAxiosRequestConfig) => {
    appStore.startNavigationLoading();

    const authorizationToken = await getAuthorizationToken();

    if (authorizationToken && request?.headers) {
      request.headers.Authorization = `Bearer ${authorizationToken}`;
    }

    return request;
  }, handleError);

  client.interceptors.response.use(async (response: AxiosResponse) => {
    appStore.endNavigationLoading();
    return response;
  }, handleError);

  const makeRequest = <R>(
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
    url: string,
    config?: AxiosRequestConfig,
    controller: AbortController = new AbortController(),
  ): {
    execute: () => Promise<AxiosResponse<R>>;
    cancel: (reason?: string) => void;
  } => {
    const execute = (): Promise<AxiosResponse<R>> => {
      return client.request({
        ...config,
        method,
        url,
        signal: controller.signal,
      });
    };

    const cancel = (): void => controller.abort();

    return { execute, cancel };
  };

  return { makeRequest, cancelComponentRequests, getAbortController };
};
