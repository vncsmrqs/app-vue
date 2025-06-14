<script setup lang="ts">
import HomeOutlineIcon from 'vue-material-design-icons/HomeOutline.vue';
import AccountOutlineIcon from 'vue-material-design-icons/AccountOutline.vue';
import MagnifyIcon from 'vue-material-design-icons/Magnify.vue';
import TextBoxOutlineIcon from 'vue-material-design-icons/TextBoxOutline.vue';
import TextBoxIcon from 'vue-material-design-icons/TextBox.vue';
import MenuIcon from 'vue-material-design-icons/Menu.vue';
import HomeIcon from 'vue-material-design-icons/Home.vue';
import { useAuthStore } from '@/stores/auth-store';
import MobileNavigationItem from '@/components/Mobile/MobileNavigationItem.vue';
import AppLink from '@/components/AppLink.vue';
import { isMobile, isMobileApp } from '@/utils/device.ts';
const authStore = useAuthStore();
</script>

<template>
  <nav
    v-if="isMobile()"
    class="w-full z-50 bg-white flex justify-around drop-shadow-2xl"
    :class="{ 'pb-5': isMobileApp() }"
  >
    <app-link :to="{ name: 'home' }" v-slot="{ isActive }">
      <MobileNavigationItem title="Início" :active="isActive">
        <template #icon>
          <HomeIcon v-if="isActive" :size="24"></HomeIcon>
          <HomeOutlineIcon v-else :size="24"></HomeOutlineIcon>
        </template>
      </MobileNavigationItem>
    </app-link>
    <app-link :to="{ name: 'search' }" v-slot="{ isActive }">
      <MobileNavigationItem title="Busca" :active="isActive">
        <template #icon>
          <MagnifyIcon :size="24"></MagnifyIcon>
        </template>
      </MobileNavigationItem>
    </app-link>
    <app-link :to="{ name: 'orders' }" v-slot="{ isActive }">
      <MobileNavigationItem title="Pedidos" :active="isActive">
        <template #icon>
          <TextBoxIcon v-if="isActive" :size="24"></TextBoxIcon>
          <TextBoxOutlineIcon v-else :size="24"></TextBoxOutlineIcon>
        </template>
      </MobileNavigationItem>
    </app-link>
    <app-link :to="{ name: 'menu' }" v-slot="{ isActive }">
      <MobileNavigationItem
        :title="authStore.isAuthenticated ? 'Conta' : 'Menu'"
        :active="isActive"
      >
        <template #icon>
          <AccountOutlineIcon v-if="authStore.isAuthenticated" />
          <MenuIcon v-else />
        </template>
      </MobileNavigationItem>
    </app-link>
  </nav>
</template>

<style scoped></style>
