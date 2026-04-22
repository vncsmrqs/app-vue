<script setup lang="ts">
import AppLink from '@/components/AppLink.vue';
import { useRoute } from '@/router';
import ScreenRoot from '@/components/Screen/ScreenRoot.vue';
import AppBar from '@/components/AppBar.vue';
import type { StackViewBaseEmitters, StackViewBaseProps } from '@/stores/stack-view-store.ts';

const props = defineProps<
  StackViewBaseProps & {
    merchantId: string;
    productId: string;
  }
>();
const emit = defineEmits<StackViewBaseEmitters>();

const route = useRoute();
</script>

<template>
  <screen-root>
    <app-bar @back="emit('close')">Nome do produto</app-bar>
    <app-link :to="{ name: 'menu' }">Menu</app-link>
    <div>params</div>
    <div>merchantId: {{ route.params.merchantId }}</div>
    <div>productId: {{ route.params.productId }}</div>

    <div>props</div>
    <div>merchantId: {{ props.merchantId }}</div>
    <div>productId: {{ props.productId }}</div>
  </screen-root>
</template>

<style scoped></style>
