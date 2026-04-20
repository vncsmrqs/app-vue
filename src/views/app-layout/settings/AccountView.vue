<script setup lang="ts">
import ScreenRoot from '@/components/ScreenRoot.vue';
import AppBar from '@/components/AppBar.vue';
import AppLink from '@/components/AppLink.vue';
import { useRouter } from '@/router';

const router = useRouter();
</script>

<template>
  <screen-root>
    <template #header>
      <app-bar @back="router.back()">Account</app-bar>
    </template>
    <div class="w-full h-full">
      <ul class="flex flex-col divide-y divide-gray-200">
        <app-link :to="{ name: 'settings.account.password' }">
          <li class="px-5 py-5">Password</li>
        </app-link>
      </ul>
    </div>
  </screen-root>
</template>

<style scoped></style>
