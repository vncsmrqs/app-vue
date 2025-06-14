<script setup lang="ts">
  const props = defineProps<{ active: boolean }>();
</script>

<template>
  <button
    class="p-3 font-medium border-b-2 relative"
    :class="{
      'border-primary-600 text-primary-600': props.active,
      'text-neutral-500': !props.active,
    }"
  >
    <slot></slot>
  </button>
</template>

<style scoped></style>
