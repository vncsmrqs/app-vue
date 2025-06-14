<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    progress: number;
    value?: number;
    size?: number;
    circleWidth?: number;
    progressWidth?: number;
    circleColor?: string;
    progressColor?: string;
    progressShape?: 'butt' | 'round';
    showProgress?: boolean;
    showValue?: boolean;
    showPercentage?: boolean;
    textColor?: string;
  }>(),
  {
    size: 24,
    circleWidth: 3,
    progressWidth: 3,
    circleColor: `#e0e0e0`,
    progressColor: `currentColor`,
    progressShape: 'butt',
    showValue: false,
    showPercentage: true,
    textColor: `#6bdba7`,
  },
);

const cx = computed(() => props.size / 2);
const cy = computed(() => props.size / 2);

const validProgress = computed(() => {
  if (props.progress > 100) {
    return 100;
  }

  if (props.progress < 0) {
    return 0;
  }

  return props.progress;
});

const radius = computed(() => props.size / 2 - props.circleWidth / 2);

const formatedProgress = computed(
  () => `${validProgress.value.toFixed(0)}${props.showPercentage ? '%' : ''}`,
);

const viewBox = computed(() => `0 0 ${props.size} ${props.size}`);

const dashArray = computed(() => Math.PI * radius.value * 2);

const dashOffset = computed(() =>
  Math.round(dashArray.value * ((100 - validProgress.value) / 100)),
);
</script>

<template>
  <div class="relative flex flex-col justify-center items-center">
    <svg
      :width="size"
      :height="size"
      :viewBox="viewBox"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      style="transform: rotate(-90deg)"
    >
      <circle
        :r="radius"
        :cx="cx"
        :cy="cy"
        fill="transparent"
        :stroke="circleColor"
        :stroke-width="circleWidth"
      ></circle>
      <circle
        :r="radius"
        :cx="cx"
        :cy="cy"
        :stroke="progressColor"
        :stroke-width="progressWidth"
        :stroke-linecap="progressShape"
        :stroke-dashoffset="`${dashOffset}px`"
        fill="transparent"
        :stroke-dasharray="`${dashArray}px`"
      ></circle>
    </svg>
    <div
      v-if="showValue || showProgress"
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 font-medium"
    >
      <template v-if="showValue">
        {{ value }}
      </template>
      <template v-else>
        {{ formatedProgress }}
      </template>
    </div>
  </div>
</template>

<style scoped></style>
