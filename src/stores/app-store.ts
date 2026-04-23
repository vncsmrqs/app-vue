import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import { useAuthStore } from '@/stores/auth-store.ts';
import device from '@/utils/device';
import { debounce } from '@/utils/common';
import { AppError } from '@/errors/app.error';
import { useStackViewStore } from '@/stores/stack-view-store.ts';
import { useElementSize } from '@vueuse/core';

const RESIZE_TIMEOUT = 1000;
const UPDATE_VIEW_MODE_TIMEOUT = 100;
const MIN_DESKTOP_VIEW = 1280;
const MIN_MOBILE_VIEW = 600;

export type ViewMode = 'mobile' | 'responsive' | 'desktop';

const defineView = (width: number): ViewMode => {
  if (device.isMobile() || width < MIN_MOBILE_VIEW) {
    return 'mobile';
  }

  if (width < MIN_DESKTOP_VIEW) {
    return 'responsive';
  }

  return 'desktop';
};

export const useAppStore = defineStore('app', () => {
  const loading = ref<boolean>(false);

  const error = ref<AppError | null>(null);

  const stackViewStore = useStackViewStore();

  const tabCount = computed(() => {
    return stackViewStore.activeStackView ? 1 : 0;
  });

  const { width, height } = useElementSize(() => document.body);

  const definedView = ref<ViewMode>(defineView(width.value));
  const isResizing = ref(false);

  const showResizeLoading = () => {
    isResizing.value = true;
    closeResizeLoading();
  };

  const closeResizeLoading = debounce(() => {
    isResizing.value = false;
  }, RESIZE_TIMEOUT);

  const updateView = debounce(async () => {
    definedView.value = defineView(width.value);
  }, UPDATE_VIEW_MODE_TIMEOUT);

  watch(
    () => width.value,
    async (_) => {
      showResizeLoading();
      updateView();
    },
    { immediate: true },
  );

  const authStore = useAuthStore();

  const navigationCount = ref(0);
  let navigationLoadingInterval: NodeJS.Timeout | undefined;
  let navigationLoadingTimeout: NodeJS.Timeout | undefined;
  const navigationLoadingPercentage = ref<number>(0);

  const showNavigationLoading = computed(() => navigationCount.value > 0);

  const appLoading = computed<boolean>(() => {
    return loading.value || authStore.isLoadingSession;
  });

  const appError = computed<AppError | null>(() => {
    return error.value || authStore.loadSessionError || authStore.unauthorizedRouteError;
  });

  const startNavigationLoading = () => {
    if (navigationCount.value + 1 >= 1) {
      clearInterval(navigationLoadingTimeout);
      navigationLoadingTimeout = setTimeout(() => {
        navigationCount.value += 1;
        clearInterval(navigationLoadingInterval);
        navigationLoadingInterval = setInterval(() => {
          if (navigationLoadingPercentage.value > 95) {
            clearInterval(navigationLoadingInterval);
            return;
          }

          if (navigationLoadingPercentage.value > 90) {
            navigationLoadingPercentage.value += 0.1;
            return;
          }

          if (navigationLoadingPercentage.value > 80) {
            navigationLoadingPercentage.value += 0.5;
            return;
          }

          if (navigationLoadingPercentage.value > 50) {
            navigationLoadingPercentage.value += 1;
            return;
          }

          navigationLoadingPercentage.value += 5;
        }, 300);
      }, 300);
      return;
    }
    navigationCount.value += 1;
  };

  const endNavigationLoading = () => {
    if (navigationCount.value - 1 < 1) {
      navigationLoadingPercentage.value = 100;
      clearInterval(navigationLoadingTimeout);
      clearInterval(navigationLoadingInterval);
      setTimeout(() => {
        navigationCount.value = 0;
        setTimeout(() => {
          navigationLoadingPercentage.value = 0;
        }, 100);
      }, 300);
      return;
    }
    navigationCount.value -= 1;
  };

  return {
    //State
    tabCount,
    appLoading,
    appError,
    navigationCount,
    navigationLoadingPercentage,
    width,
    height,
    view: computed(() => definedView.value),
    isResizing,
    showNavigationLoading,
    //Actions
    startNavigationLoading,
    endNavigationLoading,
  };
});
