<script setup lang="ts">
import { ref, watch } from 'vue'
import Form from './components/Form.vue'
import WeatherDisplay from './components/WeatherDisplay.vue'
import Card from './components/ui/card/Card.vue'
import CardContent from './components/ui/card/CardContent.vue'
import Button from './components/ui/button/Button.vue'
import type { Coords, WeatherData, State } from '@/types'

const openweatherKey = import.meta.env.VITE_APP_OPENWEATHER_KEY
const weatherData = ref<WeatherData | null>(null)

const state = ref<State>('unsubmitted')
const coords = ref<Coords | null>(null)

watch(coords, (newCoords) => {
  if (newCoords) {
    getCurrentWeather(newCoords)
  }
})

watch(state, (newState) => {
  console.log('state', newState)
})

async function getCurrentWeather({ lat, lon }: Coords) {
  if (!openweatherKey) {
    state.value = 'error'
    throw new Error('Openweather key is not set')
  }
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${openweatherKey}`
  try {
    const response = await fetch(url)
    const data = await response.json()
    if (data) {
      weatherData.value = data
      state.value = 'success'
    }
  } catch (error: unknown) {
    state.value = 'error'
    throw new Error(
      typeof error === 'string'
        ? error
        : `An unknown error occurred: ${JSON.stringify(error)}`,
    )
  }
}

function reset() {
  state.value = 'unsubmitted'
  coords.value = null
}
</script>

<template>
  <main class="p-4 md:p-8 h-full">
    <Button class="absolute top-4 right-4" @click="reset"> reset </Button>
    <Card class="w-[60ch] mx-auto text-center relative">
      <h1 class="text-xl">Vue Weather</h1>
      <CardContent class="">
        <Form
          v-if="state === 'unsubmitted' || state === 'loading'"
          v-model:state="state"
          v-model:coords="coords"
        />
        <WeatherDisplay
          v-else-if="state === 'success'"
          v-model:weatherData="weatherData"
        />
        <p v-else-if="state === 'error'" class="text-red-500">
          An error occurred
        </p>
      </CardContent>
    </Card>
  </main>
</template>

<style scoped lang="css">
main {
  background-image:
    radial-gradient(
      ellipse at 70% 60%,
      rgba(152, 144, 227, 0.45) 0%,
      transparent 55%
    ),
    radial-gradient(
      circle at 25% 85%,
      rgba(152, 144, 227, 0.5) 0%,
      transparent 45%
    ),
    radial-gradient(
      circle at 55% 15%,
      rgba(177, 244, 207, 0.4) 0%,
      transparent 50%
    ),
    linear-gradient(135deg, #9890e3 0%, #b1f4cf 100%);
}
</style>
