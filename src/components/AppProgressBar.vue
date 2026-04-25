<script setup lang="ts">
const props = defineProps<{
  show: boolean;
  progress: number;
}>();
</script>

<template>
  <div v-show="props.show" class="w-full h-1 bg-gray-100 fixed top-0" style="z-index: 1">
    <div
      class="h-full bg-fuchsia-700 skeleton-box"
      style="transition: width 0.5s"
      :style="{ width: props.progress + '%' }"
    ></div>
  </div>
</template>

<style scoped>
.bg-primary-gradient {
  background: var(--background-image-primary-gradient);
}
</style>
