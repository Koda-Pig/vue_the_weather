<script setup lang="ts">
import { ref, watch } from 'vue'
import Button from './ui/button/Button.vue'
import Label from './ui/label/Label.vue'
import Input from './ui/input/Input.vue'
import type { Coords, State, LocationPrediction } from '@/types'
import { debounce } from '@/funks'

const geoApifyKey = import.meta.env.VITE_APP_GEOAPIFY_KEY
const locationText = ref('')
const state = defineModel<State>('state')
const coords = defineModel<Coords | null>('coords')
const locationPrediction = ref<LocationPrediction | null>(null)

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

async function getLocationPrediction(input: string) {
  if (!geoApifyKey) {
    state.value = 'error'
    throw new Error('GeoApify key is not set')
  }

  try {
    const response = await fetch(
      `https://api.geoapify.com/v1/geocode/autocomplete?text=${locationText.value}&apiKey=${geoApifyKey}`,
      { method: 'GET' },
    )
    const data = await response.json()
    locationPrediction.value = data
  } catch (error: unknown) {
    state.value = 'error'
    throw new Error(
      typeof error === 'string'
        ? error
        : `An unknown error occurred: ${JSON.stringify(error)}`,
    )
  }
}

const debouncedGetLocationPrediction = debounce((val: string) => {
  getLocationPrediction(val)
}, 1000)

watch(locationText, (newVal) => {
  const val = newVal.trim()
  if (val) debouncedGetLocationPrediction(val)
})
</script>

<template>
  <form>
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
      class="before-and my-4 after:content-[''] after:h-0.5 after:w-full after:absolute relative after:inset-0 after:m-auto"
    >
      or
    </p>

    <div>
      <Label for="location-name" class="block my-4">search location</Label>
      <Input
        type="text"
        name="location-name"
        id="location-name"
        placeholder="location name"
        class="text-center"
        v-model="locationText"
      />
      <ul>
        <li v-for="guess in locationPrediction?.features">
          {{ guess.properties.country }}
        </li>
      </ul>
    </div>
    <Button type="button" class="block mx-auto mt-4" size="lg"
      >search location Name</Button
    >
  </form>
</template>

<style scoped>
/* this creates a line behind the 'or' text and the calcs with the 'ch' (1 character) unit account for the width of the text */
.before-and:after {
  background: linear-gradient(
    to right,
    transparent,
    gray calc(50% - 1.5ch),
    transparent 0 calc(50% + 1.5ch),
    gray 0,
    transparent
  );
}
</style>
