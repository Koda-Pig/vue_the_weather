<script setup lang="ts">
import Button from './ui/button/Button.vue'
import Label from './ui/label/Label.vue'
import Input from './ui/input/Input.vue'
import type { Coords, State } from '@/types'

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
  <div>
    <Button size="lg" class="block mx-auto" @click="getDeviceLocation">
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
      />

      <!-- <Select>
              <SelectTrigger id="framework">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="nuxt"> Nuxt </SelectItem>
                <SelectItem value="next"> Next.js </SelectItem>
                <SelectItem value="sveltekit"> SvelteKit </SelectItem>
                <SelectItem value="astro"> Astro </SelectItem>
              </SelectContent>
            </Select> -->
    </div>
    <Button class="block mx-auto mt-4" size="lg">search location Name</Button>
  </div>
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
