<script setup lang="ts">
import ScreenRoot from '@/components/ScreenRoot.vue';
import AppBar from '@/components/AppBar.vue';
import EmptyScreen from '@/components/EmptyScreen.vue';
import AppLink from '@/components/AppLink.vue';
import { useRouter } from '@/router';

const router = useRouter();
</script>

<template>
  <div class="lg:container w-full h-full lg:mt-[-1px] mx-auto">
    <div class="w-full h-full flex divide-x divide-gray-200 lg:border border-gray-200">
      <router-view v-slot="{ Component }">
        <div
          class="w-full lg:w-2/5 h-full flex-col"
          :class="{
            flex: !Component,
            'hidden md:flex': !!Component,
          }"
        >
          <div class="w-full flex flex-col overflow-hidden relative">
            <screen-root>
              <template #header>
                <app-bar :show-back-button="!Component" @close="router.back()">Settings</app-bar>
              </template>
              <div class="w-full h-full">
                <ul class="flex flex-col divide-y divide-gray-200">
                  <app-link :to="{ name: 'settings.account' }">
                    <li class="px-5 py-5">Account</li>
                  </app-link>
                  <app-link :to="{ name: 'settings.profile' }">
                    <li class="px-5 py-5">Profile</li>
                  </app-link>
                </ul>
              </div>
            </screen-root>
          </div>
        </div>
        <div
          class="w-full lg:w-3/5 h-full"
          :class="{
            block: Component,
            'hidden md:block': !Component,
          }"
        >
          <component v-if="Component" :is="Component" :key="Component.props!.chatId" />
          <empty-screen
            title="Selecione uma configuração"
            subtitle="Selecione uma opção ao lado para configurar"
          />
        </div>
      </router-view>
    </div>
  </div>
</template>

<style scoped></style>
