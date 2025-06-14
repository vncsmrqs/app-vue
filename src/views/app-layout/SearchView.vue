<script setup lang="ts">
import AppBar from '@/components/AppBar.vue';
import ScreenMain from '@/components/ScreenMain.vue';
import { isMobile } from '@/utils/device.ts';
</script>

<template>
  <main class="w-full h-full flex flex-col">
    <app-bar v-if="isMobile()" :show-back-button="false">Busca</app-bar>
    <screen-main :enabled="false" class="bg-gray-300">
      <div
        class="w-full min-h-full flex-auto grid grid-cols-2 auto-rows-min items-start p-5 gap-4 bg-white"
      >
        <div class="col-span-full font-medium">Categorias</div>
        <div v-for="i in 4" :key="i" class="bg-gray-100 rounded p-4">{{ i }}</div>
      </div>
    </screen-main>
  </main>
</template>

<style></style>
