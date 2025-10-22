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
const abortController = ref<AbortController | null>(null)
const locationPrediction = ref<LocationPrediction | null>(null)
const noResultsFound = ref(false)
const predictionState = ref<BaseState | null>(null)
const MIN_CHAR_INPUT = 3 // 3 characters are minimum input for predictive location to function

function handlePredictionClick(predictionCoords: Coords) {
  const { lat, lon } = predictionCoords
  coords.value = { lat, lon }
}

async function getLocationPrediction() {
  if (!geoApifyKey) {
    globalState.value = 'error'
    throw new Error('GeoApify key is not set')
  }

  // Cancel previous request
  if (abortController.value) {
    abortController.value.abort()
    abortController.value = null
  }

  if (locationText.value.trim().length < MIN_CHAR_INPUT) {
    console.log('Cancel search.')
    return
  }

  abortController.value = new AbortController()

  predictionState.value = 'loading'
  noResultsFound.value = false

  try {
    const response = await fetch(
      `https://api.geoapify.com/v1/geocode/autocomplete?text=${locationText.value}&apiKey=${geoApifyKey}`,
      { method: 'GET', signal: abortController.value.signal },
    )
    const data = await response.json()
    locationPrediction.value = data

    const noFeatures = !!(locationPrediction.value?.features?.length === 0)

    predictionState.value = 'success'
    noResultsFound.value = noFeatures
  } catch (error: unknown) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      console.log('abort fetch of new predictions')
      return // Ignore aborted requests
    }
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
  if (val.length > MIN_CHAR_INPUT) {
    debouncedGetLocationPrediction()
  } else {
    if (abortController.value) abortController.value.abort()
    predictionState.value = null
    noResultsFound.value = false
    locationPrediction.value = null
  }
})
</script>

<template>
  <div class="relative">
    <Combobox v-model="locationText" :ignore-filter="true">
      <ComboboxAnchor class="mx-auto">
        <ComboboxInput
          id="location-input"
          class="w-full text-center border border-foreground placeholder:text-foreground placeholder:text-base"
          placeholder="search location"
          v-model="locationText"
        />
      </ComboboxAnchor>

      <ComboboxList v-if="predictionState !== null">
        <ComboboxEmpty v-if="predictionState === 'loading'">
          <Loader />
        </ComboboxEmpty>
        <ComboboxEmpty v-else-if="noResultsFound">
          <p class="px-2">No results found. Type better.</p>
        </ComboboxEmpty>
        <ComboboxEmpty v-else-if="predictionState === 'error'">
          <p class="px-2">Error loading locations. Please try again.</p>
        </ComboboxEmpty>
        <ComboboxGroup v-else>
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
