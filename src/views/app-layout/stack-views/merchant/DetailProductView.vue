<script setup lang="ts">
import AppLink from '@/components/AppLink.vue';
import { useRoute } from '@/router';

const props = defineProps<{
  merchantId: string;
  productId: string;
}>();

const route = useRoute();
const params = route.params;
</script>

<template>
  <div class="flex flex-col">
    Detalhes do produto
    <app-link :to="{ name: 'menu' }">Menu</app-link>
    <div>merchantId: {{ params.merchantId }}</div>
    <div>productId: {{ params.productId }}</div>
  </div>
</template>

<style scoped></style>
