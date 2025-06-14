<script setup lang="ts">
import AppBar from '@/components/AppBar.vue';
import ScreenMain from '@/components/ScreenMain.vue';
import EmptyScreen from '@/components/EmptyScreen.vue';
import { computed, onMounted, ref } from 'vue';
import { v6 as uuid } from 'uuid';
import ChatConversationLink from '@/components/Chat/ChatConversationLink.vue';

const enabledRefresh = ref(false);
const isLoading = ref(false);

const chats = computed(() =>
  Array.from({ length: 30 }, (_, i) => i + 1).map((value) => ({
    id: uuid(),
    name: `${value} - Vinicius Marques`,
    message: 'Mensagem automática...',
  })),
);

const refresh = async (fromRefresh?: boolean) => {
  enabledRefresh.value = !!fromRefresh;
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
    enabledRefresh.value = true;
  }, 500);
};

onMounted(() => {
  refresh();
});
</script>

<template>
  <div class="w-full h-full lg:py-8">
    <div class="w-full h-full flex divide-x divide-gray-200 lg:border border-gray-200">
      <router-view v-slot="{ Component, route }">
        <div
          class="w-full lg:w-2/5 h-full flex-col"
          :class="{
            flex: !Component,
            'hidden md:flex': !!Component,
          }"
        >
          <div class="w-full flex flex-col overflow-hidden relative">
            <app-bar :show-back-button="false">Mensagens</app-bar>
            <screen-main
              @refresh="() => refresh(true)"
              :loading="isLoading"
              :enabled="enabledRefresh"
            >
              <empty-screen
                v-if="!chats.length"
                title="Suas conversas aparecerão aqui"
                subtitle="Faça um pedido para poder conversar com um estabelecimento"
              />
              <ul v-else class="divide-y divide-gray-100">
                <li v-for="chat in chats" :key="chat.id">
                  <chat-conversation-link
                    :to="{ name: 'chat-list.conversation', params: { chatId: chat.id } }"
                    :name="chat.name"
                    :message="chat.message"
                  />
                </li>
              </ul>
            </screen-main>
          </div>
        </div>
        <div
          class="w-full lg:w-3/5 h-full"
          :class="{
            block: Component,
            'hidden md:block': !Component,
          }"
        >
          <component v-if="Component" :is="Component" :key="route.params.orderId" />
          <empty-screen
            v-else-if="chats.length"
            title="Selecione uma conversa"
            subtitle="Selecione uma conversa ao lado para visualizar as mensagens"
          />
        </div>
      </router-view>
    </div>
  </div>
</template>

<style scoped></style>
