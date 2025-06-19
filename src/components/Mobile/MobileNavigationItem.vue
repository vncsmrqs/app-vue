<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title: string;
    active?: boolean;
    badge?: string;
  }>(),
  {},
);

defineEmits(['click']);
</script>

<template>
  <button
    class="flex items-center flex-col p-2 transition-colors"
    @click="$emit('click')"
    :class="{
      'text-gray-500': !props.active,
      'text-fuchsia-700 font-bold': props.active,
    }"
  >
    <span
      :class="{
        'bg-fuchsia-100': props.active,
      }"
      class="p-1 rounded-lg px-4 relative transition-colors"
    >
      <span
        v-if="!!props.badge"
        class="block absolute font-normal -top-1 -right-1 bg-red-500 px-1.5 text-xs rounded-lg text-white truncate leading-4"
      >
        {{ props.badge }}
      </span>
      <slot name="icon"></slot>
    </span>
    <span class="text-xs">{{ props.title }}</span>
  </button>
</template>
