<script setup lang="ts">
import AppBar from '@/components/AppBar.vue';
import ScreenMain from '@/components/ScreenMain.vue';
import { isMobile } from '@/utils/device.ts';
import ScreenRoot from '@/components/ScreenRoot.vue';
</script>

<template>
  <screen-root>
    <template #header>
      <app-bar v-if="isMobile()" :show-back-button="false">Busca</app-bar>
    </template>
    <screen-main :enabled="false">
      <div class="w-full min-h-full flex-auto grid grid-cols-2 auto-rows-min items-start p-5 gap-4">
        <div class="col-span-full font-medium">Categorias</div>
        <div v-for="i in 4" :key="i" class="bg-white shadow rounded p-4">{{ i }}</div>
      </div>
    </screen-main>
  </screen-root>
</template>

<style></style>
