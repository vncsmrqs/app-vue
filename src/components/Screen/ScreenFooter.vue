<script setup lang="ts">
import { isIosApp } from '@/utils/device.ts';
import { useElementSize } from '@vueuse/core';
import { useTemplateRef, watch } from 'vue';

const props = withDefaults(
  defineProps<{ extendsPaddingBottom?: boolean; paddingSizeX?: 'md' | 'sm' }>(),
  {
    paddingSizeX: 'md',
  },
);

const emit = defineEmits<{ 'update:height': [number] }>();

const rootElement = useTemplateRef('root-element');

const { height } = useElementSize(rootElement);

watch(
  () => height.value,
  (newHeight) => {
    emit('update:height', newHeight);
  },
  { immediate: true },
);
</script>

<template>
  <footer
    ref="root-element"
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
