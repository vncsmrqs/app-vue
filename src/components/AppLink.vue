<script setup lang="ts">
import { type RouteLocationNamedRaw } from 'vue-router';
import { useAppLink } from '@/composables/use-app-link.ts';
import { isMobile } from '@/utils/device.ts';

const props = defineProps<{
  to: RouteLocationNamedRaw;
}>();

const { href, isActive, isExactActive, navigate } = useAppLink(props.to);
</script>

<template>
  <a
    @click.prevent="navigate"
    @contextmenu.prevent.stop="() => {}"
    class="select-none"
    :href="href"
  >
    <slot
      :isActive="isActive"
      :isExactActive="isExactActive"
      :navigate="navigate"
      :href="href"
    ></slot>
  </a>
</template>

<style scoped></style>
