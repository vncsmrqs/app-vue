<script setup lang="ts">
import { onMounted, ref } from 'vue';
import EmptyScreen from '@/components/EmptyScreen.vue';
import AppLoadingAnimation from '@/components/AppLoadingAnimation.vue';
import AppBar from '@/components/AppBar.vue';
import ScreenRoot from '@/components/ScreenRoot.vue';
import type { StackViewBaseEmitters, StackViewBaseProps } from '@/stores/stack-view-store.ts';
import ScreenFooter from '@/components/ScreenFooter.vue';
import AppButton from '@/components/Buttons/AppButton.vue';

const _props = defineProps<StackViewBaseProps>();
const emit = defineEmits<StackViewBaseEmitters>();

const enabledRefresh = ref(true);

const refresh = async (fromRefresh?: boolean) => {
  enabledRefresh.value = !!fromRefresh;
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
    enabledRefresh.value = true;
  }, 10000);
};

const isLoading = ref(false);

onMounted(() => {
  // refresh();
});
</script>

<template>
  <screen-root @refresh="() => refresh(true)" :loading="isLoading" :pullToRefresh="enabledRefresh">
    <template #header>
      <app-bar @back="emit('close')">Endereços</app-bar>
    </template>
    <div
      v-if="isLoading"
      class="w-full h-full flex flex-col justify-center items-center text-center gap-2"
    >
      <app-loading-animation />
    </div>
    <empty-screen
      v-else
      title="Nenhum endereço cadastrado"
      subtitle="Cadastre um endereço para ver as opções mais perto de você"
    />
    <template #footer>
      <screen-footer>
        <app-button type="primary" @click="emit('close')" class="w-full">Fechar</app-button>
      </screen-footer>
    </template>
  </screen-root>
</template>

<style scoped></style>
