<script setup lang="ts">
import AppLink from '@/components/AppLink.vue';
import { v6 as uuid } from 'uuid';
import ScreenRoot from '@/components/ScreenRoot.vue';
import AppBar from '@/components/AppBar.vue';
import AppButton from '@/components/Buttons/AppButton.vue';
import ScreenFooter from '@/components/ScreenFooter.vue';

const props = defineProps<{
  merchantId: string;
}>();
</script>

<template>
  <screen-root>
    <template #header>
      <app-bar :show-back-button="false">Estabelecimento</app-bar>
    </template>
    <div class="w-full h-full px-5">Estabelecimento - {{ props.merchantId }}</div>
    <template #footer>
      <screen-footer>
        <app-link
          class="w-full"
          :to="{
            name: 'merchant.product',
            params: { merchantId: props.merchantId, productId: uuid() },
          }"
        >
          <app-button type="primary" class="w-full">Ver produto</app-button>
        </app-link>
      </screen-footer>
    </template>
  </screen-root>
</template>

<style scoped></style>
