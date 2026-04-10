<script setup lang="ts">
import { computed, ref, useTemplateRef, watch } from 'vue';
import { useElementSize, useSwipe } from '@vueuse/core';
import { isMobileBrowser } from '@/utils/device.ts';
import {
  STACK_VIEW_BASE_TRANSITION_MILLISECOND,
  STACK_VIEW_SWIPE_Y_IS_ACTIVE,
  CONTAINER_OPACITY_IS_ACTIVE,
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

// const rootElement = useTemplateRef('root-element');
const containerElement = useTemplateRef('container-element');
const swiperElement = useTemplateRef('swiper-element');

const { height } = useElementSize(containerElement);

const { isSwiping, lengthY, coordsEnd, coordsStart } = useSwipe(swiperElement, {
  passive: false,
  threshold: 10,
  onSwipeStart: (e) => {
    if (STACK_VIEW_SWIPE_Y_IS_ACTIVE) {
      e.preventDefault();
      return;
    }
  },
  onSwipeEnd: () => {
    if (STACK_VIEW_SWIPE_Y_IS_ACTIVE) {
      if (isClosable.value) {
        close(animationTime.value);
      }
    }
  },
});

const isRealSwiping = computed(() => {
  return STACK_VIEW_SWIPE_Y_IS_ACTIVE && isSwiping.value;
});

const isClosable = computed(() => {
  return isRealSwiping.value && coordsEnd.y - coordsStart.y >= height.value * 0.4;
});

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
  }, remainingAnimationTime.value);
};

watch(
  () => props.show,
  async (show: boolean) => {
    handleVisibility(show);
    handleRendering(show);
  },
  { immediate: true },
);

const containerTransform = computed(() => {
  if (STACK_VIEW_SWIPE_Y_IS_ACTIVE) {
    if (isRealSwiping.value) {
      const y = lengthY.value * -1;
      if (y <= 0) {
        return `translateY(${0}px)`;
      }
      return `translateY(${lengthY.value * -1}px)`;
    }
  }
  return '';
});

const swipeDistancePercent = computed(() => {
  if (isRealSwiping.value) {
    const percent = (coordsEnd.y - coordsStart.y) / height.value || 0;
    if (percent > 100) {
      return 100;
    }
    return percent < 0 ? 0 : percent;
  }

  return 0;
});

const remainingAnimationTime = computed(() => {
  const percent = 1 - swipeDistancePercent.value;
  return props.transitionDuration * percent;
});

const animationTime = computed(() => {
  if (STACK_VIEW_SWIPE_Y_IS_ACTIVE) {
    if (isRealSwiping.value) {
      return 0;
    }
  }
  return remainingAnimationTime.value;
});

const backdropOpacity = computed(() => {
  if (STACK_VIEW_SWIPE_Y_IS_ACTIVE) {
    if (isRealSwiping.value) {
      return 1 - swipeDistancePercent.value;
    }
  }
  return undefined;
});

const containerOpacity = computed(() => {
  if (STACK_VIEW_SWIPE_Y_IS_ACTIVE && CONTAINER_OPACITY_IS_ACTIVE) {
    if (isRealSwiping.value) {
      return 1 - swipeDistancePercent.value * 0.25;
    }
  }
  return undefined;
});

import { provide } from 'vue';

provide('isInStackView', true);
</script>

<template>
  <Teleport to="#stack-view-target">
    <div
      ref="root-element"
      class="bottom-sheet touch-pan-y"
      :class="{
        opened: isVisible,
        closed: !isVisible,
        'is-swiping': !!isSwiping,
      }"
      :tabindex="index"
    >
      <div
        class="bottom-sheet-backdrop"
        :class="{
          'bg-black/50': STACK_VIEW_SWIPE_Y_IS_ACTIVE,
          'md:bg-black/50': true,
        }"
        :style="{ opacity: backdropOpacity }"
        @click="() => close(props.transitionDuration)"
      ></div>
      <div
        ref="container-element"
        class="bottom-sheet-container"
        :class="{ 'animate-opacity': STACK_VIEW_SWIPE_Y_IS_ACTIVE, 'h-dvh': fullHeight }"
        :style="{ transform: containerTransform, opacity: containerOpacity }"
      >
        <div ref="swiper-element" class="w-full flex justify-center py-4">
          <div class="w-10 h-1 rounded-md bg-gray-300"></div>
        </div>
        <slot v-if="isRendering"></slot>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
@reference "@/assets/main.css";

.bottom-sheet {
  @apply fixed bottom-0 left-0 w-dvw h-dvh pointer-events-none;
}

.bottom-sheet-backdrop {
  @apply w-dvw h-dvh pointer-events-auto;
  opacity: 1;
  transition: opacity calc(v-bind('animationTime') * 1s / 1000) ease-in-out;
}

.bottom-sheet-container {
  @apply z-10 fixed bottom-0 left-0 w-dvw bg-white pointer-events-auto transform-cpu rounded-t-3xl overflow-hidden flex flex-col;
  transition:
    transform calc(v-bind('animationTime') * 1s / 1000) ease-in-out,
    opacity calc(v-bind('animationTime') * 1s / 1000) ease-in-out;
  transform: translateY(0);
  &.animate-opacity {
    opacity: 1;
  }
}

.bottom-sheet-container {
  max-height: calc(100% - 2rem);
}

.closed {
  .bottom-sheet-backdrop {
    @apply pointer-events-none opacity-0;
  }
  .bottom-sheet-container {
    &.animate-opacity {
      opacity: 0;
    }
    transform: translateY(100%);
  }
}
</style>
