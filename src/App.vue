<script setup lang="ts">
import { RouterView } from 'vue-router';
import RenderStackView from '@/components/Stack/RenderStackView.vue';
import { onMounted } from 'vue';
import { useAppStore } from '@/stores/app-store.ts';
import { updateThemeColor } from '@/utils/common.ts';
import UpdateApp from '@/components/UpdateApp.vue';

const appStore = useAppStore();

onMounted(async () => {
  await Notification.requestPermission();

  // updateThemeColor();
  //
  // window
  //   .matchMedia('(prefers-color-scheme: dark)')
  //   .addEventListener('change', () => updateThemeColor());
});
</script>

<template>
  <router-view />
  <teleport to="body">
    <div id="stack-view-target" class="absolute" style="z-index: 9991"></div>
    <div id="popper-target" class="absolute" style="z-index: 9992"></div>
    <div id="toast-target" class="absolute" style="z-index: 9993"></div>
  </teleport>
  <render-stack-view />
  <update-app />
</template>

<style scoped></style>
