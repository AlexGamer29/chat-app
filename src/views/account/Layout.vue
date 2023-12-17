<script setup>
import { useAuthStore } from '../../stores'
import { router } from '../../router'

// redirect home if already logged in
const authStore = useAuthStore()
if (authStore.user) {
  router.push('/')
}
</script>

<template>
  <div class="container" style="display: flex; justify-content: center">
    <router-view />
  </div>
</template>
