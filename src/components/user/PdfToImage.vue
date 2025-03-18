<template>
  <div>
    <input type="file" @change="handleFileUpload" accept="application/pdf" />
    <input class="" type="text" v-model="customName" placeholder="Masukkan nama file" />
    <button @click="convertPdf">Convert</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const file = ref(null)
const customName = ref('') // Nama yang diinput user

const handleFileUpload = (event) => {
  file.value = event.target.files[0]
}

const convertPdf = async () => {
  if (!file.value || !customName.value) {
    alert('Pilih file dan masukkan nama!')
    return
  }

  const formData = new FormData()
  formData.append('file', file.value)
  formData.append('customName', customName.value) // Kirim nama kustom

  try {
    const response = await fetch('http://localhost:3001/convert', {
      method: 'POST',
      body: formData,
    })
    const data = await response.json()
    console.log('Response:', data)
  } catch (error) {
    console.error('Conversion Error:', error)
  }
}
</script>
