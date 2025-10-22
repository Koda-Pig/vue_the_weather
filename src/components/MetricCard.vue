<script setup lang="ts">
type Props = {
  title: string
  value: string | number
  unit?: string // Eg: %
}
defineProps<Props>()
</script>

<template>
  <div class="p-3 border border-foreground rounded-lg">
    <div class="text-sm text-white">{{ title }}</div>
    <div class="text-xl font-semibold">
      {{ value }}<span v-if="unit" class="ml-0.5">{{ unit }}</span>
    </div>
  </div>
</template>
