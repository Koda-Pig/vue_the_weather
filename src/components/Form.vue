<script setup lang="ts">
import type { Coords, FormState } from '@/types'
import { cn } from '@/lib/utils'
import { toast } from 'vue-sonner'
import PredictiveInput from './PredictiveInput.vue'
import { useLocationStorage } from '@/composables/useLocationStorage'
import Button from './ui/button/Button.vue'
import Loader from './Loader.vue'

const state = defineModel<FormState>('state')
const coords = defineModel<Coords | null>('coords')
const errorMessage = defineModel<string | null>('errorMessage')
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
  console.error(`ERROR(${err.code}): ${err.message}`)
  let displayedMsg: string

  switch (err.code) {
    case err.PERMISSION_DENIED:
      displayedMsg =
        'Location access denied. Please enable location permissions in your browser settings.'
      break
    case err.POSITION_UNAVAILABLE:
      displayedMsg =
        'Location information unavailable. Please check your device settings.'
      break
    case err.TIMEOUT:
      displayedMsg = 'Location request timed out. Please try again.'
      break
    default:
      displayedMsg = `Unable to get location: ${err.message}`
  }
  errorMessage.value = displayedMsg
  toast.error(displayedMsg)
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

    <PredictiveInput
      v-model:state="state"
      v-model:coords="coords"
      v-model:error-message="errorMessage"
    />
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
