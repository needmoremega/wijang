<template>
  <form
    @submit.prevent="register"
    class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md"
  >
    <!-- Username -->
    <div class="form-control my-2">
      <label
        class="input input-bordered flex items-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded"
      >
        <input
          v-model="newUser.username"
          type="text"
          class="grow bg-transparent focus:outline-none"
          placeholder="Username"
          required
          autocomplete="username"
        />
      </label>
    </div>

    <!-- Password -->
    <div class="form-control my-2">
      <label
        class="input input-bordered flex items-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded"
      >
        <input
          v-model="newUser.password"
          type="password"
          class="grow bg-transparent focus:outline-none"
          placeholder="Password"
          required
          autocomplete="new-password"
        />
      </label>
    </div>

    <!-- Confirm Password -->
    <div class="form-control my-2">
      <label
        class="input input-bordered flex items-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded"
      >
        <input
          v-model="newUser.confirmPassword"
          type="password"
          class="grow bg-transparent focus:outline-none"
          placeholder="Confirm Password"
          required
          autocomplete="new-password"
        />
      </label>
    </div>

    <!-- Register Button -->
    <div class="form-control my-4">
      <button class="btn btn-primary w-full py-2 text-lg" :disabled="loading">
        <span v-if="loading" class="flex items-center justify-center">
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
          Registering...
        </span>
        <span v-else>Register</span>
      </button>
    </div>
  </form>

  <!-- Toast (Top Center) -->
  <div v-if="showToast" class="toast fixed top-4 left-1/2 z-50" style="transform: translateX(-50%)">
    <div class="alert alert-info toast-content bg-blue-500 dark:bg-blue-700 text-white">
      <span>{{ errorMessage }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { database, ref as dbRef, set, get } from '@/firebase'
import { useRouter } from 'vue-router'

const newUser = ref({
  username: '',
  password: '',
  confirmPassword: '',
})
const errorMessage = ref('')
const showToast = ref(false)
const loading = ref(false)
const router = useRouter()

// Fungsi untuk menampilkan toast
const Pesan = (isiPesan) => {
  errorMessage.value = isiPesan
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

const register = async () => {
  const { username, password, confirmPassword } = newUser.value

  if (password !== confirmPassword) {
    Pesan('Password dan konfirmasi password tidak cocok')
    return
  }

  loading.value = true

  try {
    const userRef = dbRef(database, `user/${username}`)

    // Cek apakah username sudah ada
    const snapshot = await get(userRef)
    if (snapshot.exists()) {
      Pesan('Username sudah terdaftar')
      loading.value = false
      return
    }

    // Simpan pengguna baru ke Firebase RTDB
    const newUserData = { username, password, role: 'user' }
    await set(userRef, newUserData)

    // Tampilkan toast sukses dan arahkan pengguna ke halaman login
    Pesan('Registrasi berhasil! Silakan login')
    setTimeout(() => {
      router.push('/')
    }, 1000)
  } catch (error) {
    Pesan('Terjadi kesalahan: ' + error.message)
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
