<script setup lang="ts">
import { isIosApp } from '@/utils/device.ts';

const props = withDefaults(
  defineProps<{ extendsPaddingBottom?: boolean; paddingSizeX?: 'md' | 'sm' }>(),
  {
    paddingSizeX: 'md',
  },
);
</script>

<template>
  <footer
    class="w-full shrink-0 border-t sticky bottom-0 border-t-gray-100 flex justify-center py-3 flex-none border-gray-200 bg-white"
    :class="{
      'pb-5': props.extendsPaddingBottom || isIosApp(),
      'px-5': props.paddingSizeX === 'md',
      'px-3': props.paddingSizeX === 'sm',
    }"
  >
    <slot></slot>
  </footer>
</template>

<style scoped></style>
