<script setup lang="ts">
// const openReadmeInEditor = () => fetch('/__open-in-editor?file=README.md')
import { ref } from 'vue'
import Button from './ui/button/Button.vue'
import Label from './ui/label/Label.vue'
import Input from './ui/input/Input.vue'
import Card from './ui/card/Card.vue'
import CardContent from './ui/card/CardContent.vue'
import CardFooter from './ui/card/CardFooter.vue'

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

function getDeviceLocation() {
  navigator.geolocation.getCurrentPosition(success, error, options)
}

console.log(openweatherKey)
console.log(geoapifyKey)
</script>

<template>
  <Card class="w-[60ch] mx-auto text-center">
    <h1 class="text-xl">Vue Weather</h1>
    <CardContent class="">
      <!-- // this should have auto predict/ dropdown thing -->
      <Button size="lg" class="block mx-auto" @click="getDeviceLocation"
        >get device location</Button
      >

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
    </CardContent>
    <CardFooter>
      <Button class="block mx-auto" size="lg">search location Name</Button>
    </CardFooter>
  </Card>
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
