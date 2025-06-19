<script setup lang="ts">
import ChevronDownIcon from 'vue-material-design-icons/ChevronDown.vue';
import BellOutlineIcon from 'vue-material-design-icons/BellOutline.vue';
import AppLink from '@/components/AppLink.vue';
import { isMobile } from '@/utils/device.ts';
import CircleIconButton from '@/components/Buttons/CircleIconButton.vue';
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
      <div class="last:-mr-2">
        <app-link :to="{ name: 'notifications' }" v-slot="{ navigate }">
          <CircleIconButton type="transparent-secondary" size="sm" @click.prevent.stop="navigate">
            <BellOutlineIcon />
          </CircleIconButton>
        </app-link>
      </div>
    </template>
  </app-bar>
</template>

<style scoped></style>
