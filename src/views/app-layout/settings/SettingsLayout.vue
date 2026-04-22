<script setup lang="ts">
import ScreenRoot from '@/components/Screen/ScreenRoot.vue';
import AppBar from '@/components/AppBar.vue';
import EmptyScreen from '@/components/EmptyScreen.vue';
import AppLink from '@/components/AppLink.vue';
import { useRouter } from '@/router';
import ScreenListLayout from '@/components/Screen/ScreenListLayout.vue';

const router = useRouter();
</script>

<template>
  <screen-list-layout>
    <template #default="{ hasChildren }">
      <screen-root>
        <template #header>
          <app-bar :show-back-button="!hasChildren" @back="router.back()">Settings</app-bar>
        </template>
        <div class="w-full h-full">
          <ul class="flex flex-col divide-y divide-gray-200">
            <app-link :to="{ name: 'settings.account' }">
              <li class="px-5 py-5 bg-gray-100">Account</li>
            </app-link>
            <app-link :to="{ name: 'settings.profile' }">
              <li class="px-5 py-5 bg-gray-100">Profile</li>
            </app-link>
          </ul>
        </div>
      </screen-root>
    </template>

    <template #empty>
      <empty-screen
        title="Selecione uma configuração"
        subtitle="Selecione uma opção ao lado para configurar"
      />
    </template>
  </screen-list-layout>
</template>

<style scoped></style>
