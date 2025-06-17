<script setup lang="ts">
import { isMobile } from '@/utils/device.ts';
import CloseIcon from 'vue-material-design-icons/Close.vue';
import ArrowLeftIcon from 'vue-material-design-icons/ArrowLeft.vue';
import SquareIconButton from '@/components/Buttons/SquareIconButton.vue';

const emit = defineEmits(['click']);
</script>

<template>
  <SquareIconButton
    @touchstart.prevent.stop
    @touchmove.prevent.stop
    @touchend.prevent.stop="emit('click')"
    @click="emit('click')"
  >
    <ArrowLeftIcon v-if="isMobile()" />
    <CloseIcon v-else />
  </SquareIconButton>
</template>

<style scoped></style>
