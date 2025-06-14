<script setup lang="ts">
import ArrowLeftIcon from 'vue-material-design-icons/ArrowLeft.vue';
import { isMobile } from '@/utils/device.ts';
import CloseIcon from 'vue-material-design-icons/Close.vue';

const props = withDefaults(
  defineProps<{
    showBackButton?: boolean;
  }>(),
  {
    showBackButton: true,
  },
);

const emit = defineEmits<{ back: [void] }>();
</script>

<template>
  <header class="relative pt-safe">
    <div class="">
      <div class="flex h-14 items-center px-5 gap-4 bg-white shadow-xl/2 z-50">
        <slot name="prepend">
          <button
            v-if="props.showBackButton || $slots.prepend"
            @click="emit('back')"
            class="flex-none first:-ml-2 cursor-pointer w-10 h-10 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors"
          >
            <ArrowLeftIcon v-if="isMobile()" />
            <CloseIcon v-else />
          </button>
        </slot>
        <div class="min-w-0 flex-auto">
          <h1 class="truncate text-xl leading-none font-medium"><slot></slot></h1>
        </div>
        <slot name="append"></slot>
      </div>
    </div>
  </header>
</template>

<style scoped></style>
