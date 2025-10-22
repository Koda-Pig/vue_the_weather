<script setup lang="ts">
import type { WeatherData } from '@/types'
import { kelvinToCelsius, formatTime } from '@/funks'
import MetricCard from './MetricCard.vue'
import { computed } from 'vue'

const weatherData = defineModel<WeatherData>('weatherData')

// OpenWeatherMap icon codes to our custom SVG mapping
// OWM uses codes like: 01d (clear day), 01n (clear night), 02d (few clouds day), etc.
const iconMap: Record<string, string> = {
  '01d': '/icons/clear-day.svg',
  '01n': '/icons/clear-night.svg',
  '02d': '/icons/scattered-clouds.svg',
  '02n': '/icons/scattered-clouds.svg',
  '03d': '/icons/scattered-clouds.svg',
  '03n': '/icons/scattered-clouds.svg',
  '04d': '/icons/broken-clouds.svg',
  '04n': '/icons/broken-clouds.svg',
  '09d': '/icons/shower-rain.svg',
  '09n': '/icons/shower-rain.svg',
  '10d': '/icons/rain-day.svg',
  '10n': '/icons/rain-night.svg',
  '11d': '/icons/thunderstorms-day.svg',
  '11n': '/icons/thunderstorms-night.svg',
  '13d': '/icons/snow-day.svg',
  '13n': '/icons/snow-night.svg',
  '50d': '/icons/mist-day.svg',
  '50n': '/icons/mist-night.svg',
}

const weatherIcon = computed(() => {
  if (!weatherData.value) return ''

  const iconCode = weatherData.value.weather[0].icon
  return iconMap[iconCode] || '/icons/clear-day.svg'
})
</script>

<template>
  <div v-if="weatherData" class="weather-container">
    <h2 class="text-3xl font-semibold">
      {{ weatherData.name }}, {{ weatherData.sys.country }}
    </h2>

    <!-- Weather Icon and Description -->
    <div class="flex flex-col items-center py-4">
      <img
        v-if="weatherIcon"
        :src="weatherIcon"
        :alt="weatherData.weather[0].description"
        class="w-32 h-32 mb-4"
      />
      <p class="text-lg capitalize">
        {{ weatherData.weather[0].description }}
      </p>
    </div>

    <!-- Main Temperature Display -->
    <div class="text-center py-4">
      <div class="text-6xl font-bold">
        {{ kelvinToCelsius(weatherData.main.temp) }}°C
      </div>
      <div class="text-lg mt-2">
        Feels like {{ kelvinToCelsius(weatherData.main.feels_like) }}°C
      </div>
    </div>

    <!-- Temperature Range -->
    <div class="grid grid-cols-2 gap-4 text-center mb-4">
      <div class="p-3 bg-foreground rounded-lg text-background">
        <div class="text-sm">Min Temp</div>
        <div class="text-2xl font-semibold">
          {{ kelvinToCelsius(weatherData.main.temp_min) }}°C
        </div>
      </div>
      <div class="p-3 bg-foreground rounded-lg text-background">
        <div class="text-sm">Max Temp</div>
        <div class="text-2xl font-semibold">
          {{ kelvinToCelsius(weatherData.main.temp_max) }}°C
        </div>
      </div>
    </div>

    <!-- Weather Details Grid -->
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
      <MetricCard
        title="Humidity"
        :value="weatherData.main.humidity"
        unit="%"
      />
      <MetricCard
        title="Wind Speed"
        :value="weatherData.wind.speed"
        unit="m/s"
      />
      <MetricCard
        title="Pressure"
        :value="weatherData.main.pressure"
        unit="hPa"
      />
      <MetricCard
        title="Visibility"
        :value="(weatherData.visibility / 1000).toFixed(1)"
        unit="km"
      />
      <MetricCard title="Clouds" :value="weatherData.clouds.all" unit="%" />
      <MetricCard title="Wind Gust" :value="weatherData.wind.gust" unit="m/s" />
    </div>

    <!-- Sun Times -->
    <div class="grid grid-cols-2 gap-4 pt-4">
      <div class="text-center">
        <div class="text-sm text-white">Sunrise</div>
        <div class="text-lg font-semibold">
          {{ formatTime(weatherData.sys.sunrise) }}
        </div>
      </div>
      <div class="text-center">
        <div class="text-sm text-white">Sunset</div>
        <div class="text-lg font-semibold">
          {{ formatTime(weatherData.sys.sunset) }}
        </div>
      </div>
    </div>
  </div>
  <div v-else class="text-center text-white">
    <p>Something went horribly wrong.</p>
  </div>
</template>
