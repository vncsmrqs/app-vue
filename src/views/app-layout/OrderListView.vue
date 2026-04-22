<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import AppLoadingAnimation from '@/components/AppLoadingAnimation.vue';
import ScreenRoot from '@/components/Screen/ScreenRoot.vue';
import AppBar from '@/components/AppBar.vue';
import EmptyScreen from '@/components/EmptyScreen.vue';
import { isMobile } from '@/utils/device.ts';
import ScreenListLayout from '@/components/Screen/ScreenListLayout.vue';
import AppLink from '@/components/AppLink.vue';
import { useRouter } from '@/router';
import { v6 as uuid } from 'uuid';

const router = useRouter();

const enabledRefresh = ref(false);

const orders = computed(() =>
  Array.from({ length: 0 }, (_, i) => i + 1).map((value) => ({
    id: uuid(),
    name: `Pedido ${value}`,
  })),
);

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
  <screen-list-layout>
    <template #default="{ hasChildren }">
      <screen-root
        @refresh="() => refresh(true)"
        :loading="isLoading"
        :pullToRefresh="isMobile() && enabledRefresh"
      >
        <template #header>
          <app-bar :show-back-button="!hasChildren" @back="router.back()">Meus pedidos</app-bar>
        </template>
        <div
          v-if="isLoading"
          class="w-full h-full flex flex-col justify-center items-center text-center gap-2"
        >
          <app-loading-animation />
        </div>
        <empty-screen
          v-else-if="!orders.length"
          title="Você ainda não pediu"
          subtitle="Que tal conhecer as melhores opções na sua região?"
        />
        <div v-else class="w-full h-full">
          <ul class="flex flex-col divide-y divide-gray-200">
            <app-link
              v-for="order in orders"
              :key="order.id"
              :to="{ name: 'order.detail', params: { orderId: order.id } }"
            >
              <li class="px-5 py-5 bg-gray-100">{{ order.name }}</li>
            </app-link>
          </ul>
        </div>
      </screen-root>
    </template>
    <template #empty>
      <empty-screen
        v-if="orders.length"
        title="Selecione um pedido"
        subtitle="Selecione um pedido ao lado para visualizar os detalhes"
      />
    </template>
  </screen-list-layout>
</template>

<style scoped></style>
