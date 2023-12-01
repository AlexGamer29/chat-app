<template>
  <div v-if="alert" class="container">
    <div @click="alertStore.clear()" class="btn btn-link close">
      <el-alert :title="alert.message" :type="alert.type" close-text="close" show-icon />
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'

import { useAlertStore } from '../../stores'

const alertStore = useAlertStore()
const { alert } = storeToRefs(alertStore)
</script>
