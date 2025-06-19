import { defineStore } from 'pinia';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useAuthStore } from '@/stores/auth-store.ts';
import { useResize } from '@/composables/use-resize.ts';
import device from '@/utils/device';
import { debounce } from '@/utils/common';
import { AppError } from '@/errors/app.error';

const RESIZE_TIMEOUT = 1000;
const UPDATE_VIEW_MODE_TIMEOUT = 300;
const MIN_DESKTOP_VIEW = 1280;
const MIN_MOBILE_VIEW = 600;

export type ViewMode = 'fullscreen-view' | 'mobile-view' | 'responsive-view' | 'desktop-view';

const defineView = (width: number): ViewMode => {
  //Mobile and Portrait = Mobile View
  //Mobile and Landscape = Fullscreen View
  //Desktop and large screen = Desktop View
  //Desktop and small screen = Mobile View / Responsive View
  if (device.isMobile() && device.isLandscape()) {
    return 'fullscreen-view';
  }

  if (device.isMobile() || width < MIN_MOBILE_VIEW) {
    return 'mobile-view';
  }

  if (width < MIN_DESKTOP_VIEW) {
    return 'responsive-view';
  }

  return 'desktop-view';
};

export const useAppStore = defineStore('app', () => {
  const loading = ref<boolean>(false);

  const error = ref<AppError | null>(null);

  const { width, height } = useResize(() => document.body);

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
      await updateView();
    },
    { immediate: true },
  );

  const forceFullscreen = ref<boolean>(false);

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

  onMounted(() => {
    window.addEventListener('fullscreenchange', onFullscreenChange);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('fullscreenchange', onFullscreenChange);
  });

  const onFullscreenChange = () => {
    setTimeout(() => {
      forceFullscreen.value = !!document.fullscreenElement;
    }, 0);
  };

  return {
    //State
    appLoading,
    appError,
    navigationCount,
    navigationLoadingPercentage,
    width,
    height,
    screen: computed(() => (forceFullscreen.value ? 'fullscreen-view' : definedView.value)),
    isResizing,
    showNavigationLoading,
    //Actions
    startNavigationLoading,
    endNavigationLoading,
  };
});
