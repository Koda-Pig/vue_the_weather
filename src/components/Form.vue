<script setup lang="ts">
import type { Coords, FormState } from '@/types'
import PredictiveInput from './PredictiveInput.vue'
import { useLocationStorage } from '@/composables/useLocationStorage'
import { cn } from '@/lib/utils'

const state = defineModel<FormState>('state')
const coords = defineModel<Coords | null>('coords')
const { hasLastLocation, getLastLocation } = useLocationStorage()

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
}

function success(pos: GeolocationPosition) {
  const crd = pos.coords
  coords.value = { lat: crd.latitude, lon: crd.longitude }
}

function error(err: GeolocationPositionError) {
  console.warn(`ERROR(${err.code}): ${err.message}`)
  state.value = 'error'
}

function getDeviceLocation() {
  state.value = 'loading'
  navigator.geolocation.getCurrentPosition(success, error, options)
}

function useLastLocation() {
  const lastCoords = getLastLocation()
  if (lastCoords) coords.value = lastCoords
}
</script>

<template>
  <form @submit.prevent>
    <div :class="cn(hasLastLocation && 'sm:grid-cols-2 gap-2', 'grid mb-4')">
      <button
        v-if="hasLastLocation"
        type="button"
        class="block border border-foreground rounded-md px-3 py-2 w-full sm:w-auto"
        @click="useLastLocation"
      >
        use last location
      </button>

      <button
        type="button"
        class="block border border-foreground rounded-md px-3 py-2 w-full sm:w-auto"
        @click="getDeviceLocation"
      >
        <span v-if="state === 'loading'"> loading...</span>
        <span v-else>get device location</span>
      </button>
    </div>

    <p
      class="before-and my-4 after:content-[''] after:h-0.5 after:w-full after:absolute relative after:inset-0 after:m-auto max-w-1/2 mx-auto"
    >
      or
    </p>

    <PredictiveInput v-model:state="state" v-model:coords="coords" />
  </form>
</template>

<style scoped>
/* this creates a line behind the 'or' text and the calcs with the 'ch' (1 character) unit account for the width of the text */
.before-and:after {
  background: linear-gradient(
    to right,
    transparent,
    var(--foreground) calc(50% - 1.5ch),
    transparent 0 calc(50% + 1.5ch),
    var(--foreground) 0,
    transparent
  );
}
</style>
