,
<script setup>
import LoginPage from '../components/LoginPage.vue'
import RegisterPage from '../components/RegisterPage.vue'
import { ref } from 'vue'
const PindahForm = ref(false)
</script>
<template>
  <div class="flex justify-center items-center h-screen max-w-full min-w-32">
    <div class="card bg-blue-500 w-1/3 p-5">
      <div class="flex justify-center">
        <img src="/src/assets/gibrna.jpg" alt="Icon" class="w-48 h-42" />
      </div>

      <h3 class="text-center text-2xl font-bold text-white my-4">
        {{ PindahForm ? 'Login' : 'Register' }}
      </h3>

      <LoginPage v-if="PindahForm" />
      <RegisterPage v-else />

      <!-- Tombol untuk berpindah antara Login & Register -->
      <button class="btn btn-outline w-full mt-3" @click="PindahForm = !PindahForm">
        {{ PindahForm ? 'Belum punya akun? Register' : 'Sudah punya akun? Login' }}
      </button>
    </div>
  </div>
</template>
