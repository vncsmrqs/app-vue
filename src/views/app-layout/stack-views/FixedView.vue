<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useRouter } from '@/router';
import EmptyScreen from '@/components/EmptyScreen.vue';
import ScreenFooter from '@/components/ScreenFooter.vue';
import AppBar from '@/components/AppBar.vue';
import ScreenMain from '@/components/ScreenMain.vue';
import type { StackViewBaseEmitters, StackViewBaseProps } from '@/stores/stack-view-store.ts';
import { isMobile } from '@/utils/device.ts';

const props = defineProps<StackViewBaseProps>();
const emit = defineEmits<StackViewBaseEmitters>();

const router = useRouter();

const canClose = ref(false);

props.stackView.onBeforeClose(() => {
  return canClose.value;
});

const turnOnClose = () => {
  canClose.value = true;
};

let unsubscribeBeforeResolve: () => void = () => undefined;

onMounted(() => {
  unsubscribeBeforeResolve = router.beforeResolve(() => {
    return canClose.value;
  });
});

onBeforeUnmount(() => {
  unsubscribeBeforeResolve();
});
</script>

<template>
  <div class="w-full h-full flex flex-col bg-white">
    <app-bar :show-back-button="canClose" @back="emit('close', canClose)">
      Exemplo de página fixa
    </app-bar>
    <screen-main :enabled="isMobile()">
      <empty-screen
        v-if="!canClose"
        title="Essa página não pode ser fechada"
        subtitle="Clique no botão do footer para habilitar o fechamento"
      />
      <empty-screen v-else title="Tudo certo!" subtitle="Agora você pode fechar" />
    </screen-main>
    <screen-footer>
      <button
        v-if="!canClose"
        @click="turnOnClose"
        class="w-full h-14 bg-gray-100 rounded-xl cursor-pointer"
      >
        Habilitar fechamento
      </button>
    </screen-footer>
  </div>
</template>

<style scoped></style>
