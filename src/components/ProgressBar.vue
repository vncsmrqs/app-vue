<script setup lang="ts">
const props = defineProps<{
  show: boolean;
  progress: number;
}>();
</script>

<template>
  <Teleport to="body">
    <div v-show="props.show" class="w-full h-1 bg-gray-100 fixed bottom-0" style="z-index: 999999">
      <div
        class="h-full bg-primary-gradient skeleton-box"
        style="transition: width 0.5s"
        :style="{ width: props.progress + '%' }"
      ></div>
    </div>
  </Teleport>
</template>

<style scoped>
.bg-primary-gradient {
  background: theme('colors.primary.gradient');
}
</style>
