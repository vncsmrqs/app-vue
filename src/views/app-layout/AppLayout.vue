<script setup lang="ts">
import { RouterView } from 'vue-router';
import MobileNavigation from '@/components/Mobile/MobileNavigation.vue';
import { isMobile } from '@/utils/device.ts';
import AppLink from '@/components/AppLink.vue';
import MenuIcon from 'vue-material-design-icons/Menu.vue';
</script>

<template>
  <div class="w-full h-full flex-auto flex flex-col overflow-hidden">
    <div v-if="!isMobile()" class="w-full bg-white border-b border-gray-200">
      <div class="lg:container mx-auto min-h-14 flex gap-4 py-4 relative">
        <app-link :to="{ name: 'home' }" v-slot="{ isActive }" class="font-medium">
          <span
            :class="{
              'text-blue-600': isActive,
            }"
          >
            Início
          </span>
        </app-link>
        <app-link :to="{ name: 'search' }" v-slot="{ isActive }" class="fon t-medium">
          <span
            :class="{
              'text-blue-600': isActive,
            }"
          >
            Busca
          </span>
        </app-link>
        <app-link :to="{ name: 'orders' }" v-slot="{ isActive }" class="font-medium">
          <span
            :class="{
              'text-blue-600': isActive,
            }"
          >
            Pedidos
          </span>
        </app-link>
        <app-link :to="{ name: 'menu' }" class="absolute right-0">
          <MenuIcon />
        </app-link>
      </div>
    </div>
    <div class="w-full flex-1 overflow-auto">
      <router-view />
    </div>
    <mobile-navigation />
  </div>
</template>

<style scoped></style>
