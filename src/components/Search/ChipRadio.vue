<script setup lang="ts">
  import { computed } from 'vue';
  import { generateHashId } from '@/utils';

  const props = defineProps<{
    modelValue: unknown;
    value: unknown;
    name: string;
  }>();

  const emit = defineEmits(['update:model-value']);

  const inputId = generateHashId();

  const internalValue = computed({
    get() {
      return props.modelValue;
    },
    set(value) {
      emit('update:model-value', value);
    },
  });
</script>

<template>
  <div>
    <input
      :id="inputId"
      type="radio"
      class="hidden peer"
      v-model="internalValue"
      :name="props.name"
      :value="props.value"
    />
    <label
      class="inline-flex flex-nowrap items-center gap-1 rounded-full px-4 py-2 border outline-none text-neutral-500 peer-focus:ring-2 cursor-pointer peer-checked:text-primary-600 peer-checked:bg-primary-100 peer-checked:border-primary-600"
      :for="inputId"
    >
      <slot></slot>
    </label>
  </div>
</template>

<style scoped></style>
