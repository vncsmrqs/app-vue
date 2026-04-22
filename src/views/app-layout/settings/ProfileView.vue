<script setup lang="ts">
import ScreenRoot from '@/components/Screen/ScreenRoot.vue';
import AppBar from '@/components/AppBar.vue';
import { useRouter } from '@/router';
import EmptyScreen from '@/components/EmptyScreen.vue';

const router = useRouter();
</script>

<template>
  <screen-root>
    <template #header>
      <app-bar @back="router.back()">Profile</app-bar>
    </template>
    <empty-screen title="Profile" subtitle="Altere seu perfil" />
  </screen-root>
</template>

<style scoped></style>
