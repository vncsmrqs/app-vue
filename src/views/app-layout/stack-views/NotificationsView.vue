<script setup lang="ts">
import { onMounted, ref } from 'vue';
import AppBar from '@/components/AppBar.vue';
import AppLoadingAnimation from '@/components/AppLoadingAnimation.vue';
import ScreenRoot from '@/components/ScreenRoot.vue';
import EmptyScreen from '@/components/EmptyScreen.vue';
import ScreenFooter from '@/components/ScreenFooter.vue';
import type { StackViewBaseEmitters, StackViewBaseProps } from '@/stores/stack-view-store.ts';
import AppButton from '@/components/Buttons/AppButton.vue';
import { timeout } from '@/utils';
import { notifySW } from '@/utils/service-worker.ts';

const _props = defineProps<StackViewBaseProps>();
const emit = defineEmits<StackViewBaseEmitters>();

const enabledRefresh = ref(false);

const refresh = async (fromRefresh?: boolean) => {
  enabledRefresh.value = !!fromRefresh;
  await load();
};

const isLoading = ref(false);

const load = async () => {
  isLoading.value = true;
  await timeout(1000);
  isLoading.value = false;
  enabledRefresh.value = true;

  await notifySW({
    title: 'Seu pedido está pronto!',
    body: 'TESTE',
    data: {
      path: '/app/orders',
    },
  });
};

onMounted(() => {
  refresh();
});
</script>

<template>
  <screen-root @refresh="() => refresh(true)" :loading="isLoading" :pullToRefresh="enabledRefresh">
    <template #header>
      <app-bar @back="emit('close')">Notificações</app-bar>
    </template>
    <div
      v-if="isLoading"
      class="w-full h-full flex flex-col justify-center items-center text-center gap-2"
    >
      <app-loading-animation />
    </div>
    <empty-screen
      v-else
      title="Sem novidades por enquanto"
      subtitle=" Quando uma notificação chegar, ela vai ficar aqui"
    />
    <template #footer>
      <screen-footer>
        <div class="w-full flex flex-col gap-4">
          <app-button type="primary" @click="emit('close')" class="w-full"> Voltar </app-button>
        </div>
      </screen-footer>
    </template>
  </screen-root>
</template>

<style scoped></style>
