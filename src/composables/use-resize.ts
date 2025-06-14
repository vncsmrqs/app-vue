import { ref, onMounted, onUnmounted } from 'vue';

export const useResize = (elementCallback: () => HTMLElement | null = () => document.body) => {
  const width = ref(0);
  const height = ref(0);

  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      if (entry.contentBoxSize) {
        width.value = entry.contentBoxSize[0].inlineSize;
        height.value = entry.contentBoxSize[0].blockSize;
        return;
      }
      width.value = entry.contentRect.width;
      height.value = entry.contentRect.height;
    }
  });

  const start = () => {
    const element = elementCallback();
    if (element) {
      resizeObserver.observe(element);
    }
  };

  const stop = () => {
    const element = elementCallback();
    if (element) {
      resizeObserver.unobserve(element);
    }
  };

  onMounted(start);

  onUnmounted(stop);

  return { width, height, start, stop };
};
