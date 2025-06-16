<script setup lang="ts">
import { computed, ref, useTemplateRef, watch } from 'vue';
import { useElementSize, useSwipe } from '@vueuse/core';
import { isMobileBrowser } from '@/utils/device.ts';
import {
  MIN_SWIPE_X_START,
  STACK_VIEW_BASE_TRANSITION_MILLISECOND,
  STACK_VIEW_SWIPE_IS_ACTIVE,
  CONTAINER_OPACITY_IS_ACTIVE,
} from '@/config/stack-view-config.ts';

const props = withDefaults(
  defineProps<{
    show: boolean;
    index?: number;
    transitionDuration?: number;
  }>(),
  {
    index: 0,
    transitionDuration: STACK_VIEW_BASE_TRANSITION_MILLISECOND,
  },
);
const emit = defineEmits<{
  close: [number];
}>();

const close = async (animationTime: number) => {
  emit('close', animationTime);
};

const rootElement = useTemplateRef('root-element');

const { isSwiping, lengthX, coordsEnd, coordsStart } = useSwipe(rootElement, {
  passive: false,
  threshold: 10,
  onSwipeStart: (e) => {
    if (coordsStart.x <= MIN_SWIPE_X_START && STACK_VIEW_SWIPE_IS_ACTIVE) {
      e.preventDefault();
      return;
    }
  },
  onSwipeEnd: () => {
    if (STACK_VIEW_SWIPE_IS_ACTIVE) {
      if (isRealSwiping.value && coordsEnd.x >= width.value * 0.4) {
        close(animationTime.value);
      }
    }
  },
});

const isRealSwiping = computed(() => {
  return coordsStart.x <= MIN_SWIPE_X_START && STACK_VIEW_SWIPE_IS_ACTIVE && isSwiping.value;
});

const { width } = useElementSize(rootElement);

const isRendering = ref(false);
const isVisible = ref(!props.transitionDuration || isMobileBrowser());

let visibilityTimeout: NodeJS.Timeout;
let renderingTimeout: NodeJS.Timeout;

const handleVisibility = (show: boolean) => {
  clearTimeout(visibilityTimeout);

  if (show) {
    visibilityTimeout = setTimeout(() => {
      isVisible.value = true;
    }, 100);
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
  if (STACK_VIEW_SWIPE_IS_ACTIVE) {
    if (isRealSwiping.value) {
      const x = lengthX.value * -1;
      if (x <= 0) {
        return `translateX(${0}px)`;
      }
      return `translateX(${lengthX.value * -1}px)`;
    }
  }
  return '';
});

const swipeDistancePercent = computed(() => {
  if (isRealSwiping.value) {
    const percent = coordsEnd.x / width.value || 0;
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
  if (STACK_VIEW_SWIPE_IS_ACTIVE) {
    if (isRealSwiping.value) {
      return 0;
    }
  }
  return remainingAnimationTime.value;
});

const backdropOpacity = computed(() => {
  if (STACK_VIEW_SWIPE_IS_ACTIVE) {
    if (isRealSwiping.value) {
      return 1 - swipeDistancePercent.value;
    }
  }
  return undefined;
});

const containerOpacity = computed(() => {
  if (STACK_VIEW_SWIPE_IS_ACTIVE && CONTAINER_OPACITY_IS_ACTIVE) {
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
      class="drawer touch-pan-x"
      :class="{
        opened: isVisible,
        closed: !isVisible,
        'is-swiping': !!isSwiping,
      }"
      :tabindex="index"
    >
      <div
        class="drawer-backdrop"
        :class="{
          'bg-black/50': STACK_VIEW_SWIPE_IS_ACTIVE,
          'md:bg-black/50': true,
        }"
        :style="{ opacity: backdropOpacity }"
        @click="() => close(props.transitionDuration)"
      ></div>
      <div
        class="drawer-container"
        :class="{ 'animate-opacity': STACK_VIEW_SWIPE_IS_ACTIVE }"
        :style="{ transform: containerTransform, opacity: containerOpacity }"
      >
        <!--        <div v-if="isMobileApp()" class="z-20 absolute top-0 left-0 bg-red-500 flex flex-col">-->
        <!--          <div>isSwiping: {{ isSwiping }}</div>-->
        <!--          <div>direction: {{ direction }}</div>-->
        <!--          <div>lengthX: {{ lengthX }}</div>-->
        <!--          <div>lengthY: {{ lengthY }}</div>-->
        <!--          <div>coordsEnd: {{ coordsEnd }}</div>-->
        <!--          <div>coordsStart: {{ coordsStart }}</div>-->
        <!--          <div>width: {{ width }}</div>-->
        <!--          <div>transitionDuration: {{ transitionDuration }}</div>-->
        <!--          <div>animationTime: {{ animationTime }}</div>-->
        <!--          <div>backdropOpacity: {{ backdropOpacity }}</div>-->
        <!--          <div>containerOpacity: {{ containerOpacity }}</div>-->
        <!--        </div>-->
        <slot v-if="isRendering"></slot>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
@reference "@/assets/main.css";

.drawer {
  @apply fixed top-0 left-0 w-dvw h-dvh pointer-events-none;
}

.drawer-backdrop {
  @apply w-dvw h-dvh pointer-events-auto;
  opacity: 1;
  transition: opacity calc(v-bind('animationTime') * 1s / 1000) ease-in-out;
}

.drawer-container {
  @apply z-10 fixed top-0 right-0 w-dvw h-dvh bg-white pointer-events-auto transform-cpu;
  transition:
    transform calc(v-bind('animationTime') * 1s / 1000) ease-in-out,
    opacity calc(v-bind('animationTime') * 1s / 1000) ease-in-out;
  transform: translateX(0);
  &.animate-opacity {
    opacity: 1;
  }
}

@media (min-width: 768px) {
  .drawer-container {
    max-width: calc(32rem - v-bind('props.index') * 0.5rem);
  }
}

.closed {
  .drawer-backdrop {
    @apply pointer-events-none opacity-0;
  }
  .drawer-container {
    &.animate-opacity {
      opacity: 0;
    }
    transform: translateX(100%);
  }
}
</style>
