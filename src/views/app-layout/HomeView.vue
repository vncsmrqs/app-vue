<script setup lang="ts">
import { onMounted, ref } from 'vue';
import AppLink from '@/components/AppLink.vue';
import { v6 as uuid } from 'uuid';
import MobileHomeBar from '@/components/Mobile/MobileHomeBar.vue';
import ScreenMain from '@/components/ScreenMain.vue';
import { isMobile } from '@/utils/device.ts';
import ScreenRoot from '@/components/ScreenRoot.vue';
import { useRoute, useVirtualRoute } from '@/router';

const route = useRoute();
const virtualRoute = useVirtualRoute();

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
  <screen-root>
    <template #header>
      <mobile-home-bar />
    </template>
    <screen-main
      :swipe-content="true"
      :enabled="isMobile()"
      :loading="isLoading"
      @refresh="() => refresh(true)"
    >
      <div class="w-full min-h-full flex-auto flex">
        <div class="flex-auto lg:container mx-auto flex flex-col">
          <div>ROUTE: {{ route.name }}</div>
          <div>VIRTUAL ROUTE: {{ virtualRoute.name }}</div>
          <app-link :to="{ name: 'fixed' }"> Fixo </app-link>
          <app-link :to="{ name: 'modal' }"> Modal </app-link>
          <app-link :to="{ name: 'bottom' }"> Bottom </app-link>
          <app-link :to="{ name: 'merchant', params: { merchantId: uuid() } }"> Mercado </app-link>
        </div>
      </div>
    </screen-main>
  </screen-root>
</template>
