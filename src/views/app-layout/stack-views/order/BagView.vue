<script setup lang="ts">
import AppBar from '@/components/AppBar.vue';
import ScreenRoot from '@/components/Screen/ScreenRoot.vue';
import EmptyScreen from '@/components/EmptyScreen.vue';
import type { StackViewBaseEmitters, StackViewBaseProps } from '@/stores/stack-view-store.ts';
import AppButton from '@/components/Buttons/AppButton.vue';
import ScreenFooter from '@/components/Screen/ScreenFooter.vue';
import ArrowRightIcon from 'vue-material-design-icons/ArrowRight.vue';
import AppLink from '@/components/AppLink.vue';

const _props = defineProps<StackViewBaseProps>();
const emit = defineEmits<StackViewBaseEmitters>();
</script>

<template>
  <screen-root :pullToRefresh="false">
    <app-bar @back="emit('close')">
      Sacola
      <template #append>
        <app-button type="transparent-secondary" size="sm" class="last:-mr-2">Limpar</app-button>
      </template>
    </app-bar>
    <empty-screen title="Sua sacola está vazia" subtitle="Adicione items para realizar um pedido" />
  </screen-root>
  <screen-footer>
    <app-link custom :to="{ name: 'order.delivery-mode' }" class="w-full" v-slot="{ navigate }">
      <app-button type="primary" size="lg" class="w-full flex gap-2" @click="navigate">
        Continuar
        <ArrowRightIcon />
      </app-button>
    </app-link>
  </screen-footer>
</template>

<style scoped></style>
