<script setup lang="ts">
import { onMounted, ref } from 'vue';
import AppLink from '@/components/AppLink.vue';
import { v6 as uuid } from 'uuid';
import MobileHomeBar from '@/components/Mobile/MobileHomeBar.vue';
import ScreenMain from '@/components/ScreenMain.vue';
import { isMobile } from '@/utils/device.ts';

const enabledRefresh = ref(false);

const refresh = async (fromRefresh?: boolean) => {
  enabledRefresh.value = !!fromRefresh;
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
    enabledRefresh.value = true;
  }, 5000);
};

const isLoading = ref(false);

onMounted(() => {
  // refresh();
});
</script>

<template>
  <div class="w-full h-full flex flex-col">
    <mobile-home-bar />
    <screen-main
      :swipe-content="true"
      :enabled="isMobile()"
      :loading="isLoading"
      @refresh="() => refresh(true)"
      class="bg-gray-200"
    >
      <div class="w-full min-h-full flex-auto bg-white flex">
        <div class="flex-auto lg:container mx-auto flex flex-col">
          <app-link :to="{ name: 'fixed' }"> Fixo </app-link>
          <app-link :to="{ name: 'merchant', params: { merchantId: uuid() } }"> Mercado </app-link>
        </div>
      </div>
    </screen-main>
  </div>
</template>
