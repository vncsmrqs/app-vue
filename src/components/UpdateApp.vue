<script setup lang="ts">
/// <reference types="vite-plugin-pwa/vue" />
import { useRegisterSW } from 'virtual:pwa-register/vue';
import { computed, onMounted, ref, watch } from 'vue';
import { appConfig } from '@/config/app-config.ts';
import AppButton from '@/components/Buttons/AppButton.vue';
import { useRouter } from '@/router';

const router = useRouter();

const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW({
  immediate: appConfig.pwa.autoUpdate,
});

let interval: NodeJS.Timeout | undefined;
const remainingTime = ref(30);
const formattedRemainingTime = computed(() => Math.ceil(remainingTime.value));

function close() {
  clearInterval(interval);
  offlineReady.value = false;
  needRefresh.value = false;
}

const startTimer = () => {
  if (needRefresh.value) {
    clearInterval(interval);
    interval = setInterval(() => {
      remainingTime.value = remainingTime.value - 0.01;
      if (remainingTime.value <= 0) {
        updateNow();
      }
    }, 10);
  }
};

const updateNow = async () => {
  clearInterval(interval);
  await updateServiceWorker(true);
  close();
};

watch(() => needRefresh.value, startTimer);

onMounted(() => {
  setTimeout(() => (needRefresh.value = true), 1000);
  router.beforeResolve(() => {
    if (needRefresh.value) {
      close();
      return false;
    }
    return true;
  });
});
</script>

<template>
  <Teleport to="#toast-target">
    <Transition name="fade">
      <div
        v-show="needRefresh"
        class="bg-black/25 w-dvw h-dvh fixed top-0 left-0"
        @click="close"
      ></div>
    </Transition>
    <Transition name="slide-up">
      <div
        v-if="needRefresh"
        class="w-full fixed bottom-0 right-0 z-10 flex justify-end"
        role="alert"
      >
        <div class="w-full px-5 py-4 bg-white flex flex-col sm:flex-row gap-2 items-center">
          <span class="font-semibold w-full mb-2 sm:mb-0">Atualização disponível</span>
          <AppButton type="primary" class="w-full sm:w-auto" @click="updateNow">
            Atualizar ({{ formattedRemainingTime }})
          </AppButton>
          <AppButton class="w-full sm:w-auto" @click="close"> Mais tarde </AppButton>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style></style>
