<script setup lang="ts">
import { computed, inject, ref } from 'vue';
import { useScroll, useSwipe } from '@vueuse/core';
import { MIN_SWIPE_X_START } from '../../config/stack-view-config.ts';
import ProgressCircle from '@/components/ProgressCircle.vue';

const PULL_LOADING_HEIGHT = 60;
const PULL_REFRESH_THRESHOLD = PULL_LOADING_HEIGHT * 1.5;
const PULL_LIMIT = PULL_REFRESH_THRESHOLD * 1.1;
const PULL_RESISTANCE = 0.5;

const props = withDefaults(
  defineProps<{
    enabled?: boolean;
    loading?: boolean;
    swipeContent?: boolean;
  }>(),
  {
    enabled: true,
    loading: false,
    swipeContent: true,
  },
);

const scrollableElement = ref<HTMLElement | null>(null);

const isInStackView = inject('isInStackView', false);

const emit = defineEmits<{
  refresh: [void];
}>();

const { y: scrollTop } = useScroll(scrollableElement);

const { isSwiping, coordsStart, coordsEnd, lengthY } = useSwipe(scrollableElement, {
  threshold: 10,
  onSwipeEnd: () => {
    if (!ignoreSwipe.value && thresholdPercentage.value >= 100) {
      emit('refresh');
    }
  },
});

const startsSwipingOnTop = computed(() => {
  return scrollTop.value <= 0;
});

const pulledY = computed(() => {
  if (ignoreSwipe.value) {
    return 0;
  }
  return lengthY.value * -1 * PULL_RESISTANCE;
});

const ignoreSwipe = computed(() => {
  return (
    !props.enabled ||
    (isInStackView && coordsStart.x <= MIN_SWIPE_X_START) ||
    !startsSwipingOnTop.value
  );
});

const translateY = computed(() => {
  if (props.loading) {
    return PULL_LOADING_HEIGHT;
  }

  if (ignoreSwipe.value) {
    return 0;
  }

  if (isSwiping.value && pulledY.value > 0) {
    return pulledY.value >= PULL_LIMIT ? PULL_LIMIT : pulledY.value;
  }

  return 0;
});

const thresholdPercentage = computed(() => {
  return (translateY.value / PULL_REFRESH_THRESHOLD) * 100;
});

const progressPercentage = computed(() => {
  if (ignoreSwipe.value) {
    return 0;
  }
  if (props.loading) {
    return 25;
  }
  return (pulledY.value / PULL_REFRESH_THRESHOLD) * 100;
});

const contentStyle = computed(() => {
  if (ignoreSwipe.value) {
    return 0;
  }
  if (props.swipeContent) {
    return {
      transform: `translateY(${translateY.value}px)`,
    };
  }
  return {};
});

const iconStyle = computed(() => {
  if (ignoreSwipe.value) {
    return 0;
  }
  return {
    height: `${PULL_LOADING_HEIGHT}px`,
    transform: `translateY(${translateY.value}px)`,
  };
});
</script>

<template>
  <main
    ref="scrollableElement"
    class="w-full min-h-0 flex-auto flex flex-col overflow-x-hidden overflow-y-auto relative"
    :class="{ 'overflow-y-hidden': props.loading || thresholdPercentage }"
  >
    <div
      class="w-full flex justify-center items-center absolute bottom-full transform-cpu"
      :class="{
        'border-b border-gray-200': props.swipeContent,
        'transition-transform': !isSwiping,
      }"
      :style="iconStyle"
    >
      <div
        class="w-10 h-10 bg-white drop-shadow rounded-full left-1/2 z-40 flex items-center justify-center text-primary-600"
        :style="{
          opacity: translateY,
        }"
      >
        <span
          class="relative duration-300"
          :class="{
            'animate-spin': props.loading,
          }"
        >
          <span
            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            :class="{ 'transition-all duration-300': !coordsEnd.x }"
            :style="{
              opacity: thresholdPercentage / 100,
            }"
          >
            <progress-circle :progress="progressPercentage" />
          </span>
        </span>
      </div>
    </div>
    <div
      :style="contentStyle"
      :class="{
        'transition-transform': !isSwiping,
      }"
      class="w-full min-h-0 flex-auto transform-cpu"
    >
      <slot></slot>
    </div>
  </main>
</template>

<style scoped></style>
