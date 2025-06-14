<script setup lang="ts">
  import { computed } from 'vue';

  const props = defineProps<{
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
      if (Array.isArray(props.modelValue)) {
        if (props.modelValue.includes(newValue)) {
          emit(
            'update:model-value',
            props.modelValue.filter((item) => item !== newValue),
          );
          return;
        }
        emit('update:model-value', props.modelValue.concat([newValue]));
        return;
      }

      if (props.modelValue === newValue) {
        emit('update:model-value', null);
        return;
      }

      emit('update:model-value', newValue);
    },
  });

  const active = computed(() => {
    if (Array.isArray(props.modelValue)) {
      return props.modelValue.includes(props.value);
    }
    return props.value === props.modelValue;
  });
</script>

<template>
  <button
    @click="internalValue = props.value"
    class="rounded-full px-4 py-2 border peer-focus:ring-2 cursor-pointer"
    :class="{
      'border-primary-600 text-primary-600 bg-primary-100': active,
      'text-neutral-500': !active,
    }"
  >
    <slot></slot>
  </button>
</template>

<style scoped></style>
