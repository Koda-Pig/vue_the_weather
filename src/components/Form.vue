<script setup lang="ts">
import type { Coords, FormState } from '@/types'
import PredictiveInput from './PredictiveInput.vue'
import { useLocationStorage } from '@/composables/useLocationStorage'
import { cn } from '@/lib/utils'
import Button from './ui/button/Button.vue'
import Loader from './Loader.vue'

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

function handleUseLastLocationClick() {
  useLastLocation()
  state.value = 'loading'
}
</script>

<template>
  <form @submit.prevent>
    <div
      :class="
        cn(
          'grid mb-4 relative',
          hasLastLocation && 'sm:grid-cols-2 gap-2',
          state === 'loading' && 'is-loading',
        )
      "
    >
      <Button class="w-full sm:w-auto" @click="getDeviceLocation">
        <span>get device location</span>
      </Button>
      <Button
        v-if="hasLastLocation"
        class="w-full sm:w-auto"
        @click="handleUseLastLocationClick"
      >
        use last location
      </Button>
      <Loader
        v-if="state === 'loading'"
        class="absolute inset-0 opacity-0 loader"
      />
    </div>

    <p
      class="before-and my-4 after:content-[''] after:h-0.5 after:w-full after:absolute relative after:inset-0 after:m-auto max-w-1/2 mx-auto"
    >
      or
    </p>

    <PredictiveInput v-model:state="state" v-model:coords="coords" />
  </form>
</template>

<style scoped lang="scss">
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

.is-loading {
  button {
    opacity: 0;
  }

  span {
    opacity: 1;
  }
}
</style>
