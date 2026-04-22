<script setup lang="ts">
import CloseIcon from 'vue-material-design-icons/Close.vue';
import ArrowLeftIcon from 'vue-material-design-icons/ArrowLeft.vue';
import SquareIconButton from '@/components/Buttons/SquareIconButton.vue';
import { useAppStore } from '@/stores/app-store.ts';

const emit = defineEmits(['click']);

const appStore = useAppStore();
</script>

<template>
  <SquareIconButton
    @touchstart.prevent.stop
    @touchmove.prevent.stop
    @touchend.prevent.stop="emit('click')"
    @click="emit('click')"
    type="transparent-secondary"
    size="sm"
  >
    <ArrowLeftIcon v-if="appStore.view === 'mobile'" />
    <CloseIcon v-else />
  </SquareIconButton>
</template>

<style scoped></style>
