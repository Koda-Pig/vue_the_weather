<script setup lang="ts">
import { cn } from '@/lib/utils'

type Props = {
  class?: HTMLButtonElement['className']
}

const props = defineProps<Props>()
</script>

<template>
  <button
    :class="
      cn(
        props.class,
        'inline-block border border-foreground rounded-md px-4 py-2 w-full sm:w-auto hover:bg-background transition-colors duration-300',
      )
    "
  >
    <slot />
  </button>
</template>
