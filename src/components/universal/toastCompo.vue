<template>
  <div class="fixed top-4 right-4 z-[9999] space-y-2">
    <div
      v-for="(toast, index) in toasts"
      :key="index"
      class="alert shadow-lg transition transform duration-300"
      :class="{
        'alert-success': toast.type === 'success',
        'alert-error': toast.type === 'error',
        'alert-warning': toast.type === 'warning',
        'alert-info': toast.type === 'info',
      }"
    >
      <span>{{ toast.message }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const toasts = ref([])

// Fungsi global untuk dipakai di mana saja
function showToast(message, type = 'info', duration = 3000) {
  const id = Date.now()
  toasts.value.push({ id, message, type })

  setTimeout(() => {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }, duration)
}

// Biar bisa dipakai di luar komponen
defineExpose({ showToast })
</script>
