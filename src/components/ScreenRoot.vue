<script setup lang="ts">
import { ref, useTemplateRef, watch } from 'vue';
import { useElementSize, useScroll } from '@vueuse/core';

const rootElement = useTemplateRef<HTMLElement>('root-element');
const stickyElement = useTemplateRef<HTMLElement>('sticky-element');

const { y: scrollTop } = useScroll(rootElement);

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
      const a = translateY.value * -1 >= height.value ? height.value : translateY.value * -1 + diff;
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
</script>

<template>
  <div
    ref="root-element"
    class="w-full h-full flex-auto flex flex-col overflow-x-hidden overflow-y-auto relative"
  >
    <div
      ref="sticky-element"
      class="sticky top-0 transform-gpu z-10"
      :style="{ transform: `translateY(${translateY}px)` }"
    >
      <slot name="header"></slot>
    </div>
    <div class="w-full flex-1 flex flex-col overflow-visible">
      <slot></slot>
    </div>
    <slot name="footer"></slot>
  </div>
</template>

<style scoped></style>
