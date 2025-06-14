<script setup lang="ts">
import ScreenMain from '@/components/ScreenMain.vue';
import { onMounted, ref } from 'vue';
import AppBar from '@/components/AppBar.vue';
import { useRoute } from '@/router';
import { onBeforeRouteUpdate } from 'vue-router';
import { useAppLink } from '@/composables/use-app-link.ts';

// const props = defineProps<{ chatId: string }>();

const { params } = useRoute();

const { navigate } = useAppLink({ name: 'chat-list', replace: true });

const back = () => {
  navigate();
};

onBeforeRouteUpdate(() => {
  console.log(params);
  return true;
});
console.log(params);

const enabledRefresh = ref(false);

const refresh = async (fromRefresh?: boolean) => {
  enabledRefresh.value = !!fromRefresh;
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
    enabledRefresh.value = true;
  }, 500);
};

const isLoading = ref(false);

onMounted(() => {
  refresh();
});
</script>

<template>
  <div class="w-full h-full flex divide-x divide-gray-200">
    <div class="w-full h-full flex flex-col">
      <app-bar @back="back">Nome do usuário</app-bar>
      <screen-main @refresh="() => refresh(true)" :loading="isLoading" :enabled="enabledRefresh">
        Chat id {{ params.chatId }}
      </screen-main>
    </div>
  </div>
</template>

<style scoped></style>
