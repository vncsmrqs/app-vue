<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef, watch } from 'vue';
import BellOutlineIcon from 'vue-material-design-icons/BellOutline.vue';
import MenuLink from '@/components/Menu/MenuLink.vue';
import AppBar from '@/components/AppBar.vue';
import TextBoxOutlineIcon from 'vue-material-design-icons/TextBoxOutline.vue';
import HeartOutlineIcon from 'vue-material-design-icons/HeartOutline.vue';
import ChatOutlineIcon from 'vue-material-design-icons/ChatOutline.vue';
import ShoppingOutlineIcon from 'vue-material-design-icons/ShoppingOutline.vue';
import MapMarkerOutlineIcon from 'vue-material-design-icons/MapMarkerOutline.vue';
import type { StackViewBaseEmitters, StackViewBaseProps } from '@/stores/stack-view-store.ts';
import { useElementSize, useScroll } from '@vueuse/core';
import { appConfig } from '@/config/app-config.ts';
import { v6 as uuid } from 'uuid';
import MenuIcon from 'vue-material-design-icons/Menu.vue';

const show = ref(false);

const props = defineProps<StackViewBaseProps>();
const emit = defineEmits<StackViewBaseEmitters>();

onMounted(() => {
  setTimeout(() => {
    show.value = true;
  }, 100);
});

onMounted(() => {});

const rootElement = useTemplateRef<HTMLElement>('root-element');
const stickyElement = useTemplateRef<HTMLElement>('sticky-element');

const { y: scrollTop, isScrolling } = useScroll(rootElement, {
  // throttle: 100,
});

const { height } = useElementSize(stickyElement);

const translateY = ref(0);

watch(
  () => scrollTop.value,
  (value, oldValue) => {
    if (scrollTop.value < 0) {
      return;
    }
    if (value >= oldValue) {
      // rolando para baixo
      const diff = value - oldValue;
      const a = translateY.value * -1 >= height.value ? height.value : translateY.value * -1 + diff;
      translateY.value = a * -1;

      return;
    }

    const diff = oldValue - value;
    if (diff > 0) {
      translateY.value = translateY.value >= 0 ? 0 : translateY.value + diff;
    }

    // rolando para cima
    return;
  },
);
</script>

<template>
  <div
    ref="root-element"
    class="w-full h-full flex-auto flex flex-col overflow-x-hidden overflow-y-auto relative"
  >
    <!--    <div class="fixed top-0 z-50 bg-red-500">-->
    <!--      <div>scrollTop: {{ scrollTop }}</div>-->
    <!--      <div>isScrolling: {{ isScrolling }}</div>-->
    <!--      <div>translateY: {{ translateY }}</div>-->
    <!--      <div>height: {{ height }}</div>-->
    <!--    </div>-->

    <div
      ref="sticky-element"
      class="sticky top-0 transform-gpu z-10"
      :style="{ transform: `translateY(${translateY}px)` }"
    >
      <app-bar @back="() => emit('close')" class=""></app-bar>
    </div>
    <div class="text-2xl font-medium px-5 pt-5">Menu</div>
    <ul class="divide-y divide-gray-200">
      <li>
        <menu-link :to="{ name: 'menu', replace: true, query: { uuid: uuid() } }">
          Menu
          <template #icon>
            <MenuIcon />
          </template>
        </menu-link>
      </li>
      <li>
        <menu-link :to="{ name: 'bag' }">
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
    <div class="flex-1"></div>
    <div
      class="w-full h-14 sticky flex-none bottom-0 border-t border-gray-200 px-5 bg-white flex items-center"
    >
      VERSÃO DO APP: {{ appConfig.version }}
    </div>
  </div>
</template>

<style scoped></style>
