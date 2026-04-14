import { onMounted, onBeforeUnmount } from 'vue';

export function useFullscreen(callback: () => void) {
  onMounted(() => {
    window.addEventListener('fullscreenchange', callback);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('fullscreenchange', callback);
  });
}
