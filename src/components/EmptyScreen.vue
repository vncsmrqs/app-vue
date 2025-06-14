<script setup lang="ts">
const props = defineProps<{
  title: string;
  subtitle: string;
}>();
</script>

<template>
  <div class="w-full h-full flex flex-col justify-center items-center text-center gap-2">
    <div class="flex flex-col text-center"></div>
    <span class="font-medium">{{ props.title }}</span>
    <span class="text-sm max-w-3/5 text-gray-500">
      {{ props.subtitle }}
    </span>
  </div>
</template>

<style scoped></style>
