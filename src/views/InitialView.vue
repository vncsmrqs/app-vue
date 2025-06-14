<script setup lang="ts">
import AppLink from '@/components/AppLink.vue';
</script>

<template>
  <div class="w-full h-full flex flex-col justify-center items-center">
    Página inicial
    <app-link :to="{ name: 'home' }">
      <button class="w-full h-14 bg-gray-100 rounded-xl cursor-pointer px-4">Ir para home</button>
    </app-link>
  </div>
</template>

<style scoped></style>
