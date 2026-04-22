<script setup lang="ts">
import AppBar from '@/components/AppBar.vue';
import ScreenRoot from '@/components/Screen/ScreenRoot.vue';
import { useAppStore } from '@/stores/app-store.ts';

const appStore = useAppStore();
</script>

<template>
  <screen-root :pullToRefresh="false">
    <template #header>
      <app-bar v-if="appStore.view === 'mobile'" :show-back-button="false">Busca</app-bar>
    </template>
    <div
      class="lg:container w-full min-h-full mx-auto flex-auto grid grid-cols-2 auto-rows-min items-start p-2 lg:p-0 gap-4"
    >
      <div class="col-span-full font-medium">Categorias</div>
      <div v-for="i in 4" :key="i" class="bg-white shadow rounded p-4">{{ i }}</div>
    </div>
  </screen-root>
</template>

<style></style>
