<script setup lang="ts">
import { ref, watch } from 'vue';
import { isMobileBrowser } from '@/utils/device.ts';
import {
  STACK_VIEW_BASE_TRANSITION_MILLISECOND,
  STACK_VIEW_VISIBILITY_TIMEOUT_MILLISECOND,
} from '@/config/stack-view-config.ts';

const props = withDefaults(
  defineProps<{
    show: boolean;
    index?: number;
    transitionDuration?: number;
    fullHeight?: boolean;
  }>(),
  {
    index: 0,
    transitionDuration: STACK_VIEW_BASE_TRANSITION_MILLISECOND,
    fullHeight: false,
  },
);
const emit = defineEmits<{
  close: [number];
}>();

const close = async (animationTime: number) => {
  emit('close', animationTime);
};

const isRendering = ref(false);
const isVisible = ref(!props.transitionDuration || isMobileBrowser());

let visibilityTimeout: NodeJS.Timeout;
let renderingTimeout: NodeJS.Timeout;

const handleVisibility = (show: boolean) => {
  clearTimeout(visibilityTimeout);

  if (show) {
    visibilityTimeout = setTimeout(() => {
      isVisible.value = true;
    }, STACK_VIEW_VISIBILITY_TIMEOUT_MILLISECOND);
    return;
  }

  isVisible.value = show;
};

const handleRendering = (show: boolean) => {
  clearTimeout(renderingTimeout);

  if (show) {
    isRendering.value = true;
    return;
  }

  renderingTimeout = setTimeout(() => {
    isRendering.value = false;
  }, props.transitionDuration);
};

watch(
  () => props.show,
  async (show: boolean) => {
    handleVisibility(show);
    handleRendering(show);
  },
  { immediate: true },
);

import { provide } from 'vue';

provide('isInStackView', true);
</script>

<template>
  <Teleport to="#stack-view-target">
    <div
      ref="root-element"
      class="center-modal touch-pan-y"
      :class="{
        opened: isVisible,
        closed: !isVisible,
      }"
      :tabindex="index"
    >
      <div
        class="center-modal-backdrop"
        :class="{
          'bg-black/50': true,
        }"
        @click="() => close(props.transitionDuration)"
      ></div>
      <div ref="container-element" class="center-modal-container" :class="{ 'h-dvh': fullHeight }">
        <slot v-if="isRendering"></slot>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
@reference "@/assets/main.css";

.center-modal {
  @apply fixed bottom-0 left-0 w-dvw h-dvh pointer-events-none flex items-center justify-center;
}

.center-modal-backdrop {
  @apply w-dvw h-dvh pointer-events-auto;
  opacity: 1;
  transition: opacity calc(v-bind('props.transitionDuration') * 1s / 1000) ease-in-out;
}

.center-modal-container {
  @apply z-10 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-dvw bg-white pointer-events-auto transform-cpu rounded-3xl overflow-hidden flex flex-col;
  transition:
    transform calc(v-bind('props.transitionDuration') * 1s / 1000) ease-in-out,
    opacity calc(v-bind('props.transitionDuration') * 1s / 1000) ease-in-out;
  transform: scale(1);
}

.center-modal-container {
  max-height: calc(100% - 6rem);
  max-width: min(calc(32rem - 2rem), calc(100% - 2rem));
  @apply mx-auto;
}

.closed {
  .center-modal-backdrop {
    @apply pointer-events-none opacity-0;
  }
  .center-modal-container {
    transform: scale(0.8);
    @apply opacity-0;
  }
}
</style>
