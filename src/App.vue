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

  appStore.startNavigationLoading();

  setTimeout(() => {
    appStore.endNavigationLoading();
  }, 5000);
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
    <div id="stack-view-target" class="absolute" style="z-index: 9991"></div>
    <div id="popper-target" class="absolute" style="z-index: 9992"></div>
    <div id="toast-target" class="absolute" style="z-index: 9993"></div>
    <div id="full-target" class="absolute" style="z-index: 9993"></div>
  </teleport>
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
  <update-app />
  <teleport to="#full-target">
    <Transition name="fade-splash" mode="out-in">
      <app-splash-screen v-show="appStore.isResizing || appStore.appLoading" />
    </Transition>
  </teleport>
  <app-progress-bar
    :show="appStore.showNavigationLoading"
    :progress="appStore.navigationLoadingProgress"
  />
</template>

<style scoped></style>
