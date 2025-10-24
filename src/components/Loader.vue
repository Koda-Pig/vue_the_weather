<script setup lang="ts">
import { cn } from '@/lib/utils'

type Props = {
  class?: HTMLSpanElement['className']
}

const props = defineProps<Props>()
</script>

<template>
  <span
    :class="cn('m-auto loader relative w-12 h-12 inline-block', props.class)"
  />
</template>

<style scoped lang="scss">
.loader {
  &::after,
  &::before {
    content: '';
    box-sizing: border-box;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 2px solid var(--foreground);
    position: absolute;
    left: 0;
    top: 0;
    animation: animloader 2s linear infinite;
  }
  &::after {
    animation-delay: 1s;
  }
}

@keyframes animloader {
  0% {
    scale: 0;
    opacity: 1;
  }
  100% {
    scale: 1;
    opacity: 0;
  }
}
</style>
