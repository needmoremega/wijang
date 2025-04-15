<template>
  <form
    @submit.prevent="login"
    class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md mx-auto mt-10"
  >
    <!-- Username -->
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

    <!-- Password -->
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
        <input type="checkbox" v-model="rememberMe" class="mr-2" />
        Remember Me
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

  <!-- Error Toast -->
  <div v-if="showToast" class="toast fixed top-4 left-1/2 z-50" style="transform: translateX(-50%)">
    <div class="alert alert-info toast-content bg-red-500 text-white">
      <span>{{ errorMessage }}</span>
    </div>
  </div>

  <!-- Success Toast -->
  <div
    v-if="showSuccess"
    class="toast fixed top-4 left-1/2 z-50"
    style="transform: translateX(-50%)"
  >
    <div class="alert alert-success toast-content bg-green-500 text-white">
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

// Fungsi hash password dengan Web Crypto API
async function hashPassword(input) {
  const encoder = new TextEncoder()
  const data = encoder.encode(input)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

const showError = (msg) => {
  errorMessage.value = msg
  showToast.value = true
  setTimeout(() => (showToast.value = false), 3000)
}

const showSuccessToast = (msg) => {
  successMessage.value = msg
  showSuccess.value = true
  setTimeout(() => (showSuccess.value = false), 1500)
}

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const login = async () => {
  const { username, password } = isiLogin.value

  if (!username || !password) {
    showError('Username dan password tidak boleh kosong')
    return
  }

  loading.value = true

  try {
    const userRef = dbRef(database, `user/${username}`)
    const snapshot = await get(userRef)

    if (!snapshot.exists()) {
      showError('Username atau password salah')
      return
    }

    const userData = snapshot.val()
    const hashedInput = await hashPassword(password)

    if (hashedInput === userData.password) {
      localStorage.setItem('user', JSON.stringify(userData))
      showSuccessToast('Login berhasil, mengalihkan...')
      setTimeout(() => {
        router.push('/')
      }, 1000)
    } else {
      showError('Username atau password salah')
    }
  } catch (err) {
    showError('Terjadi kesalahan: ' + err.message)
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
