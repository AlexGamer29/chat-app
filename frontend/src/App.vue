<script setup>
import { RouterView } from 'vue-router'
import NavBar from './components/navbar/NavBar.vue'
import Alert from './components/alert/Alert.vue'
</script>

<template>
  <!-- <NavBar />
  <Alert /> -->
  <div>
    <router-view />
  </div>
</template>

<style lang="scss">
// Import the global SCSS styles
@import '../main.scss';
</style>
