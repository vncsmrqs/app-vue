<script setup lang="ts">
import AppBar from '@/components/AppBar.vue';
import ScreenRoot from '@/components/Screen/ScreenRoot.vue';
import { isMobile } from '@/utils/device.ts';
import EmptyScreen from '@/components/EmptyScreen.vue';
</script>

<template>
  <screen-root>
    <template #header>
      <app-bar v-if="isMobile()" :show-back-button="false">Favoritos</app-bar>
    </template>
    <empty-screen title="Favoritos" subtitle="Seus restaurantes favoritos ficarão aqui" />
  </screen-root>
</template>

<style scoped></style>
