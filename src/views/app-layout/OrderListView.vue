<script setup lang="ts">
import { onMounted, ref } from 'vue';
import AppLoadingAnimation from '@/components/AppLoadingAnimation.vue';
import ScreenMain from '@/components/ScreenMain.vue';
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
  <div class="w-full h-full flex flex-col">
    <app-bar :show-back-button="false" class="lg:hidden">Meus pedidos</app-bar>
    <screen-main
      @refresh="() => refresh(true)"
      :loading="isLoading"
      :enabled="isMobile() && enabledRefresh"
      class="bg-gray-200"
    >
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
    </screen-main>
  </div>
</template>

<style scoped></style>
