<script setup lang="ts">
import { ref, watch } from 'vue'
import { cn } from './lib/utils'
import Form from './components/Form.vue'
import WeatherDisplay from './components/WeatherDisplay.vue'
import type { Coords, WeatherData, FormState } from '@/types'
import { useLocationStorage } from '@/composables/useLocationStorage'

const openweatherKey = import.meta.env.VITE_APP_OPENWEATHER_KEY
const weatherData = ref<WeatherData | null>(null)

const state = ref<FormState>('unsubmitted')
const coords = ref<Coords | null>(null)
const { saveLastLocation } = useLocationStorage()

watch(coords, (newCoords) => {
  if (newCoords) {
    getCurrentWeather(newCoords)
    ;(document.activeElement as HTMLElement)?.blur()
  }
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
    if (!data) return

    weatherData.value = data
    state.value = 'success'

    if (!coords.value) return

    saveLastLocation(coords.value)
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
  weatherData.value = null
}
</script>

<template>
  <main class="p-4 md:p-8">
    <button
      class="fixed top-2 right-2 z-10 border border-foreground rounded-md px-3 py-1"
      @click="reset"
    >
      reset
    </button>
    <div
      :class="
        cn(
          'w-[min(100%,40ch)] mx-auto text-center relative  px-4 py-6 rounded-2xl',
          state === 'success' && weatherData ? 'fancy-bg' : 'bg-background',
        )
      "
    >
      <h1 v-if="state !== 'success' && !weatherData" class="text-2xl mb-4">
        Vue Weather
      </h1>

      <Form
        v-if="state === 'unsubmitted' || state === 'loading'"
        v-model:state="state"
        v-model:coords="coords"
      />
      <WeatherDisplay
        v-else-if="state === 'success' && weatherData"
        v-model:weatherData="weatherData"
      />
      <p v-else-if="state === 'error'" class="text-red-500">
        An error occurred
      </p>
    </div>
  </main>
</template>

<style scoped lang="scss">
main {
  display: grid;
  place-items: center;
  min-height: 100dvh;
}

.fancy-bg {
  background: radial-gradient(circle, #40666aaa, #40666aaa);
  backdrop-filter: blur(4px);
}
</style>
