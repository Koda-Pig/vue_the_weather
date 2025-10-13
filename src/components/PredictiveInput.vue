<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Coords, FormState, LocationPrediction, BaseState } from '@/types'
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
import Loader from './Loader.vue'

const geoApifyKey = import.meta.env.VITE_APP_GEOAPIFY_KEY
const locationText = ref('')
const globalState = defineModel<FormState>('state')
const coords = defineModel<Coords | null>('coords')
const locationPrediction = ref<LocationPrediction | null>(null)
const noResultsFound = ref(false)
const predictionState = ref<BaseState | null>(null)
const MIN_CHAR_INPUT = 3

function handlePredictionClick(predictionCoords: Coords) {
  coords.value = { lat: predictionCoords.lat, lon: predictionCoords.lon }
}

async function getLocationPrediction() {
  if (!geoApifyKey) {
    globalState.value = 'error'
    throw new Error('GeoApify key is not set')
  }

  try {
    const response = await fetch(
      `https://api.geoapify.com/v1/geocode/autocomplete?text=${locationText.value}&apiKey=${geoApifyKey}`,
      { method: 'GET' },
    )
    const data = await response.json()
    locationPrediction.value = data

    const noFeatures = locationPrediction.value?.features?.length === 0
    const hasMinInput = locationText.value.trim().length > MIN_CHAR_INPUT

    noResultsFound.value = noFeatures && hasMinInput
    predictionState.value = 'success'
  } catch (error: unknown) {
    globalState.value = 'error'
    predictionState.value = 'error'
    throw new Error(
      typeof error === 'string'
        ? error
        : `An unknown error occurred while fetching location predictions: ${JSON.stringify(error)}`,
    )
  }
}

const debouncedGetLocationPrediction = debounce(getLocationPrediction, 1000)

watch(locationText, (newVal) => {
  const val = newVal.trim()
  if (val) {
    predictionState.value = 'loading'
    debouncedGetLocationPrediction()
  } else {
    predictionState.value = null
    noResultsFound.value = false
  }
})
</script>

<template>
  <div class="relative">
    <Combobox v-model="locationText">
      <ComboboxAnchor class="w-full text-center">
        <ComboboxInput
          id="location-input"
          class="w-full text-center border"
          placeholder="search location"
          v-model="locationText"
        />
      </ComboboxAnchor>

      <ComboboxList>
        <ComboboxEmpty v-if="noResultsFound"
          >No results found. Type better.</ComboboxEmpty
        >

        <Loader v-if="predictionState === 'loading'" />

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
</template>
