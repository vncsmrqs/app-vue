<script setup lang="ts">
import BellOutlineIcon from 'vue-material-design-icons/BellOutline.vue';
import MenuLink from '@/components/Menu/MenuLink.vue';
import AppBar from '@/components/AppBar.vue';
import TextBoxOutlineIcon from 'vue-material-design-icons/TextBoxOutline.vue';
import HeartOutlineIcon from 'vue-material-design-icons/HeartOutline.vue';
import ChatOutlineIcon from 'vue-material-design-icons/ChatOutline.vue';
import ShoppingOutlineIcon from 'vue-material-design-icons/ShoppingOutline.vue';
import MapMarkerOutlineIcon from 'vue-material-design-icons/MapMarkerOutline.vue';
import type { StackViewBaseEmitters } from '@/stores/stack-view-store.ts';
import { appConfig } from '@/config/app-config.ts';
import { v6 as uuid } from 'uuid';
import MenuIcon from 'vue-material-design-icons/Menu.vue';
import ArrowDownIcon from 'vue-material-design-icons/ArrowDown.vue';
import ArrowUpIcon from 'vue-material-design-icons/ArrowUp.vue';
import ScreenRoot from '@/components/Screen/ScreenRoot.vue';
import ScreenFooter from '@/components/Screen/ScreenFooter.vue';
import { computed, ref, watch } from 'vue';
import CogOutlineIcon from 'vue-material-design-icons/CogOutline.vue';

const emit = defineEmits<StackViewBaseEmitters>();

const headerHeight = ref(0);
const footerHeight = ref(0);

const minHeight = computed(() => headerHeight.value + footerHeight.value);

watch(
  () => minHeight.value,
  (height) => {
    emit('update:stack-props', { minHeight: height });
  },
);
</script>

<template>
  <screen-root>
    <template #header>
      <app-bar
        @update:height="(height) => (headerHeight = height)"
        @back="() => emit('close')"
        class=""
      ></app-bar>
    </template>
    <div>
      <div class="text-2xl font-medium px-5 pt-5">Menu</div>
      <ul class="divide-y divide-gray-200">
        <li>
          <menu-link :to="{ name: 'settings' }">
            Settings
            <template #icon>
              <CogOutlineIcon />
            </template>
          </menu-link>
        </li>
        <li>
          <menu-link :to="{ name: 'comments', query: { uuid: uuid() } }">
            Comments
            <template #icon>
              <ArrowDownIcon />
            </template>
          </menu-link>
        </li>
        <li>
          <menu-link :to="{ name: 'bottom', query: { uuid: uuid() } }">
            Bottom
            <template #icon>
              <ArrowDownIcon />
            </template>
          </menu-link>
        </li>
        <li>
          <menu-link :to="{ name: 'bottom-short', query: { uuid: uuid() } }">
            Bottom Short
            <template #icon>
              <ArrowDownIcon />
            </template>
          </menu-link>
        </li>
        <li>
          <menu-link :to="{ name: 'fixed-bottom', query: { uuid: uuid() } }">
            Fixed Bottom
            <template #icon>
              <ArrowDownIcon />
            </template>
          </menu-link>
        </li>
        <li>
          <menu-link :to="{ name: 'modal', query: { uuid: uuid() } }">
            Modal
            <template #icon>
              <ArrowUpIcon />
            </template>
          </menu-link>
        </li>
        <li>
          <menu-link :to="{ name: 'menu', query: { uuid: uuid() } }">
            Menu
            <template #icon>
              <MenuIcon />
            </template>
          </menu-link>
        </li>
        <li>
          <menu-link :to="{ name: 'order.bag' }">
            Sacola
            <template #icon>
              <ShoppingOutlineIcon />
            </template>
          </menu-link>
        </li>
        <li>
          <menu-link :to="{ name: 'address-list' }">
            Endereços
            <template #icon>
              <MapMarkerOutlineIcon />
            </template>
          </menu-link>
        </li>
        <li>
          <menu-link :to="{ name: 'notifications' }">
            Notificações
            <template #icon>
              <BellOutlineIcon />
            </template>
          </menu-link>
        </li>
        <li>
          <menu-link :to="{ name: 'orders' }">
            Pedidos
            <template #icon>
              <TextBoxOutlineIcon />
            </template>
          </menu-link>
        </li>
        <li>
          <menu-link :to="{ name: 'favorites' }">
            Favoritos
            <template #icon>
              <HeartOutlineIcon />
            </template>
          </menu-link>
        </li>
        <li>
          <menu-link :to="{ name: 'chat-list' }">
            Chats
            <template #icon>
              <ChatOutlineIcon />
            </template>
          </menu-link>
        </li>
      </ul>
    </div>
    <template #footer>
      <screen-footer @update:height="(height) => (footerHeight = height)" class="px-5">
        VERSÃO DO APP: {{ appConfig.version }}
      </screen-footer>
    </template>
  </screen-root>
</template>

<style scoped></style>
