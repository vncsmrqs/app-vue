<script setup lang="ts">
import { ref, computed, watch, useAttrs, useTemplateRef } from 'vue';
import {
  MIN_SWIPE_X_START,
  STACK_VIEW_BASE_TRANSITION_MILLISECOND,
  STACK_VIEW_SWIPE_X_IS_ACTIVE,
  STACK_VIEW_VISIBILITY_TIMEOUT_MILLISECOND,
} from '@/config/stack-view-config.ts';
import { useElementSize } from '@vueuse/core';
import { isMobileBrowser } from '@/utils/device.ts';

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

defineOptions({
  inheritAttrs: false,
});

const attrs = useAttrs();

const containerElement = useTemplateRef('container-element');

const isRendering = ref(false);
const isVisible = ref(!props.transitionDuration || isMobileBrowser());

let visibilityTimeout: NodeJS.Timeout;
let renderingTimeout: NodeJS.Timeout;

const { width } = useElementSize(containerElement);

const closeThreshold = computed(() => width.value * 0.4);

const dragOffset = ref(0);
const isDragging = ref(false);

const drawerTransform = computed(() => {
  if (isDragging.value) {
    return `translateX(${dragOffset.value}px)`;
  }
  return '';
});

const swipeProgress = computed(() => {
  const raw = (dragOffset.value / width.value) * 100;
  return Math.round(Math.min(100, Math.max(0, raw)) * 100) / 100;
});

const isPastThreshold = computed(() => swipeProgress.value >= 40);

const overlayOpacity = computed(() => {
  if (!props.show) {
    return 0;
  }

  if (!isDragging.value) {
    return 1;
  }

  return 1 - dragOffset.value / width.value;
});

const remainingAnimationTime = computed(() => {
  const percent = 100 - swipeProgress.value;
  return (props.transitionDuration * percent) / 100;
});

const animationTime = computed(() => {
  if (isDragging.value) {
    return 0;
  }
  return remainingAnimationTime.value;
});

const close = async (animationTime: number = props.transitionDuration) => {
  emit('close', animationTime);
};

let touchStartX = 0;
let touchStartY = 0;
let gestureDefined = false;
let gestureHandled = false;

function onTouchStart(e: Event & { touches: TouchList }) {
  if (!props.show || !STACK_VIEW_SWIPE_X_IS_ACTIVE) {
    return;
  }
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
  gestureDefined = false;
  gestureHandled = false;
  isDragging.value = false;
}

function onTouchMove(e: Event & { touches: TouchList }) {
  if (!props.show || !STACK_VIEW_SWIPE_X_IS_ACTIVE) {
    return;
  }

  const dx = e.touches[0].clientX - touchStartX;
  const dy = e.touches[0].clientY - touchStartY;

  const isHorizontal = Math.abs(dx) > Math.abs(dy);

  if (!isHorizontal && !gestureDefined) {
    gestureDefined = true;
    return;
  }

  if (gestureDefined && !gestureHandled) {
    return;
  }

  if (!isDragging.value && dx > MIN_SWIPE_X_START) {
    isDragging.value = true;
    gestureHandled = true;
  }

  if (gestureHandled) {
    e.preventDefault();
    dragOffset.value = Math.max(0, dx);
  }
}

function onTouchEnd() {
  if (!props.show || !isDragging.value) {
    return;
  }

  isDragging.value = false;

  if (dragOffset.value >= closeThreshold.value) {
    close(animationTime.value);
  }
}

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

defineExpose({ swipeProgress, isPastThreshold, isDragging, dragOffset });
</script>

<template>
  <teleport to="#low-priority-target">
    <div
      v-bind="attrs"
      :class="{
        opened: isVisible,
        closed: !isVisible,
      }"
      class="drawer"
    >
      <div
        class="drawer-overlay"
        :class="{
          'bg-black/50': STACK_VIEW_SWIPE_X_IS_ACTIVE,
          'md:bg-black/50': true,
        }"
        :style="{
          opacity: overlayOpacity,
        }"
        @click="() => close()"
      />

      <div
        ref="container-element"
        class="drawer-container"
        :class="[show || isDragging ? 'pointer-events-auto' : '']"
        :style="{ transform: drawerTransform }"
        @touchstart.passive="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
        @touchcancel="onTouchEnd"
      >
        <div class="flex h-full w-full flex-col overflow-hidden bg-white shadow-2xl">
          <div class="flex-1 overflow-y-auto overscroll-contain">
            <!--            <div>closeThreshold: {{ closeThreshold }}</div>-->
            <!--            <div>dragOffset: {{ dragOffset }}</div>-->
            <!--            <div>animationTime: {{ animationTime }}</div>-->
            <!--            <div>width: {{ width }}</div>-->
            <!--            <div>isDragging: {{ isDragging }}</div>-->
            <!--            <div>swipeProgress: {{ swipeProgress }}</div>-->
            <slot v-if="isRendering" />
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<style scoped lang="scss">
@reference '../../assets/tailwind.css';

* {
  -webkit-tap-highlight-color: transparent;
}

.drawer {
  @apply fixed top-0 left-0 w-dvw h-dvh pointer-events-none;
}

.drawer-overlay {
  @apply w-dvw h-dvh pointer-events-auto;
  opacity: 1;
  transition: opacity calc(v-bind('animationTime') * 1s / 1000) ease-in-out;
}

.drawer-container {
  @apply z-10 fixed top-0 right-0 w-dvw h-dvh bg-white transform-cpu;
  transition: transform calc(v-bind('animationTime') * 1s / 1000) ease-in-out;
  transform: translateX(0);
  &.animate-opacity {
    opacity: 1;
  }
  will-change: transform;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}

@media (min-width: 768px) {
  .drawer-container {
    max-width: calc(32rem - v-bind('props.index') * 0.5rem);
  }
}

.closed {
  .drawer-overlay {
    @apply pointer-events-none opacity-0;
  }
  .drawer-container {
    transform: translateX(100%);
  }
}
</style>
