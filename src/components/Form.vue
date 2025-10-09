<script setup lang="ts">
import Button from './ui/button/Button.vue'
import type { Coords, State } from '@/types'
import PredictiveInput from './PredictiveInput.vue'

const state = defineModel<State>('state')
const coords = defineModel<Coords | null>('coords')

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
</script>

<template>
  <form @submit.prevent>
    <Button
      type="button"
      size="lg"
      class="block mx-auto"
      @click="getDeviceLocation"
    >
      <span v-if="state === 'loading'"> loading...</span>
      <span v-else>get device location</span>
    </Button>

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
    rgba(0, 0, 0, 0.1) calc(50% - 1.5ch),
    transparent 0 calc(50% + 1.5ch),
    rgba(0, 0, 0, 0.1) 0,
    transparent
  );
}
</style>
