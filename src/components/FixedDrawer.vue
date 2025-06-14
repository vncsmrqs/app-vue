<script setup lang="ts">
import DrawerStackView from '@/components/Stack/DrawerStackView.vue';
import { onMounted, ref } from 'vue';
import { STACK_VIEW_BASE_TRANSITION_MILLISECOND } from '../../config/stack-view-config.ts';
import AppLink from '@/components/AppLink.vue';

const render = ref(false);
const opened = ref(false);

const open = () => {
  render.value = true;
  opened.value = true;
};

const close = () => {
  opened.value = false;
  setTimeout(() => {
    render.value = false;
  }, STACK_VIEW_BASE_TRANSITION_MILLISECOND);
};

onMounted(() => {
  open();
});
</script>

<template>
  <DrawerStackView
    v-if="render"
    :show="opened"
    :before-backdrop-close="() => false"
    :index="0"
    :transition-duration="STACK_VIEW_BASE_TRANSITION_MILLISECOND"
  >
    <div class="flex flex-col">
      Drawer fixo
      <button @click="close">Só fecha clicando aqui</button>
      <AppLink :to="{ name: 'notifications' }">Mas abre outros stack views</AppLink>
    </div>
  </DrawerStackView>
</template>

<style scoped></style>
