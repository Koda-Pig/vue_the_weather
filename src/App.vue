<script setup lang="ts">
import { ref, watch } from 'vue'
import { cn } from './lib/utils'
import Form from './components/Form.vue'
import WeatherDisplay from './components/WeatherDisplay.vue'
import type { Coords, WeatherData, FormState } from '@/types'
import { useLocationStorage } from '@/composables/useLocationStorage'
import Button from './components/ui/button/Button.vue'
import { setBodyClass } from './lib/utils'
import { Toaster } from './components/ui/sonner'
import { toast } from 'vue-sonner'
import 'vue-sonner/style.css'

const openweatherKey = import.meta.env.VITE_APP_OPENWEATHER_KEY
const weatherData = ref<WeatherData | null>(null)

const state = ref<FormState>('unsubmitted')
const errorMessage = ref<string | null>(null)
const coords = ref<Coords | null>(null)
const { saveLastLocation } = useLocationStorage()

setBodyClass()

watch(coords, (newCoords) => {
  if (newCoords) {
    getCurrentWeather(newCoords)
    ;(document.activeElement as HTMLElement)?.blur()
  }
})

async function getCurrentWeather({ lat, lon }: Coords) {
  if (!openweatherKey) {
    state.value = 'error'
    const message = 'Openweather key is not set'
    errorMessage.value = message
    toast.error(message)
    console.error(message)
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
    const message =
      typeof error === 'string'
        ? error
        : `An unknown error occurred: ${JSON.stringify(error)}`
    toast.error(message)
    errorMessage.value = message
    console.error(message)
  }
}

function reset() {
  state.value = 'unsubmitted'
  coords.value = null
  weatherData.value = null
}
</script>

<template>
  <main class="p-4 md:p-8 space-y-4">
    <Button
      class="ml-auto align-self-start z-10 bg-background/50 !w-min"
      @click="reset"
      >reset</Button
    >
    <div
      :class="
        cn(
          'main-card w-[min(100%,42ch)] mx-auto text-center relative  px-4 py-6 rounded-2xl',
          state === 'success' && weatherData && 'successful',
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
        v-model:error-message="errorMessage"
      />
      <WeatherDisplay
        v-else-if="state === 'success' && weatherData"
        v-model:weatherData="weatherData"
      />
      <p v-else-if="state === 'error'" class="text-red-100">
        {{ errorMessage }}
        <Button class="bg-background/50 !block mx-auto mt-4" @click="reset"
          >reset</Button
        >
      </p>
    </div>
  </main>
  <Toaster />
</template>

<style scoped lang="scss">
main {
  display: flex;
  flex-direction: column;
  place-items: center;
  min-height: 100dvh;
}

.main-card {
  transition-property: background-color, backdrop-filter;
  transition-timing-function: ease-out;
  transition-duration: 0.3s;
  background-color: #40666acc;
  backdrop-filter: blur(4px);

  &.successful {
    background-color: #40666aaa;
    backdrop-filter: blur(3px);
  }
}
</style>

<style lang="scss">
@use 'sass:map';

body {
  background: url('') center / cover no-repeat fixed var(--background);

  $themes: (
    'dark': '',
    'light': '.day-time',
  );

  // breakpoints and resolutions
  $sizes: (
    'base': (
      '1x': '1024x576',
      '2x': '2048x1152',
    ),
    '1024': (
      '1x': '1920x1080',
      '2x': '3840x2160',
    ),
    '1920': (
      '1x': '2048x1152',
      '2x': '3840x2160',
    ),
    '2048': (
      'url': '3840x2160',
    ),
  );

  // Sets the background image for the body based on the theme (day/ night), resolution, and pixel density
  @each $theme-name, $selector-suffix in $themes {
    &#{$selector-suffix} {
      @each $breakpoint, $resolutions in $sizes {
        @if $breakpoint == 'base' {
          background-image: image-set(
            url('/images/#{$theme-name}-#{map.get($resolutions, "1x")}.webp')
              1x,
            url('/images/#{$theme-name}-#{map.get($resolutions, "2x")}.webp') 2x
          );
        } @else {
          @media (min-width: calc(#{$breakpoint} * 1px)) {
            @if map.has-key($resolutions, 'url') {
              background-image: url('/images/#{$theme-name}-#{map.get($resolutions, "url")}.webp');
            } @else {
              background-image: image-set(
                url('/images/#{$theme-name}-#{map.get($resolutions, "1x")}.webp')
                  1x,
                url('/images/#{$theme-name}-#{map.get($resolutions, "2x")}.webp')
                  2x
              );
            }
          }
        }
      }
    }
  }
}
</style>
