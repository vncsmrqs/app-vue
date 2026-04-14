<script setup lang="ts">
import BackButton from '@/components/Buttons/BackButton.vue';
import { isMobile } from '@/utils/device.ts';

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
  <header class="relative">
    <div class="">
      <div class="flex h-14 items-center px-5 gap-2 bg-white shadow-xl/2 z-50">
        <slot name="prepend">
          <back-button
            v-if="props.showBackButton && isMobile()"
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
            v-if="props.showBackButton && !isMobile()"
            @click="emit('back')"
            class="last:-mr-2"
          />
        </slot>
      </div>
    </div>
  </header>
</template>

<style scoped></style>
