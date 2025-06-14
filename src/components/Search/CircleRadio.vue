<script setup lang="ts">
  import { computed } from 'vue';

  const props = defineProps<{
    label?: string;
    modelValue: unknown;
    value: unknown;
    name: string;
  }>();

  const emit = defineEmits(['update:model-value']);

  const internalValue = computed({
    get() {
      return props.modelValue;
    },
    set(newValue) {
      emit('update:model-value', newValue);
    },
  });

  const active = computed(() => {
    return props.value === props.modelValue;
  });
</script>

<template>
  <div class="flex flex-col items-center gap-2">
    <button
      @click="internalValue = props.value"
      class="rounded-full w-20 aspect-square border flex flex-col justify-center items-center outline-none cursor-pointer"
      :class="{
        'border-primary-600 text-primary-600 bg-primary-100': active,
        'text-neutral-500': !active,
      }"
    >
      <slot></slot>
    </button>
    <span
      @click="internalValue = props.value"
      class="text-center text-sm cursor-pointer"
      :class="{
        'text-primary-600': active,
        'text-neutral-500': !active,
      }"
    >
      {{ props.label }}
    </span>
  </div>
</template>

<style scoped></style>
