<script setup lang="ts">
import { type RouteLocationNamedRaw } from 'vue-router';
import { useAppLink } from '@/composables/use-app-link.ts';
import { isIos } from '@/utils/device.ts';

const props = defineProps<{
  to: RouteLocationNamedRaw;
  custom?: boolean;
}>();

const { href, isActive, isExactActive, navigate } = useAppLink(props.to);

const onClick = (e: MouseEvent) => {
  if (
    props.custom ||
    e.defaultPrevented ||
    e.metaKey ||
    e.ctrlKey ||
    e.shiftKey ||
    e.altKey ||
    e.button !== 0
  ) {
    return;
  }

  e.preventDefault();
  navigate();
};

const onContextMenu = (e: MouseEvent) => {
  if (isIos()) {
    e.preventDefault();
  }
};
</script>

<template>
  <a @click="onClick" @contextmenu="onContextMenu" class="select-none" :href="href">
    <slot
      :isActive="isActive"
      :isExactActive="isExactActive"
      :navigate="navigate"
      :href="href"
    ></slot>
  </a>
</template>

<style scoped></style>
