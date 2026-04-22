<script setup lang="ts">
import BackButton from '@/components/Buttons/BackButton.vue';
import { useTemplateRef, watch } from 'vue';
import { useElementSize } from '@vueuse/core';
import { useAppStore } from '@/stores/app-store.ts';

const appStore = useAppStore();

const props = withDefaults(
  defineProps<{
    showBackButton?: boolean;
  }>(),
  {
    showBackButton: true,
  },
);

const emit = defineEmits<{ back: [void]; 'update:height': [number] }>();

const rootElement = useTemplateRef('root-element');

const { height } = useElementSize(rootElement);

watch(
  () => height.value,
  (newHeight) => {
    emit('update:height', newHeight);
  },
  { immediate: true },
);
</script>

<template>
  <header ref="root-element" class="relative">
    <div class="">
      <div class="flex h-14 items-center px-5 gap-2 bg-white shadow-xl/2 z-50">
        <slot name="prepend">
          <back-button
            v-if="props.showBackButton && appStore.view === 'mobile'"
            @click="emit('back')"
            class="first:-ml-2"
          />
        </slot>
        <div class="min-w-0 flex-auto">
          <h1 class="truncate text-xl font-medium">
            <slot></slot>
          </h1>
        </div>
        <slot name="append">
          <back-button
            v-if="props.showBackButton && appStore.view !== 'mobile'"
            @click="emit('back')"
            class="last:-mr-2"
          />
        </slot>
      </div>
    </div>
  </header>
</template>

<style scoped></style>
