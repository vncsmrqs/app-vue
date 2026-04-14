<script setup lang="ts">
import AppLink from '@/components/AppLink.vue';
import AppButton from '@/components/Buttons/AppButton.vue';
</script>

<template>
  <div class="w-full h-full flex flex-col justify-center items-center">
    Página inicial
    <app-link :to="{ name: 'home' }">
      <app-button type="primary" class="w-full">Ir para home</app-button>
    </app-link>
  </div>
</template>

<style scoped></style>
