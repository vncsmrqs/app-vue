<script setup lang="ts">
import { onMounted, ref } from 'vue';
import EmptyScreen from '@/components/EmptyScreen.vue';
import AppLoadingAnimation from '@/components/AppLoadingAnimation.vue';
import AppBar from '@/components/AppBar.vue';
import ScreenMain from '@/components/ScreenMain.vue';
import type { StackViewBaseEmitters, StackViewBaseProps } from '@/stores/stack-view-store.ts';
import ScreenFooter from '@/components/ScreenFooter.vue';

const props = defineProps<StackViewBaseProps>();
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
  <div class="w-full h-full flex flex-col bg-white">
    <app-bar @back="emit('close')">Endereços</app-bar>
    <screen-main @refresh="() => refresh(true)" :loading="isLoading" :enabled="enabledRefresh">
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
    </screen-main>
    <screen-footer>
      <button class="" @click="emit('close')">Fechar</button>
    </screen-footer>
  </div>
</template>

<style scoped></style>
