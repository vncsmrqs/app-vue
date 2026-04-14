<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useRouter } from '@/router';
import EmptyScreen from '@/components/EmptyScreen.vue';
import ScreenFooter from '@/components/ScreenFooter.vue';
import AppBar from '@/components/AppBar.vue';
import ScreenMain from '@/components/ScreenMain.vue';
import type { StackViewBaseEmitters, StackViewBaseProps } from '@/stores/stack-view-store.ts';
import { isMobile } from '@/utils/device.ts';
import ScreenRoot from '@/components/ScreenRoot.vue';
import AppButton from '@/components/Buttons/AppButton.vue';

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
  <screen-root>
    <template #header>
      <app-bar :show-back-button="canClose" @back="emit('close', canClose)">
        Exemplo de página fixa
      </app-bar>
    </template>
    <screen-main :enabled="isMobile()">
      <empty-screen
        v-if="!canClose"
        title="Essa página não pode ser fechada"
        subtitle="Clique no botão do footer para habilitar o fechamento"
      />
      <empty-screen v-else title="Tudo certo!" subtitle="Agora você pode fechar" />
    </screen-main>
    <template #footer v-if="!canClose">
      <screen-footer>
        <app-button type="primary" @click="turnOnClose" class="w-full">
          Habilitar fechamento
        </app-button>
      </screen-footer>
    </template>
  </screen-root>
</template>

<style scoped></style>
