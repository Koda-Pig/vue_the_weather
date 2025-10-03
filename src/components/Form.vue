<script setup lang="ts">
// const openReadmeInEditor = () => fetch('/__open-in-editor?file=README.md')
import { ref } from 'vue'
</script>

<template>
  <form>
    <button>vue weather</button>
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
