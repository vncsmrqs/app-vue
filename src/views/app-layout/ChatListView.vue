<script setup lang="ts">
import AppBar from '@/components/AppBar.vue';
import ScreenRoot from '@/components/Screen/ScreenRoot.vue';
import EmptyScreen from '@/components/EmptyScreen.vue';
import { computed, onMounted, ref } from 'vue';
import { v6 as uuid } from 'uuid';
import ChatConversationLink from '@/components/Chat/ChatConversationLink.vue';
import { useRouter } from '@/router';
import ScreenListLayout from '@/components/Screen/ScreenListLayout.vue';

const enabledRefresh = ref(false);
const isLoading = ref(false);

const router = useRouter();

const chats = computed(() =>
  Array.from({ length: 30 }, (_, i) => i + 1).map((value) => ({
    id: uuid(),
    name: `Mensagem ${value}`,
    message: 'Mensagem automática...',
  })),
);

const refresh = async (fromRefresh?: boolean) => {
  enabledRefresh.value = !!fromRefresh;
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
    enabledRefresh.value = true;
  }, 1500);
};

onMounted(() => {
  refresh();
});
</script>

<template>
  <screen-list-layout>
    <template #default="{ hasChildren }">
      <screen-root
        @refresh="() => refresh(true)"
        :loading="isLoading"
        :pullToRefresh="enabledRefresh"
      >
        <template #header>
          <app-bar :show-back-button="!hasChildren" @back="router.back()">Mensagens</app-bar>
        </template>
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
      </screen-root>
    </template>
    <template #empty>
      <empty-screen
        v-if="chats.length"
        title="Selecione uma conversa"
        subtitle="Selecione uma conversa ao lado para visualizar as mensagens"
      />
    </template>
  </screen-list-layout>
</template>

<style scoped></style>
