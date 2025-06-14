<script setup lang="ts">
import { defineProps, onMounted, ref, useTemplateRef, watch } from 'vue';

const rootElement = useTemplateRef('root-element');

const isImageLoaded = ref(false);

const props = withDefaults(
  defineProps<{
    src: string;
    loading?: 'lazy' | 'eager';
  }>(),
  {
    loading: 'eager',
  },
);

const loadImage = () => {
  const image = new Image();
  image.src = props.src;
  image.onload = () => {
    isImageLoaded.value = true;
  };
};

const init = () => {
  isImageLoaded.value = false;

  if (!rootElement.value) {
    return;
  }

  if (props.loading === 'eager') {
    loadImage();
    return;
  }

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        loadImage();
        imageObserver.unobserve(rootElement.value!);
      }
    });
  });

  imageObserver.observe(rootElement.value);
};

watch(() => props.src, init);

onMounted(init);
</script>

<template>
  <div ref="root-element" class="overflow-hidden">
    <Transition name="fade" mode="out-in">
      <img
        v-if="isImageLoaded"
        class="w-full h-full object-cover"
        :src="props.src"
        :alt="$attrs.alt as string"
      />
      <div v-else class="w-full h-full relative">
        <div class="w-full h-full flex items-center justify-center loading"></div>
      </div>
    </Transition>
  </div>
</template>

<style>
.loading {
  position: relative;
  background-color: #ededed;
  overflow: hidden;
}

.loading::after {
  display: block;
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  transform: translateX(-100%);
  animation: 2s loading linear 0.5s infinite;
  background: linear-gradient(90deg, transparent, rgba(100, 100, 100, 0.1), transparent);
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  z-index: 1;
}

@keyframes loading {
  0% {
    transform: translateX(-100%);
  }

  60% {
    transform: translateX(100%);
  }

  100% {
    transform: translateX(100%);
  }
}
</style>
