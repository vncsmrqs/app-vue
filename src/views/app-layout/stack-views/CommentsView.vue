<script setup lang="ts">
import type { StackViewBaseEmitters } from '@/stores/stack-view-store.ts';
import ScreenRoot from '@/components/Screen/ScreenRoot.vue';
import { computed, ref, watch } from 'vue';
import AccountIcon from 'vue-material-design-icons/Account.vue';
import HeartOutlineIcon from 'vue-material-design-icons/HeartOutline.vue';

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
      <div class="sticky top-0 bg-white flex justify-center py-1 font-medium">Avaliações</div>
    </template>
    <div>
      <ul class="divide-y divide-gray-200">
        <li v-for="i in 50" :key="i" class="px-4 py-5">
          <div class="flex gap-2">
            <div
              class="w-10 h-10 shrink-0 flex justify-center items-center rounded-full bg-gray-200"
            >
              <AccountIcon />
            </div>
            <div class="flex-1">
              <div class="font-semibold text-xs">nome.do.usuario</div>
              <div>Comentários aleatório do usuário bem longo para quebrar a linha</div>
            </div>
            <div class="w-12 flex flex-col gap-1 items-center text-gray-500 text-xs">
              <HeartOutlineIcon />
              <span>235</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <template #footer>
      <div class="w-full flex flex-col sticky bottom-0 z-10">
        <div class="w-full bg-gray-100 px-4 py-1 text-sm text-gray-600">
          Essa é apenas uma mensagem de teste
        </div>
        <div class="w-full flex gap-2 bg-white px-4 py-2">
          <div class="w-10 h-10 shrink-0 flex justify-center items-center rounded-full bg-gray-200">
            <AccountIcon />
          </div>
          <div class="w-full">
            <input type="text" class="w-full h-10 px-2 border border-gray-200 rounded-lg" />
          </div>
        </div>
      </div>
    </template>
  </screen-root>
</template>

<style scoped></style>
