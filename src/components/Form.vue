<script setup lang="ts">
// const openReadmeInEditor = () => fetch('/__open-in-editor?file=README.md')
import { ref } from 'vue'
const apiKey = import.meta.env.VITE_APP_OPENWEATHER_KEY
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

console.log(apiKey)
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <input type="text" name="city" id="city" />
    <!-- // this should have auto predict/ dropdown thing -->
    <label for="city">location name</label>
    <button>get location</button>
  </form>
</template>

<style scoped>
form {
  border: solid white;
  border-radius: 2px;
  padding: 16px;
  max-width: 60ch;
  margin-inline: auto;
  background: rgba(255 255 255/ 0.05);
}
button {
  margin-inline: auto;
  display: block;
  font-size: 1.5rem;
}
</style>
