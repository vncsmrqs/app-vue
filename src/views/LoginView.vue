<script setup lang="ts">
import { useRouter } from '@/router';
import AppBar from '@/components/AppBar.vue';

const router = useRouter();
</script>

<template>
  <div>
    <app-bar @back="router.back()">Entrar</app-bar>
    Página de login
  </div>
</template>

<style scoped></style>
