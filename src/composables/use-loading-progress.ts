import { ref, computed, onUnmounted } from 'vue';

export function useLoadingProgress() {
  const navigationCount = ref(0);
  const progress = ref(0);

  let interval: ReturnType<typeof setInterval> | null = null;
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const isLoading = computed(() => navigationCount.value > 0);

  const clearTimers = () => {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  const getIncrement = (value: number) => {
    if (value > 95) {
      return 0;
    }
    if (value > 90) {
      return 0.1;
    }
    if (value > 80) {
      return 0.5;
    }
    if (value > 50) {
      return 1;
    }
    return 5;
  };

  const start = () => {
    navigationCount.value++;

    if (navigationCount.value > 1) {
      return;
    }

    clearTimers();

    timeout = setTimeout(() => {
      interval = setInterval(() => {
        const increment = getIncrement(progress.value);
        if (increment === 0) {
          clearTimers();
          return;
        }
        progress.value += increment;
      }, 300);
    }, 300);
  };

  const end = () => {
    if (navigationCount.value === 0) {
      return;
    }

    if (navigationCount.value - 1 > 0) {
      navigationCount.value--;
      return;
    }

    clearTimers();
    progress.value = 100;

    setTimeout(() => {
      navigationCount.value--;
      progress.value = 0;
    }, 400);
  };

  onUnmounted(clearTimers);

  return {
    progress,
    isLoading,
    start,
    end,
  };
}
