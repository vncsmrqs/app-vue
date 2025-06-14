<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

const isOnline = ref(true);

onMounted(() => {
  window.addEventListener('online', handleConnection);
  window.addEventListener('offline', handleConnection);
});

onUnmounted(() => {
  window.removeEventListener('online', handleConnection);
  window.removeEventListener('offline', handleConnection);
});

const handleConnection = () => {
  isOnline.value = navigator?.onLine || false;
};
</script>

<template>
  <div class="w-dvw h-dvh">
    <Transition name="fade" mode="out-in">
      <div class="w-full h-full" v-if="isOnline">
        <slot></slot>
      </div>
      <div v-else>
        Não encontramos uma conexão de rede ativa no momento. Por favor, verifique sua conexão e
        tente novamente.
      </div>
    </Transition>
  </div>
</template>

<style scoped></style>
