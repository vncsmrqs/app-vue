<script setup lang="ts">
import AppLink from '@/components/AppLink.vue';
import { v6 as uuid } from 'uuid';
import { onMounted } from 'vue';
import { useRoute } from '@/router';

const route = useRoute();

const { params } = route;

onMounted(() => console.log('merchantId: ' + params.merchantId));
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
