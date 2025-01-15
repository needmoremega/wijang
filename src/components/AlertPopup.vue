<template>
  <div v-if="isVisible" class="modal modal-open">
    <div class="modal-box">
      <h3 class="font-bold text-lg mb-4">{{ message }}</h3>
      <div class="modal-action">
        <button @click="onCancel" class="btn">Batal</button>
        <button @click="onConfirm" class="btn btn-danger">Ya</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

// Props untuk menerima data dari parent
defineProps({
  isVisible: Boolean,
  message: String,
})

// Emit event untuk komunikasi ke parent
const emit = defineEmits(['confirm', 'cancel'])

// Fungsi untuk menangani tombol
const onConfirm = () => {
  emit('confirm')
}

const onCancel = () => {
  emit('cancel')
}
</script>

<style scoped>
/* Tambahkan styling jika diperlukan */
</style>
