<script setup lang="ts">
import AppBar from '@/components/AppBar.vue';
import ScreenRoot from '@/components/Screen/ScreenRoot.vue';
import EmptyScreen from '@/components/EmptyScreen.vue';
import { useRouter } from '@/router';

const props = defineProps<{
  orderId: string;
}>();

const router = useRouter();
</script>

<template>
  <div class="w-full h-full flex flex-col">
    <screen-root :pullToRefresh="false">
      <template #header>
        <app-bar @back="router.back()">Pedido {{ props.orderId }}</app-bar>
      </template>
      <empty-screen title="Em breve" subtitle="Detalhes do pedido" />
    </screen-root>
  </div>
</template>

<style scoped></style>
