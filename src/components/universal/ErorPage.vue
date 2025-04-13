<template>
  <div class="flex flex-col items-center justify-center min-w-screen min-h-screen text-center">
    <img src="/src/assets/eror.png" alt="Nicole Demara" class="w-72 h-72" />
    <h1>404 Page Not Found</h1>
    <h2>Oops! Kamu Nyasar Nih</h2>
    <p>Sorry, the page you are looking for, does not exist.</p>

    <p class="text-gray-500 mb-6">Kembali ke halaman sebelumnya dalam {{ countdown }} detik...</p>
    <router-link class="btn btn-error" to="/">Go to Home</router-link>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const countdown = ref(10)
const router = useRouter()

onMounted(() => {
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
      router.go(-1)
    }
  }, 1500)
})
</script>
