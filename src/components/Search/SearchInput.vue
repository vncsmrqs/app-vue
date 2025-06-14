<script setup lang="ts">
  import MagnifyIcon from 'vue-material-design-icons/Magnify.vue';
  import { computed } from 'vue';

  const props = withDefaults(
    defineProps<{
      modelValue: string;
      placeholder?: string;
      small?: boolean;
    }>(),
    { placeholder: 'Busque por item ou estabelecimento', small: false },
  );
  const emit = defineEmits(['focus', 'blur', 'submit', 'update:modelValue']);

  const internalValue = computed({
    get() {
      return props.modelValue;
    },
    set(value: string) {
      emit('update:modelValue', value);
    },
  });
</script>

<template>
  <div class="relative">
    <div
      class="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-primary-600 dark:text-primary-800"
    >
      <MagnifyIcon></MagnifyIcon>
    </div>
    <input
      v-model="internalValue"
      @focus="emit('focus')"
      @blur="emit('blur')"
      type="search"
      id="default-search"
      class="block w-full pl-10 text-gray-900 rounded-xl ring-primary-600 bg-gray-100 focus:outline-none focus:ring-2"
      :class="{
        'p-2': props.small,
        'px-2.5 py-4': !props.small,
      }"
      :placeholder="props.placeholder"
      required
    />
  </div>
</template>

<style scoped></style>
