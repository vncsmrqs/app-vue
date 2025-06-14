<script setup lang="ts">
import ChevronDownIcon from 'vue-material-design-icons/ChevronDown.vue';
import BellOutlineIcon from 'vue-material-design-icons/BellOutline.vue';
import AppLink from '@/components/AppLink.vue';
import { isMobile } from '@/utils/device.ts';
</script>

<template>
  <div
    v-if="isMobile()"
    class="w-full flex items-center justify-center h-14 shadow-xl/1 z-50 relative"
  >
    <app-link :to="{ name: 'address-list' }" class="max-w-2/4 flex items-center justify-center">
      <div class="font-bold whitespace-nowrap overflow-hidden text-ellipsis">
        R. Camerindo Pereira Costa, 455
      </div>
      <ChevronDownIcon />
    </app-link>
    <div class="absolute right-0 mr-4">
      <app-link
        :to="{ name: 'notifications' }"
        class="bg-gray-100 rounded-full w-10 h-10 flex justify-center items-center"
      >
        <BellOutlineIcon />
      </app-link>
    </div>
  </div>
</template>

<style scoped></style>
