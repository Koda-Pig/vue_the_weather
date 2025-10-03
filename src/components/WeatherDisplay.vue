<script setup lang="ts">
import type { WeatherData } from '@/types'

const weatherData = defineModel<WeatherData | null>('weatherData')
</script>

<template>
  <h3>nothingg yet</h3>
  <p>{{ JSON.stringify(weatherData) }}</p>
</template>
