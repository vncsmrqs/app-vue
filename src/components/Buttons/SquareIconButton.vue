<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    type?: 'primary' | 'secondary' | 'transparent-secondary';
    size?: 'sm' | 'md';
  }>(),
  {
    type: 'transparent-secondary',
    size: 'md',
  },
);
</script>

<template>
  <button
    class="flex-none cursor-pointer flex items-center justify-center hover:bg-gray-100 transition-colors"
    :class="{
      'text-white bg-fuchsia-700 hover:bg-fuchsia-900': props.type === 'primary',
      'text-black bg-gray-100 hover:bg-gray-300 border border-gray-300': props.type === 'secondary',
      'text-black hover:bg-gray-200': props.type === 'transparent-secondary',
      'w-10 h-10 rounded-md': props.size === 'sm',
      'w-12 h-12 rounded-lg': props.size === 'md',
    }"
  >
    <slot />
  </button>
</template>

<style scoped></style>
