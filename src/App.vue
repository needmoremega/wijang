<template>
  <RouterView />
  <ToastCompo ref="toastRef" />
</template>

<script setup>
import { ref, provide } from 'vue'
import ToastCompo from './components/universal/toastCompo.vue'

const toastRef = ref()
provide('toast', toastRef)
</script>
