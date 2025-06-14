<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue';
import device from '@/utils/device';

const isLandscape = ref(device.isLandscape());

onMounted(() => {
  screen.orientation.addEventListener('change', handleOrientation);
});

onUnmounted(() => {
  screen.orientation.removeEventListener('change', handleOrientation);
});

const handleOrientation = () => {
  nextTick(() => {
    isLandscape.value = device.isLandscape();
  });
};
</script>

<template>
  <div class="w-dvw h-dvh">
    <Transition name="fade" mode="out-in">
      <div v-if="isLandscape">
        Para garantir a melhor experiência, utilize o aplicativo no modo portrait (retrato). Por
        favor, vire seu dispositivo para a posição vertical :)
      </div>
      <div v-else class="w-full h-full">
        <slot key="1"></slot>
      </div>
    </Transition>
  </div>
</template>

<style scoped></style>
