<script setup lang="ts">
import ScreenRoot from '@/components/ScreenRoot.vue';
import { onMounted, ref } from 'vue';
import AppBar from '@/components/AppBar.vue';
import { useRoute } from '@/router';
import { onBeforeRouteUpdate } from 'vue-router';
import { useAppLink } from '@/composables/use-app-link.ts';
import AppButton from '@/components/Buttons/AppButton.vue';
import SendIcon from 'vue-material-design-icons/Send.vue';
import ScreenFooter from '@/components/ScreenFooter.vue';
import AppLoadingAnimation from '@/components/AppLoadingAnimation.vue';

const props = defineProps<{ chatId: string }>();

const route = useRoute();

const { navigate } = useAppLink({ name: 'chat-list', replace: true });

const back = () => {
  navigate();
};

onBeforeRouteUpdate(() => {
  return true;
});

const enabledRefresh = ref(false);

const refresh = async (fromRefresh?: boolean) => {
  enabledRefresh.value = !!fromRefresh;
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
    enabledRefresh.value = true;
  }, 1000);
};

const isLoading = ref(false);

onMounted(() => {
  refresh();
});
</script>

<template>
  <screen-root @refresh="() => refresh(true)" :loading="isLoading" :pullToRefresh="enabledRefresh">
    <template #header>
      <app-bar @back="back">Nome do usuário</app-bar>
    </template>
    <template v-if="isLoading">
      <div
        v-if="isLoading"
        class="w-full h-full flex flex-col justify-center items-center text-center gap-2"
      >
        <app-loading-animation />
      </div>
    </template>
    <template v-else>
      <div>params.chatId {{ route.params.chatId }}</div>
      <div v-for="i in 50" :key="i">_props.chatId {{ props.chatId }}</div>
      <div>query {{ route.query }}</div>
    </template>
    <template #footer>
      <screen-footer padding-size-x="sm">
        <div class="w-full flex gap-2">
          <div class="w-full h-14 relative">
            <textarea
              :value="'Vinicius'"
              class="w-full h-full bg-gray-100 border border-gray-300 rounded-lg px-2 pr-16"
            />
            <app-button type="primary" size="sm" class="absolute bottom-2 right-2">
              <SendIcon />
            </app-button>
          </div>
        </div>
      </screen-footer>
    </template>
  </screen-root>
</template>

<style scoped></style>
