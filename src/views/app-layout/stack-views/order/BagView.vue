<script setup lang="ts">
import AppBar from '@/components/AppBar.vue';
import ScreenMain from '@/components/ScreenMain.vue';
import EmptyScreen from '@/components/EmptyScreen.vue';
import type { StackViewBaseEmitters, StackViewBaseProps } from '@/stores/stack-view-store.ts';
import AppButton from '@/components/Buttons/AppButton.vue';
import ScreenFooter from '@/components/ScreenFooter.vue';
import ArrowRightIcon from 'vue-material-design-icons/ArrowRight.vue';
import AppLink from '@/components/AppLink.vue';

const _props = defineProps<StackViewBaseProps>();
const emit = defineEmits<StackViewBaseEmitters>();
</script>

<template>
  <div class="w-full h-full flex flex-col">
    <app-bar @back="emit('close')">
      Sacola
      <template #append>
        <app-button type="transparent-secondary" size="sm" class="last:-mr-2">Limpar</app-button>
      </template>
    </app-bar>
    <screen-main :enabled="false">
      <empty-screen
        title="Sua sacola está vazia"
        subtitle="Adicione items para realizar um pedido"
      />
    </screen-main>
    <screen-footer>
      <app-link :to="{ name: 'order.delivery-mode' }" class="w-full" v-slot="navigate">
        <app-button type="primary" size="lg" class="w-full flex gap-2" @click="navigate">
          Continuar
          <ArrowRightIcon />
        </app-button>
      </app-link>
    </screen-footer>
  </div>
</template>

<style scoped></style>
