<script setup lang="ts">
  const props = withDefaults(defineProps<{ color?: string }>(), {
    color: 'currentColor',
  });
</script>

<template>
  <svg
    id="L4"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    x="0px"
    y="0px"
    viewBox="0 0 48 12"
    xml:space="preserve"
  >
    <circle :fill="props.color" stroke="none" cx="6" cy="6" r="6">
      <animate
        attributeName="opacity"
        dur="1s"
        values="0;1;0"
        repeatCount="indefinite"
        :begin="0.1"
      />
    </circle>
    <circle :fill="props.color" stroke="none" cx="24" cy="6" r="6">
      <animate
        attributeName="opacity"
        dur="1s"
        values="0;1;0"
        repeatCount="indefinite"
        :begin="0.2"
      />
    </circle>
    <circle :fill="props.color" stroke="none" cx="42" cy="6" r="6">
      <animate
        attributeName="opacity"
        dur="1s"
        values="0;1;0"
        repeatCount="indefinite"
        begin="0.3"
      />
    </circle>
  </svg>
</template>

<style scoped>
  svg {
    max-width: 50px;
    max-height: 25px;
    display: inline-block;
  }
</style>
