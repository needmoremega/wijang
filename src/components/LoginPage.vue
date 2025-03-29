<template>
  <form
    @submit.prevent="login"
    class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md"
  >
    <!-- Username Input -->
    <div class="form-control my-2">
      <label
        class="input input-bordered flex items-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded"
      >
        <input
          v-model="isiLogin.username"
          type="text"
          class="grow bg-transparent focus:outline-none"
          placeholder="Username"
          autocomplete="username"
        />
      </label>
    </div>

    <!-- Password Input -->
    <div class="form-control my-1 relative">
      <label
        class="input input-bordered flex items-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded"
      >
        <input
          :type="showPassword ? 'text' : 'password'"
          v-model="isiLogin.password"
          class="grow bg-transparent focus:outline-none"
          placeholder="Password"
          autocomplete="current-password"
        />
      </label>
      <button
        type="button"
        class="absolute right-3 top-3 text-gray-500 dark:text-gray-300"
        @click="togglePassword"
      >
        👁️
      </button>
    </div>

    <!-- Remember Me -->
    <div class="flex items-center justify-between my-2">
      <label class="flex items-center text-gray-900 dark:text-gray-200">
        <input type="checkbox" v-model="rememberMe" class="mr-2" /> Remember Me
      </label>
    </div>

    <!-- Login Button -->
    <div class="form-control my-2 flex items-center">
      <button
        :disabled="loading"
        class="btn btn-primary w-full dark:bg-blue-600 dark:hover:bg-blue-700 flex items-center justify-center py-2"
      >
        <span v-if="loading" class="flex items-center">
          <svg
            class="animate-spin h-5 w-5 mr-3 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          Logging in...
        </span>
        <span v-else>Login</span>
      </button>
    </div>
  </form>

  <!-- Error Toast (Top Center) -->
  <div v-if="showToast" class="toast fixed top-4 left-1/2 z-50" style="transform: translateX(-50%)">
    <div class="alert alert-info toast-content">
      <span>{{ errorMessage }}</span>
    </div>
  </div>

  <!-- Success Toast (Top Center) -->
  <div
    v-if="showSuccess"
    class="toast fixed top-4 left-1/2 z-50"
    style="transform: translateX(-50%)"
  >
    <div class="alert alert-success toast-content">
      <span>{{ successMessage }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { database, ref as dbRef, get } from '@/firebase'

const isiLogin = ref({ username: '', password: '' })
const loading = ref(false)
const showPassword = ref(false)
const rememberMe = ref(false)
const router = useRouter()

const showToast = ref(false)
const errorMessage = ref('')
const showSuccess = ref(false)
const successMessage = ref('')

// Fungsi untuk menampilkan toast error
const showError = (message) => {
  errorMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

// Fungsi untuk menampilkan toast sukses
const showSuccessToast = (message) => {
  successMessage.value = message
  showSuccess.value = true
  setTimeout(() => {
    showSuccess.value = false
  }, 1500)
}

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const login = async () => {
  errorMessage.value = ''
  loading.value = true

  if (!isiLogin.value.username || !isiLogin.value.password) {
    showError('Username dan password tidak boleh kosong')
    loading.value = false
    return
  }

  try {
    const userRef = dbRef(database, `user/${isiLogin.value.username}`)
    const userSnapshot = await get(userRef)

    if (!userSnapshot.exists()) {
      showError('Username atau password salah')
      return
    }

    const userData = userSnapshot.val()

    if (userData.password === isiLogin.value.password) {
      localStorage.setItem('user', JSON.stringify(userData))
      showSuccessToast('Login berhasil, mengalihkan halaman...')
      setTimeout(() => {
        router.push('/')
      }, 1000)
    } else {
      showError('Username atau password salah')
    }
  } catch (error) {
    showError(error.message)
  } finally {
    loading.value = false
  }
}
</script>

<style>
.toast {
  animation:
    fadeIn 0.5s,
    fadeOut 0.5s 2.5s;
}

.toast-content {
  padding: 16px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translate(-50%, -20px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
    transform: translate(-50%, 0);
  }
  to {
    opacity: 0;
    transform: translate(-50%, -20px);
  }
}
</style>
