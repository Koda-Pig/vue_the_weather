<script setup lang="ts">
import type { WeatherData } from '@/types'
import { CardDescription, CardTitle } from '@/components/ui/card'

const weatherData = defineModel<WeatherData>('weatherData')

// Helper function to convert Kelvin to Celsius
const kelvinToCelsius = (kelvin: number) => {
  return Math.round(kelvin - 273.15)
}

// Helper function to format timestamp to time
const formatTime = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <div v-if="weatherData" class="weather-container">
    <CardTitle class="text-3xl">
      {{ weatherData.name }}, {{ weatherData.sys.country }}
    </CardTitle>
    <CardDescription class="text-lg capitalize">
      {{ weatherData.weather[0].description }}
    </CardDescription>
    <!-- Main Temperature Display -->
    <div class="text-center py-4">
      <div class="text-6xl font-bold">
        {{ kelvinToCelsius(weatherData.main.temp) }}°C
      </div>
      <div class="text-lg text-muted-foreground mt-2">
        Feels like {{ kelvinToCelsius(weatherData.main.feels_like) }}°C
      </div>
    </div>

    <!-- Temperature Range -->
    <div class="grid grid-cols-2 gap-4 text-center mb-4">
      <div class="p-3 bg-secondary rounded-lg">
        <div class="text-sm text-muted-foreground">Min Temp</div>
        <div class="text-2xl font-semibold">
          {{ kelvinToCelsius(weatherData.main.temp_min) }}°C
        </div>
      </div>
      <div class="p-3 bg-secondary rounded-lg">
        <div class="text-sm text-muted-foreground">Max Temp</div>
        <div class="text-2xl font-semibold">
          {{ kelvinToCelsius(weatherData.main.temp_max) }}°C
        </div>
      </div>
    </div>

    <!-- Weather Details Grid -->
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
      <div class="p-3 border rounded-lg">
        <div class="text-sm text-muted-foreground">Humidity</div>
        <div class="text-xl font-semibold">
          {{ weatherData.main.humidity }}%
        </div>
      </div>
      <div class="p-3 border rounded-lg">
        <div class="text-sm text-muted-foreground">Wind Speed</div>
        <div class="text-xl font-semibold">
          {{ weatherData.wind.speed }} m/s
        </div>
      </div>
      <div class="p-3 border rounded-lg">
        <div class="text-sm text-muted-foreground">Pressure</div>
        <div class="text-xl font-semibold">
          {{ weatherData.main.pressure }} hPa
        </div>
      </div>
      <div class="p-3 border rounded-lg">
        <div class="text-sm text-muted-foreground">Visibility</div>
        <div class="text-xl font-semibold">
          {{ (weatherData.visibility / 1000).toFixed(1) }} km
        </div>
      </div>
      <div class="p-3 border rounded-lg">
        <div class="text-sm text-muted-foreground">Clouds</div>
        <div class="text-xl font-semibold">{{ weatherData.clouds.all }}%</div>
      </div>
      <div class="p-3 border rounded-lg">
        <div class="text-sm text-muted-foreground">Wind Gust</div>
        <div class="text-xl font-semibold">{{ weatherData.wind.gust }} m/s</div>
      </div>
    </div>

    <!-- Sun Times -->
    <div class="grid grid-cols-2 gap-4 pt-4">
      <div class="text-center">
        <div class="text-sm text-muted-foreground">Sunrise</div>
        <div class="text-lg font-semibold">
          {{ formatTime(weatherData.sys.sunrise) }}
        </div>
      </div>
      <div class="text-center">
        <div class="text-sm text-muted-foreground">Sunset</div>
        <div class="text-lg font-semibold">
          {{ formatTime(weatherData.sys.sunset) }}
        </div>
      </div>
    </div>
  </div>
  <div v-else class="text-center text-muted-foreground">
    <p>Something went horribly wrong.</p>
  </div>
</template>
