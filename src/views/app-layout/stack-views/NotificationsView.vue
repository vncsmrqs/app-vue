<script setup lang="ts">
import { onMounted, ref } from 'vue';
import AppBar from '@/components/AppBar.vue';
import AppLoadingAnimation from '@/components/AppLoadingAnimation.vue';
import ScreenMain from '@/components/ScreenMain.vue';
import EmptyScreen from '@/components/EmptyScreen.vue';
import ScreenFooter from '@/components/ScreenFooter.vue';
import type { StackViewBaseEmitters, StackViewBaseProps } from '@/stores/stack-view-store.ts';
import ScreenRoot from '@/components/ScreenRoot.vue';
import AppButton from '@/components/Buttons/AppButton.vue';

const _props = defineProps<StackViewBaseProps>();
const emit = defineEmits<StackViewBaseEmitters>();

const enabledRefresh = ref(false);

const refresh = async (fromRefresh?: boolean) => {
  enabledRefresh.value = !!fromRefresh;
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
    enabledRefresh.value = true;
  }, 500);
};

const isLoading = ref(false);

onMounted(() => {
  refresh();
});
</script>

<template>
  <screen-root>
    <template #header>
      <app-bar @back="emit('close')">Notificações</app-bar>
    </template>
    <screen-main @refresh="() => refresh(true)" :loading="isLoading" :enabled="enabledRefresh">
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
    </screen-main>
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
