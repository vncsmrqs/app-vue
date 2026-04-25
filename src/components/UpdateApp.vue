<script setup lang="ts">
/// <reference types="vite-plugin-pwa/vue" />
import { useRegisterSW } from 'virtual:pwa-register/vue';
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { appConfig } from '@/config/app-config.ts';
import AppButton from '@/components/Buttons/AppButton.vue';
import { useRouter } from '@/router';
import BottomSheetStackView from '@/components/Stack/BottomSheetStackView.vue';
import ScreenFooter from '@/components/Screen/ScreenFooter.vue';
import { routerPendingAction } from '@/router/router-navigation-core.ts';

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
  unsubscribeBeforeResolve();
}

const startTimer = () => {
  if (needRefresh.value) {
    subscribeBeforeResolve();
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

let unsubscribeBeforeResolve: () => void = () => undefined;

const subscribeBeforeResolve = () => {
  unsubscribeBeforeResolve();
  unsubscribeBeforeResolve = router.beforeResolve(() => {
    if (needRefresh.value) {
      close();

      if (!routerPendingAction || ['BACKWARD'].includes(routerPendingAction)) {
        return false;
      }
    }
  });
};

onBeforeUnmount(() => {
  unsubscribeBeforeResolve();
});
</script>

<template>
  <BottomSheetStackView :show="needRefresh" @close="close" teleport-to="#medium-priority-target">
    <screen-footer>
      <div class="w-full flex flex-col sm:flex-row gap-2 items-center">
        <span class="w-full mb-2 sm:mb-0"> Uma nova versão do app está disponível </span>
        <app-button type="primary" class="w-full sm:w-auto" @click="updateNow">
          Atualizar agora ({{ formattedRemainingTime }}s)
        </app-button>
        <app-button class="w-full sm:w-auto" @click="close"> Deixar para mais tarde </app-button>
      </div>
    </screen-footer>
  </BottomSheetStackView>
</template>

<style></style>
