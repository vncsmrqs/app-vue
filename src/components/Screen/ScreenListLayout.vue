<script setup lang="ts"></script>

<template>
  <div class="lg:container w-full h-full lg:mt-[-1px] mx-auto">
    <div class="w-full h-full flex divide-x divide-gray-200 lg:border border-gray-200">
      <router-view v-slot="{ Component, route }">
        <div
          class="w-full lg:w-2/5 h-full flex-col"
          :class="{
            flex: !Component,
            'hidden md:flex': !!Component,
          }"
        >
          <div class="w-full h-full flex flex-col overflow-hidden relative">
            <slot :hasChildren="!!Component"></slot>
          </div>
        </div>
        <div
          class="w-full lg:w-3/5 h-full"
          :class="{
            block: Component,
            'hidden md:block': !Component,
          }"
        >
          <component v-if="Component" :is="Component" :key="route.path" />
          <slot v-else name="empty"></slot>
        </div>
      </router-view>
    </div>
  </div>
</template>

<style scoped></style>
