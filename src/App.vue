<script setup lang="ts">
import { RouterView } from 'vue-router';
import RenderStackView from '@/components/Stack/RenderStackView.vue';
import { onMounted, onUnmounted } from 'vue';
import { useAppStore } from '@/stores/app-store.ts';
import { changeThemeColor, updateThemeColor } from '@/utils/common.ts';
import UpdateApp from '@/components/UpdateApp.vue';
import { useRouter } from '@/router';
import { onAfterRouterNavigate } from '@/router/on-after-router-navigate.ts';
import { PUSH_HISTORY_STATE } from '@/config/stack-view-config.ts';
import AppSplashScreen from '@/components/AppSplashScreen.vue';
import AppProgressBar from '@/components/AppProgressBar.vue';

const appStore = useAppStore();

const router = useRouter();

const handleServiceWorkerMessage = (event: MessageEvent) => {
  if (event.data?.type === 'NAVIGATE') {
    router.push(event.data.path);
  }
};

onMounted(async () => {
  await Notification.requestPermission();

  changeThemeColor('#FFFFFF');
  updateThemeColor();

  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', () => updateThemeColor());

  navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);
});

onUnmounted(() => {
  navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
});

onAfterRouterNavigate(({ to }) => {
  if (!PUSH_HISTORY_STATE) {
    window.history.replaceState({}, '', to.fullPath);
  }
});
</script>

<template>
  <teleport to="body">
    <div id="low-priority-target" class="absolute" style="z-index: 9991"></div>
    <div id="medium-priority-target" class="absolute" style="z-index: 9992"></div>
    <div id="high-priority-target" class="absolute" style="z-index: 9993"></div>
  </teleport>
  <template v-if="appStore.appError">
    <div
      class="w-full h-full flex flex-col justify-center items-center text-center gap-2 bg-red-100 text-red-500"
    >
      <div>Error</div>
      <div>{{ appStore.appError }}</div>
    </div>
  </template>
  <template v-else-if="!appStore.appLoading">
    <div
      class="w-full h-full"
      v-bind="{
        ...(appStore.tabCount > 0
          ? {
              tabindex: -1,
              'aria-hidden': true,
              inert: true,
            }
          : {}),
      }"
    >
      <router-view />
    </div>
    <render-stack-view />
  </template>
  <update-app />
  <teleport to="#high-priority-target">
    <transition name="fade-splash" mode="out-in">
      <app-splash-screen v-show="appStore.isResizing" />
    </transition>
    <app-progress-bar
      :show="appStore.showNavigationLoading"
      :progress="appStore.navigationLoadingProgress"
    />
  </teleport>
</template>

<style scoped></style>
