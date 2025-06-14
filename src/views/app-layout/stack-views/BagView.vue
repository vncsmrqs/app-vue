<script setup lang="ts">
import AppBar from '@/components/AppBar.vue';
import ScreenMain from '@/components/ScreenMain.vue';
import EmptyScreen from '@/components/EmptyScreen.vue';
import type { StackViewBaseEmitters, StackViewBaseProps } from '@/stores/stack-view-store.ts';

const props = defineProps<StackViewBaseProps>();
const emit = defineEmits<StackViewBaseEmitters>();
</script>

<template>
  <div class="w-full h-full flex flex-col">
    <app-bar @back="emit('close')">
      Sacola
      <template #append>
        <button>Limpar</button>
      </template>
    </app-bar>
    <screen-main :enabled="false">
      <empty-screen
        title="Sua sacola está vazia"
        subtitle="Adicione items para realizar um pedido"
      />
    </screen-main>
  </div>
</template>

<style scoped></style>
