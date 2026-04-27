<script setup lang="ts">
import AppLink from '@/components/AppLink.vue';
import { v6 as uuid } from 'uuid';
import ScreenRoot from '@/components/Screen/ScreenRoot.vue';
import AppBar from '@/components/AppBar.vue';
import { useAppStore } from '@/stores/app-store.ts';
import { useRouter } from '@/router';
import CheckDecagramIcon from 'vue-material-design-icons/CheckDecagram.vue';

const appStore = useAppStore();
const router = useRouter();

const props = defineProps<{
  merchantId: string;
}>();
</script>

<template>
  <screen-root>
    <template #header>
      <app-bar v-if="appStore.view === 'mobile'" @back="router.back()" />
    </template>

    <div class="lg:container mx-auto">
      <div class="w-full h-[calc(100dvh_/_4)] bg-fuchsia-500"></div>
      <div class="w-full px-2 lg:px-5 py-4 bg-gray-100">
        <div class="flex gap-2">
          <div class="w-20 aspect-square bg-fuchsia-400 rounded-full"></div>
          <div>
            <div class="flex gap-1">
              <div class="text-semibold text-xl">Estabelecimento</div>
              <CheckDecagramIcon :size="20" class="text-fuchsia-700 mt-1" />
            </div>
            <div class="text-sm text-gray-600">Alguma descrição sobre o estabelecimento</div>
          </div>
        </div>
      </div>
    </div>

    <div class="lg:container mx-auto divide-y divide-gray-200">
      <div v-for="i in 5" :key="i">
        <div class="w-full text-xl font-semibold px-2 lg:px-5 pt-5">Seção</div>
        <div class="gap-4 flex flex-nowrap overflow-x-auto px-2 lg:px-5 py-5">
          <app-link
            v-for="i in 15"
            :key="i"
            :to="{
              name: 'merchant.product',
              params: { merchantId: props.merchantId, productId: uuid() },
            }"
            class="w-56 flex-shrink-0 rounded-lg border border-gray-200 cursor-pointer flex flex-col"
          >
            <div class="w-full aspect-video shrink-0 bg-gray-100 overflow-hidden rounded-t-lg">
              <div class="w-full h-full object-cover" />
            </div>
            <div class="h-full p-2 flex flex-col gap-2">
              <span class="w-full shrink-0 line-clamp-2"> Produto </span>
              <div class="w-full h-full flex items-center mt-2 text-sm">
                <span class="text-green-700"> R$ 00,00 </span>
                <div class="text-gray-500 ml-2 text-sm line-through">R$ 00,00</div>
              </div>
            </div>
          </app-link>
        </div>
      </div>
    </div>
  </screen-root>
</template>

<style scoped></style>
