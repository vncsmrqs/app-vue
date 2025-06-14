import { onBeforeUnmount, onMounted } from 'vue';
import device from '@/utils/device';

export default function useClickOutside(
  fnComponent: HTMLElement | (() => HTMLElement),
  callback: () => void = () => {},
  fnExcludeComponent?: HTMLElement | (() => HTMLElement),
) {
  if (!fnComponent) {
    throw new Error('A target components has to be provided.');
  }

  if (!callback) {
    throw new Error('A callback has to be provided.');
  }

  const listener = (event: Event) => {
    const component = typeof fnComponent === 'function' ? fnComponent() : fnComponent;
    const excludeComponent =
      typeof fnExcludeComponent === 'function' ? fnExcludeComponent() : fnExcludeComponent;

    if (
      event.target === component ||
      event.composedPath().includes(component) ||
      event.target === excludeComponent ||
      event.composedPath().includes(excludeComponent || component)
    ) {
      return;
    }
    if (typeof callback === 'function') {
      callback();
    }
  };

  onMounted(() => {
    window.addEventListener('click', listener);
    if (device.isMobile()) {
      window.addEventListener('touchend', listener);
    }
  });

  onBeforeUnmount(() => {
    window.removeEventListener('click', listener);
    if (device.isMobile()) {
      window.removeEventListener('touchend', listener);
    }
  });
}
