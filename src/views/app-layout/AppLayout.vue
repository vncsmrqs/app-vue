<script setup lang="ts">
import { RouterView } from 'vue-router';
import MobileNavigation from '@/components/Mobile/MobileNavigation.vue';
import AppLink from '@/components/AppLink.vue';
import MenuIcon from 'vue-material-design-icons/Menu.vue';
import AppButton from '@/components/Buttons/AppButton.vue';
import MenuView from '@/views/app-layout/stack-views/MenuView.vue';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import CenterModalStackView from '@/components/Stack/CenterModalStackView.vue';
import { useRouter } from '@/router';
import { routerPendingAction } from '@/router/router-navigation-core.ts';
import { useAppStore } from '@/stores/app-store.ts';

const router = useRouter();
const appStore = useAppStore();

const menuIsVisible = ref(false);

let unsubscribeBeforeResolve: () => void = () => undefined;

onMounted(() => {
  unsubscribeBeforeResolve = router.beforeResolve(() => {
    if (menuIsVisible.value) {
      menuIsVisible.value = false;

      if (!routerPendingAction || ['BACKWARD'].includes(routerPendingAction)) {
        return false;
      }
    }
  });
});

onBeforeUnmount(() => {
  unsubscribeBeforeResolve();
});
</script>

<template>
  <div class="w-full h-full flex-auto flex flex-col overflow-hidden">
    <div v-if="appStore.view !== 'mobile'" class="w-full bg-white border-b border-gray-200">
      <div class="lg:container px-2 lg:px-0 mx-auto min-h-14 flex items-center gap-4 relative">
        <app-link :to="{ name: 'home' }" v-slot="{ isActive }" class="font-medium">
          <app-button :type="isActive ? 'primary' : 'secondary'" size="sm"> Início </app-button>
        </app-link>
        <app-link :to="{ name: 'search' }" v-slot="{ isActive }" class="font-medium">
          <app-button :type="isActive ? 'primary' : 'secondary'" size="sm"> Busca </app-button>
        </app-link>
        <app-link :to="{ name: 'orders' }" v-slot="{ isActive }" class="font-medium">
          <app-button :type="isActive ? 'primary' : 'secondary'" size="sm"> Pedidos </app-button>
        </app-link>
        <div class="flex-1"></div>
        <app-button @click="menuIsVisible = true" type="secondary" size="sm">
          <MenuIcon />
        </app-button>
      </div>
    </div>
    <div class="w-full flex-1 overflow-auto">
      <router-view />
    </div>
    <mobile-navigation />
    <CenterModalStackView :show="menuIsVisible" @close="menuIsVisible = false">
      <MenuView @close="menuIsVisible = false" />
    </CenterModalStackView>
  </div>
</template>

<style scoped></style>
