<script setup lang="ts">
import AppBar from '@/components/AppBar.vue';
import ScreenRoot from '@/components/Screen/ScreenRoot.vue';
import EmptyScreen from '@/components/EmptyScreen.vue';
import { useAppStore } from '@/stores/app-store.ts';

const appStore = useAppStore();
</script>

<template>
  <screen-root>
    <template #header>
      <app-bar v-if="appStore.view === 'mobile'" :show-back-button="false">Favoritos</app-bar>
    </template>
    <empty-screen title="Favoritos" subtitle="Seus restaurantes favoritos ficarão aqui" />
  </screen-root>
</template>

<style scoped></style>
