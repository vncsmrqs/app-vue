<script setup lang="ts">
import { computed, inject, useTemplateRef } from 'vue';
import { useScroll, useSwipe } from '@vueuse/core';
import { MIN_SWIPE_X_START } from '@/config/stack-view-config.ts';
import ProgressCircle from '@/components/ProgressCircle.vue';
import { scrollUpShow } from '@/composables/scroll-up-show.ts';

const PULL_LOADING_HEIGHT = 60;
const PULL_REFRESH_THRESHOLD = PULL_LOADING_HEIGHT * 1.5;
const PULL_LIMIT = PULL_REFRESH_THRESHOLD * 1.1;
const PULL_RESISTANCE = 0.5;

const props = withDefaults(
  defineProps<{
    pullToRefresh?: boolean;
    loading?: boolean;
    swipeContent?: boolean;
  }>(),
  {
    pullToRefresh: false,
    loading: false,
    swipeContent: true,
  },
);

const scrollableElement = useTemplateRef<HTMLElement>('scrollable-element');
const stickyElement = useTemplateRef<HTMLElement>('sticky-element');

const { translateY: stickyY } = scrollUpShow(scrollableElement, stickyElement);

const isInStackView = inject('isInStackView', false);

const emit = defineEmits<{
  refresh: [void];
}>();

const { y: scrollTop } = useScroll(scrollableElement);

const { isSwiping, coordsStart, coordsEnd, lengthY } = useSwipe(scrollableElement, {
  threshold: 10,
  passive: false,
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
    !props.pullToRefresh ||
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
    return {};
  }
  if (props.swipeContent) {
    return {
      transform: `translateY(${translateY.value}px)`,
    };
  }
  return {};
});

const _iconStyle = computed(() => {
  if (ignoreSwipe.value) {
    return {};
  }
  return {
    height: `${PULL_LOADING_HEIGHT}px`,
    transform: `translateY(${translateY.value}px)`,
  };
});
</script>

<template>
  <main
    ref="scrollable-element"
    class="w-full h-full flex-auto flex flex-col overflow-x-hidden overflow-y-auto relative bg-gray-200"
    :class="{ 'overflow-y-hidden': props.loading || thresholdPercentage }"
  >
    <div
      ref="sticky-element"
      class="sticky top-0 transform-gpu z-10"
      :style="{ transform: `translateY(${stickyY}px)` }"
    >
      <slot name="header"></slot>
    </div>
    <div
      :style="contentStyle"
      :class="{
        'transition-transform': !isSwiping,
        'min-h-0': false,
        'w-full flex-1 flex flex-col overflow-visible': false,
      }"
      class="w-full flex-auto transform-cpu bg-gray-50"
    >
      <div
        class="w-full flex justify-center items-center absolute bottom-full transform-cpu"
        :class="{
          'border-b border-gray-200': props.swipeContent,
          'transition-transform': !isSwiping,
        }"
      >
        <div
          class="w-10 h-10 bg-white drop-shadow rounded-full left-1/2 z-40 flex items-center justify-center text-primary-600 mb-2"
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
      <slot></slot>
    </div>
    <slot name="footer"></slot>
  </main>
</template>

<style scoped></style>
