<script setup lang="ts">
  const props = defineProps<{
    title: string;
    active?: boolean;
    badge?: string;
  }>();

  defineEmits(['click']);
</script>

<template>
  <button
    class="flex items-center flex-col p-2 text-gray-500"
    @click="$emit('click')"
    :class="{
      'text-primary-600 font-bold': props.active,
    }"
  >
    <span
      :class="{
        'bg-primary-100 dark:bg-primary-600 dark:text-black': props.active,
      }"
      class="p-1 rounded-lg px-4 relative"
    >
      <span
        v-if="!!props.badge"
        class="block absolute -top-1 -right-1 bg-primary-600 px-2 text-xs rounded-lg text-white"
        >{{ props.badge }}</span
      >
      <slot name="icon"></slot>
    </span>
    <span class="text-xs">{{ props.title }}</span>
  </button>
</template>
