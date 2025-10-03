<script setup lang="ts">
import { ref } from 'vue'
import Form from './components/Form.vue'
import WeatherDisplay from './components/WeatherDisplay.vue'
import Card from './components/ui/card/Card.vue'
import CardContent from './components/ui/card/CardContent.vue'

const hasSubmitted = ref(false)
</script>

<template>
  <main class="p-4 md:p-8">
    <Card class="w-[60ch] mx-auto text-center">
      <h1 class="text-xl">Vue Weather</h1>
      <CardContent class="">
        <Form v-if="!hasSubmitted" v-model="hasSubmitted" />
        <WeatherDisplay v-else />
      </CardContent>
    </Card>
  </main>
</template>
