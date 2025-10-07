<script setup lang="ts">
import { ref, watch } from 'vue'
import Button from './ui/button/Button.vue'
import Label from './ui/label/Label.vue'
import type { Coords, State, LocationPrediction } from '@/types'
import { debounce } from '@/funks'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-vue-next'
import {
  Combobox,
  ComboboxAnchor,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxList,
} from '@/components/ui/combobox'

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

// //  for there to be no results found there also needs to be a decent search term. It should probably have a min character limit too.
// let noResultsFound = false

// watch(locationPrediction, function () {
//   // showEmptyPredictions =
//   //   (locationPrediction.value?.features &&
//   //     locationPrediction.value.features.length > 0) ??
//   //   false
//   console.log(locationPrediction.value)
// })

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

function handlePredictionClick(predictionCoords: Coords) {
  coords.value = { lat: predictionCoords.lat, lon: predictionCoords.lon }
}

async function getLocationPrediction() {
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

const debouncedGetLocationPrediction = debounce(() => {
  getLocationPrediction()
}, 1000)

watch(locationText, (newVal) => {
  const val = newVal.trim()
  if (val) debouncedGetLocationPrediction()
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

    <Label for="location-name" class="block my-4">search location</Label>
    <div class="relative">
      <Combobox v-model="locationText">
        <ComboboxAnchor class="w-full border">
          <ComboboxInput
            id="location-input"
            class="w-full"
            placeholder="location..."
            v-model="locationText"
          />
        </ComboboxAnchor>

        <ComboboxList>
          <ComboboxEmpty v-if="false">No.</ComboboxEmpty>

          <ComboboxGroup>
            <ComboboxItem
              v-for="guess in locationPrediction?.features"
              :key="`${guess.properties.lat}-${guess.properties.lon}`"
              :value="guess.properties.formatted"
              @click="
                handlePredictionClick({
                  lon: guess.properties.lon,
                  lat: guess.properties.lat,
                })
              "
            >
              {{ guess.properties.formatted }}

              <ComboboxItemIndicator>
                <Check :class="cn('ml-auto h-4 w-4')" />
              </ComboboxItemIndicator>
            </ComboboxItem>
          </ComboboxGroup>
        </ComboboxList>
      </Combobox>
    </div>
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
