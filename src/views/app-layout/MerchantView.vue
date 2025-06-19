<script setup lang="ts">
import AppLink from '@/components/AppLink.vue';
import { v6 as uuid } from 'uuid';
import { useRoute } from '@/router';

const route = useRoute();

const { params } = route;
</script>

<template>
  <main class="flex flex-col">
    Estabelecimento - {{ params.merchantId }}
    <app-link
      :to="{
        name: 'merchant.product',
        params: { merchantId: params.merchantId, productId: uuid() },
      }"
    >
      Ver produto
    </app-link>
  </main>
</template>

<style scoped></style>
