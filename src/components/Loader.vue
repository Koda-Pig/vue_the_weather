<script setup lang="ts"></script>

<template>
  <span class="loader"></span>
</template>

<style scoped lang="scss">
.loader {
  width: 48px;
  height: 48px;
  display: inline-block;
  position: relative;
  &::after,
  &::before {
    content: '';
    box-sizing: border-box;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 2px solid #000;
    position: absolute;
    left: 0;
    top: 0;
    animation: animloader 2s linear infinite;
  }
  &::after {
    animation-delay: 1s;
  }
}

@keyframes animloader {
  0% {
    scale: 0;
    opacity: 1;
  }
  100% {
    scale: 1;
    opacity: 0;
  }
}
</style>
