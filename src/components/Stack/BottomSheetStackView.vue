<script setup lang="ts">
import { computed, ref, useAttrs, useTemplateRef, watch } from 'vue';
import { useElementBounding, useSwipe } from '@vueuse/core';
import { isMobileBrowser } from '@/utils/device.ts';
import { provide } from 'vue';

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
    minHeight?: number;
  }>(),
  {
    index: 0,
    transitionDuration: STACK_VIEW_BASE_TRANSITION_MILLISECOND,
    fullHeight: false,
    minHeight: 0,
  },
);

const emit = defineEmits<{
  close: [number];
}>();

defineOptions({
  inheritAttrs: false,
});

const attrs = useAttrs();

provide('isInStackView', true);

const rootElement = useTemplateRef('root-element');
const containerElement = useTemplateRef('container-element');
const swiperElement = useTemplateRef('swiper-element');

const { height: containerHeight } = useElementBounding(containerElement);
const { height: swiperHeight } = useElementBounding(swiperElement);
const { height: rootHeight } = useElementBounding(rootElement);

const isClosing = ref(false);
const isRendering = ref(false);
const isVisible = ref(!props.transitionDuration || isMobileBrowser());
const startContainerHeight = ref(0);

let visibilityTimeout: NodeJS.Timeout;
let renderingTimeout: NodeJS.Timeout;

const { isSwiping, coordsEnd, coordsStart } = useSwipe(swiperElement, {
  passive: false,
  threshold: 10,
  onSwipeStart: (e) => {
    startContainerHeight.value = containerHeight.value;
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
  return isRealSwiping.value && coordsEnd.y - coordsStart.y >= containerHeight.value * 0.4;
});

const startContainerTop = computed(() => {
  return rootHeight.value - startContainerHeight.value;
});

const allowedMinHeight = computed(() => props.minHeight + swiperHeight.value);
const allowedMaxContainerTop = computed(() => rootHeight.value - allowedMinHeight.value);
const distanceY = computed(() => coordsEnd.y - coordsStart.y + startContainerTop.value);
const reachedMinHeight = computed(() => containerHeight.value <= allowedMinHeight.value + 1);

const translateY = computed(() => {
  const translateY = distanceY.value - allowedMaxContainerTop.value;
  return translateY < 0 ? 0 : translateY;
});

const containerTransform = computed(() => {
  const distance = coordsEnd.y - coordsStart.y;

  if (STACK_VIEW_SWIPE_Y_IS_ACTIVE && (props.fullHeight || reachedMinHeight.value)) {
    if (isRealSwiping.value && distance > 0) {
      if (reachedMinHeight.value) {
        return {
          transform: `translateY(${translateY.value}px)`,
        };
      }

      return { transform: `translateY(${distance}px)` };
    }
  }

  return {};
});

const containerMaxHeight = computed(() => {
  if (STACK_VIEW_SWIPE_Y_IS_ACTIVE && !props.fullHeight) {
    const distance = coordsEnd.y - coordsStart.y;

    if ((isRealSwiping.value && distance > 0) || isClosing.value) {
      return {
        // allowedMaxContainerTop: `max(calc(100dvh - ${startContainerTop.value}px - ${distance}px), ${allowedMinHeight.value}px)`,
        maxHeight: `max(calc(100dvh - ${startContainerTop.value}px - ${distance}px), ${allowedMinHeight.value}px)`,
      };
    }
  }

  return { maxHeight: 'calc(100dvh - 2rem)' };
});

const swipeDistancePercent = computed(() => {
  if (isRealSwiping.value) {
    const percent = (coordsEnd.y - coordsStart.y) / containerHeight.value || 0;
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
      return { opacity: 1 - swipeDistancePercent.value * 0.25 };
    }
  }
  return { opacity: undefined };
});

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

const close = async (animationTime: number) => {
  isClosing.value = true;
  emit('close', animationTime);
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
      v-bind="attrs"
      :tabindex="index"
    >
      <div v-if="false" class="fixed yop-0 left-0 bg-red-500 z-50">
        <div>containerTransform {{ containerTransform }}</div>
        <div>reachedMinHeight: {{ reachedMinHeight }}</div>
        <!--        <div>props.minHeight: {{ props.minHeight }}</div>-->
        <!--        <div>coordsStart: {{ coordsStart.y }}</div>-->
        <!--        <div>coordsEnd: {{ coordsEnd.y }}</div>-->
        <!--        <div>startContainerTop: {{ startContainerTop }}</div>-->
        <!--        <div>rootHeight: {{ rootHeight }}</div>-->
        <div>containerHeight: {{ containerHeight }}</div>
        <!--        <div>swiperHeight: {{ swiperHeight }}</div>-->
        <div>allowedMinHeight {{ allowedMinHeight }}</div>
        <div>allowedMaxContainerTop {{ allowedMaxContainerTop }}</div>
        <!--        <div>distanceY {{ distanceY }}</div>-->
        <!--        <div>translateY {{ translateY }}</div>-->
      </div>
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
        :style="{
          ...containerTransform,
          ...containerOpacity,
          ...containerMaxHeight,
        }"
      >
        <div
          ref="swiper-element"
          class="w-full flex justify-center py-4 z-10 bg-white border-b border-gray-200"
        >
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
