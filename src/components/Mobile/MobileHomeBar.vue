<script setup lang="ts">
import ChevronDownIcon from 'vue-material-design-icons/ChevronDown.vue';
import BellOutlineIcon from 'vue-material-design-icons/BellOutline.vue';
import AppLink from '@/components/AppLink.vue';
import { isMobile } from '@/utils/device.ts';
import RoundedIconButton from '@/components/Buttons/RoundedIconButton.vue';
import AppBar from '@/components/AppBar.vue';
</script>

<template>
  <app-bar v-if="isMobile()" :show-back-button="false">
    <app-link :to="{ name: 'address-list' }" class="w-4/5 flex items-center justify-between">
      <div class="font-bold whitespace-nowrap overflow-hidden text-ellipsis text-base">
        R. Camerindo Pereira Costa, 455
      </div>
      <ChevronDownIcon />
    </app-link>
    <template #append>
      <app-link :to="{ name: 'notifications' }" v-slot="{ navigate }">
        <RoundedIconButton @click.prevent.stop="navigate">
          <BellOutlineIcon />
        </RoundedIconButton>
      </app-link>
    </template>
  </app-bar>
</template>

<style scoped></style>
