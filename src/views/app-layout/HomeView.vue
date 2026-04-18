<script setup lang="ts">
import { onMounted, ref } from 'vue';
import AppLink from '@/components/AppLink.vue';
import { v6 as uuid } from 'uuid';
import MobileHomeBar from '@/components/Mobile/MobileHomeBar.vue';
import ScreenRoot from '@/components/ScreenRoot.vue';
import { isMobile } from '@/utils/device.ts';
import { useRoute, useVirtualRoute } from '@/router';
import AppButton from '@/components/Buttons/AppButton.vue';

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
  <screen-root
    :swipe-content="true"
    :pullToRefresh="isMobile()"
    :loading="isLoading"
    @refresh="() => refresh(true)"
  >
    <template #header>
      <mobile-home-bar />
    </template>
    <div>
      <div class="w-full min-h-full flex-auto flex">
        <div class="flex-auto lg:container mx-auto flex flex-col">
          <div>ROUTE: {{ route.name }}</div>
          <div>VIRTUAL ROUTE: {{ virtualRoute.name }}</div>
          <app-link :to="{ name: 'fixed' }"> Fixo </app-link>
          <app-link :to="{ name: 'modal' }"> Modal </app-link>
          <app-link :to="{ name: 'bottom' }"> Bottom </app-link>
          <app-link :to="{ name: 'merchant', params: { merchantId: uuid() } }"> Mercado </app-link>
          <app-link
            class="w-full"
            :to="{
              name: 'merchant.product',
              params: { merchantId: uuid(), productId: uuid() },
            }"
          >
            <app-button type="primary" class="w-full">Ver produto</app-button>
          </app-link>
        </div>
      </div>
    </div>
  </screen-root>
</template>
