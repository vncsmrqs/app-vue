<script setup lang="ts">
import ChevronRightIcon from 'vue-material-design-icons/ChevronRight.vue';
import AppLink from '@/components/AppLink.vue';
import type { RouteLocationNamedRaw } from 'vue-router';

const props = defineProps<{
  to: RouteLocationNamedRaw;
}>();
</script>

<template>
  <app-link
    :to="props.to"
    class="flex w-full items-start justify-start space-x-3 p-5 text-left select-none"
  >
    <div class="relative flex-none rounded-xl bg-gray-100 p-3 text-gray-600">
      <slot name="icon"></slot>
    </div>
    <div class="flex min-w-0 flex-auto flex-col justify-center space-y-2 self-stretch">
      <div class="space-y-1">
        <div class="flex items-center space-x-2">
          <div class="min-w-0 shrink grow-0 truncate leading-tight font-medium text-gray-800">
            <slot></slot>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-none flex-col justify-center self-stretch text-gray-600">
      <ChevronRightIcon />
    </div>
  </app-link>
</template>

<style scoped></style>
