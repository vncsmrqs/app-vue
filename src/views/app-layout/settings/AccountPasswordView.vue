<script setup lang="ts">
import ScreenRoot from '@/components/ScreenRoot.vue';
import AppBar from '@/components/AppBar.vue';
import { useRouter } from '@/router';
import EmptyScreen from '@/components/EmptyScreen.vue';

const router = useRouter();
</script>

<template>
  <screen-root>
    <template #header>
      <app-bar @back="router.back()">Password</app-bar>
    </template>
    <empty-screen title="Password" subtitle="Altere sua senha" />
  </screen-root>
</template>

<style scoped></style>
