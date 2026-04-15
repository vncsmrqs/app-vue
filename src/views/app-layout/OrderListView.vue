<script setup lang="ts">
import { onMounted, ref } from 'vue';
import AppLoadingAnimation from '@/components/AppLoadingAnimation.vue';
import ScreenRoot from '@/components/ScreenRoot.vue';
import AppBar from '@/components/AppBar.vue';
import EmptyScreen from '@/components/EmptyScreen.vue';
import { isMobile } from '@/utils/device.ts';

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
  <screen-root
    @refresh="() => refresh(true)"
    :loading="isLoading"
    :pullToRefresh="isMobile() && enabledRefresh"
    class="bg-gray-200"
  >
    <template #header>
      <app-bar v-if="isMobile()" :show-back-button="false">Meus pedidos</app-bar>
    </template>
    <div class="w-full min-h-full flex-auto bg-white flex">
      <div class="flex-auto lg:container mx-auto flex flex-col">
        <div class="hidden lg:block text-3xl font-semibold">Meus pedidos</div>
        <div
          v-if="isLoading"
          class="w-full h-full flex flex-col justify-center items-center text-center gap-2"
        >
          <app-loading-animation />
        </div>
        <empty-screen
          v-else
          title="Seus pedidos realizados ficarão aqui"
          subtitle="Assim, você poderá consultar seu histórico de pedidos e até refazer alguns deles"
        />
      </div>
    </div>
  </screen-root>
</template>

<style scoped></style>
