<script setup lang="ts">
import type { WeatherData } from '@/types'

const weatherData = defineModel<WeatherData>('weatherData')
</script>

<template>
  <h3>nothingg yet</h3>
  <p>{{ JSON.stringify(weatherData) }}</p>
</template>

<!-- Data eg:
{
  "coord": { "lon": 18.3723, "lat": -34.134 },
  "weather": [{ "id": 804, "main": "Clouds", "description": "overcast clouds", "icon": "04n" }],
  "base": "stations",
  "main": { "temp": 290.27, "feels_like": 289.6, "temp_min": 288.68, "temp_max": 291.54, "pressure": 1016, "humidity": 60, "sea_level": 1016, "grnd_level": 1015 },
  "visibility": 10000,
  "wind": { "speed": 4.37, "deg": 301, "gust": 4.76 },
  "clouds": { "all": 100 },
  "dt": 1760381903,
  "sys": { "type": 2, "id": 2087433, "country": "ZA", "sunrise": 1760328429, "sunset": 1760374680 },
  "timezone": 7200,
  "id": 3363441,
  "name": "Ocean View",
  "cod": 200
} -->
