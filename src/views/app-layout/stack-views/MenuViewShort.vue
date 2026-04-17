<script setup lang="ts">
import MenuLink from '@/components/Menu/MenuLink.vue';
import AppBar from '@/components/AppBar.vue';
import { appConfig } from '@/config/app-config.ts';
import { v6 as uuid } from 'uuid';
import MenuIcon from 'vue-material-design-icons/Menu.vue';
import ArrowDownIcon from 'vue-material-design-icons/ArrowDown.vue';
import ArrowUpIcon from 'vue-material-design-icons/ArrowUp.vue';
import ScreenRoot from '@/components/ScreenRoot.vue';
import ScreenFooter from '@/components/ScreenFooter.vue';
import { computed, ref, watch } from 'vue';
import type { StackViewBaseEmitters } from '@/stores/stack-view-store.ts';

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
        v-if="false"
        @update:height="(height) => (headerHeight = height)"
        @back="() => emit('close')"
        class=""
      ></app-bar>
    </template>
    <div>
      <div class="text-2xl font-medium px-5 pt-5">Menu</div>
      <ul class="divide-y divide-gray-200">
        <li>
          <menu-link :to="{ name: 'bottom', query: { uuid: uuid() } }">
            Bottom
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
