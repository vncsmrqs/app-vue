<script setup lang="ts">
import { isIosApp } from '@/utils/device.ts';
</script>

<template>
  <footer
    class="w-full shrink-0 border-t border-t-gray-100 flex justify-center px-5 py-3 flex-none relative"
    :class="{
      'pb-5': isIosApp(),
    }"
  >
    <slot></slot>
  </footer>
</template>

<style scoped></style>
