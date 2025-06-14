<script setup lang="ts">
const props = defineProps<{
  active?: boolean;
  disabled?: boolean;
}>();
</script>

<template>
  <button
    class="px-4 py-4 rounded-md text-sm flex items-center transition duration-300"
    :class="{
      'hover:bg-white border border-white text-gray-600': !props.active && !props.disabled,
      'pointer-events-none bg-gray-50 border-gray-50 text-gray-400': props.disabled,
      'bg-secondary hover:bg-secondary-light text-white': props.active,
    }"
    :disabled="disabled"
  >
    <slot></slot>
  </button>
</template>

<style scoped></style>
