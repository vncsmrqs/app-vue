<script setup lang="ts">
import ScreenRoot from '@/components/ScreenRoot.vue';
import AppBar from '@/components/AppBar.vue';
import ScreenMain from '@/components/ScreenMain.vue';
import { isMobile } from '@/utils/device.ts';
</script>

<template>
  <screen-root>
    <template #header>
      <app-bar v-if="isMobile()" :show-back-button="false">Favoritos</app-bar>
    </template>
    <screen-main>Lista de restaurantes favoritos </screen-main>
  </screen-root>
</template>

<style scoped></style>
