import { ref, type ShallowRef, watch } from 'vue';
import { useElementSize, useScroll } from '@vueuse/core';

export const scrollUpShow = (
  scrollableElement: Readonly<ShallowRef<HTMLElement | null>>,
  stickyElement: Readonly<ShallowRef<HTMLElement | null>>,
) => {
  const { y: scrollTop } = useScroll(scrollableElement);

  const { height } = useElementSize(stickyElement);

  const translateY = ref(0);

  watch(
    () => scrollTop.value,
    (value, oldValue) => {
      if (scrollTop.value < 0) {
        return;
      }

      // rolando para baixo
      if (value >= oldValue) {
        const diff = value - oldValue;
        const a =
          translateY.value * -1 >= height.value ? height.value : translateY.value * -1 + diff;
        translateY.value = a * -1;

        return;
      }

      // rolando para cima
      const diff = oldValue - value;

      if (diff > 0) {
        translateY.value = translateY.value >= 0 ? 0 : translateY.value + diff;
      }
    },
  );

  return {
    translateY,
  };
};
