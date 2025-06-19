<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    type?: 'primary' | 'secondary' | 'transparent-secondary';
    size?: 'sm' | 'md';
  }>(),
  {
    type: 'secondary',
    size: 'md',
  },
);
</script>

<template>
  <button
    class="flex-none px-4 cursor-pointer font-medium flex items-center justify-center transition-colors"
    :class="{
      'text-white bg-fuchsia-700 hover:bg-fuchsia-900': props.type === 'primary',
      'text-black bg-gray-100 hover:bg-gray-300 border border-gray-300': props.type === 'secondary',
      'text-black hover:bg-gray-200': props.type === 'transparent-secondary',
      'min-w-10 h-10 rounded-md px-3 py-1.5': props.size === 'sm',
      'min-w-12 h-12 rounded-lg px-4 py-2': props.size === 'md',
    }"
  >
    <slot />
  </button>
</template>

<style scoped></style>
