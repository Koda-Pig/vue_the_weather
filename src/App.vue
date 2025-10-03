<script setup lang="ts">
import Form from './components/Form.vue'
import Card from './components/ui/card/Card.vue'
import CardContent from './components/ui/card/CardContent.vue'
</script>

<template>
  <main class="p-4 md:p-8">
    <Card class="w-[60ch] mx-auto text-center">
      <h1 class="text-xl">Vue Weather</h1>
      <CardContent class="">
        <Form />
      </CardContent>
    </Card>
  </main>
</template>
