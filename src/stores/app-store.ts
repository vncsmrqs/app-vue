import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import { useAuthStore } from '@/stores/auth-store.ts';
import device from '@/utils/device';
import { debounce } from '@/utils/common';
import { AppError } from '@/errors/app.error';
import { useStackViewStore } from '@/stores/stack-view-store.ts';
import { useElementSize } from '@vueuse/core';
import { useLoadingProgress } from '@/composables/use-loading-progress.ts';

const RESIZE_TIMEOUT = 1000;
const UPDATE_VIEW_MODE_TIMEOUT = 100;
const MIN_DESKTOP_VIEW = 1280;
const MAX_MOBILE_VIEW = 768;

export type ViewMode = 'mobile' | 'responsive' | 'desktop';

const defineView = (width: number): ViewMode => {
  if (device.isMobile() || width < MAX_MOBILE_VIEW) {
    return 'mobile';
  }

  if (width >= MIN_DESKTOP_VIEW) {
    return 'desktop';
  }

  return 'responsive';
};

export const useAppStore = defineStore('app', () => {
  const loadingProgress = useLoadingProgress();

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

  const appLoading = computed<boolean>(() => {
    return authStore.isLoading;
  });

  const appError = computed<AppError | null>(() => {
    return error.value || authStore.sessionError || authStore.unauthorizedRouteError;
  });

  return {
    //State
    tabCount,
    appLoading,
    appError,
    width,
    height,
    isResizing,
    view: computed(() => definedView.value),
    navigationLoadingProgress: computed(() => loadingProgress.progress.value),
    showNavigationLoading: computed(() => loadingProgress.isLoading.value),
    //Actions
    startNavigationLoading: loadingProgress.start,
    endNavigationLoading: loadingProgress.end,
  };
});
