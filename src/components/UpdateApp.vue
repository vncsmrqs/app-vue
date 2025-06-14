<script setup lang="ts">
/// <reference types="vite-plugin-pwa/vue" />
import { useRegisterSW } from 'virtual:pwa-register/vue';
import { computed, ref, watch } from 'vue';
import { appConfig } from '../../config/app-config.ts';

const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW({
  immediate: appConfig.pwa.autoUpdate,
});

let interval: NodeJS.Timeout | undefined;
const remainingTime = ref(30);
const formattedRemainingTime = computed(() => Math.ceil(remainingTime.value));

async function close() {
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

const updateNow = () => {
  clearInterval(interval);
  updateServiceWorker(true);
  close();
};

watch(() => needRefresh.value, startTimer);
</script>

<template>
  <div v-if="needRefresh" class="w-full fixed top-0 right-0 z-50 p-4 flex justify-end" role="alert">
    <div
      class="w-full max-w-[600px] p-3 bg-white rounded-lg border border-gray-300 shadow-lg flex flex-col gap-2"
    >
      <span class="font-bold uppercase">
        Uma atualização do app está disponível ({{ appConfig.version }})
      </span>
      <span>Atualizando automaticamente em {{ formattedRemainingTime }} segundos</span>
      <div class="flex gap-2 mt-2">
        <button
          class="border border-gray-300 outline-none rounded py-2 px-4 bg-white"
          @click="updateNow"
        >
          Atualizar agora
        </button>
        <button
          class="border border-gray-300 outline-none rounded py-2 px-4 bg-gray-200"
          @click="close"
        >
          Deixar para depois
        </button>
      </div>
    </div>
  </div>
</template>

<style></style>
