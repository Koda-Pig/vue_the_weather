<script setup lang="ts">
// const openReadmeInEditor = () => fetch('/__open-in-editor?file=README.md')
import { ref } from 'vue'
import Button from './ui/button/Button.vue'
import Card from './ui/card/Card.vue'

const openweatherKey = import.meta.env.VITE_APP_OPENWEATHER_KEY
const geoapifyKey = import.meta.env.VITE_APP_GEOAPIFY_KEY

const formData = ref({
  city: '',
})

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
}

function success(pos: GeolocationPosition) {
  const crd = pos.coords

  console.log('Your current position is:')
  console.log(`Latitude : ${crd.latitude}`)
  console.log(`Longitude: ${crd.longitude}`)
  console.log(`More or less ${crd.accuracy} meters.`)
}

function error(err: GeolocationPositionError) {
  console.warn(`ERROR(${err.code}): ${err.message}`)
}

function handleSubmit() {
  navigator.geolocation.getCurrentPosition(success, error, options)
}

console.log(openweatherKey)
console.log(geoapifyKey)
</script>

<template>
  <Card>
    <form
      @submit.prevent="handleSubmit"
      class="border border-white rounded-xs p-4 max-w-[60ch] mx-auto bg-[rgba(255,255,255,0.05)]"
    >
      <input type="text" name="city" id="city" />
      <!-- // this should have auto predict/ dropdown thing -->
      <label for="city">location name</label>
      <Button class="mx-auto block">get location</Button>
    </form>
  </Card>
</template>
