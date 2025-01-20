<template>
  <div class="flex justify-center items-center h-screen max-w-full min-w-32">
    <div class="card bg-blue-500 w-1/3 p-5">
      <div class="flex justify-center">
        <img src="" alt="Login Icon" class="w-16 h-16" />
      </div>
      <h3 class="text-center text-2xl font-bold text-white my-4">Login</h3>

      <form @submit.prevent="login">
        <!-- Username Input -->
        <div class="form-control my-2">
          <label class="input input-bordered flex items-center gap-2">
            <input
              v-model="isiLogin.username"
              type="text"
              class="grow"
              placeholder="Username"
              autocomplete="username"
            />
          </label>
        </div>

        <!-- Password Input -->
        <div class="form-control my-1 relative">
          <label class="input input-bordered flex items-center gap-2">
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="isiLogin.password"
              class="grow"
              placeholder="Password"
              autocomplete="current-password"
            />
          </label>
          <button type="button" class="absolute right-3 top-3" @click="togglePassword">👁️</button>
        </div>

        <!-- Remember Me -->
        <div class="flex items-center justify-between my-2">
          <label class="flex items-center">
            <input type="checkbox" v-model="rememberMe" class="mr-2" /> Remember Me
          </label>
        </div>

        <!-- Login Button -->
        <div class="form-control my-2 flex items-center">
          <button :disabled="loading" class="btn btn-primary w-full">
            {{ loading ? 'Loading...' : 'Login' }}
          </button>
        </div>
      </form>

      <!-- Alert -->
      <div v-if="showToast" class="toast">
        <div class="alert alert-info">
          <span>{{ errorMessage }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { database, ref as dbRef, get } from '@/firebase'

// variabel untuk fungsi login
const isiLogin = ref({ username: '', password: '' })
const loading = ref(false)
const showPassword = ref(false)
const rememberMe = ref(false)
const router = useRouter()

// untuk menampilkan eror
const showToast = ref(false)
const errorMessage = ref('')

const showError = (message) => {
  errorMessage.value = message
  showToast.value = true

  // ⏳ Hilangkan toast setelah 3 detik
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}
// Toggle Password Visibility
const togglePassword = () => {
  showPassword.value = !showPassword.value
}

// Load Remember Me
onMounted(() => {
  //buat menjadi ketika sudah login maka akan ke Homepage
  const savedUsername = localStorage.getItem('rememberUsername')
  if (savedUsername) {
    isiLogin.value.username = savedUsername
    rememberMe.value = true
  }
})

// Login Function
const login = async () => {
  errorMessage.value = ''
  loading.value = true

  if (!isiLogin.value.username || !isiLogin.value.password) {
    showError('Username dan password tidak boleh kosong')
    loading.value = false
    return
  }

  try {
    const usersSnapshot = await get(dbRef(database, 'user'))
    if (!usersSnapshot.exists()) throw new Error('Tidak ada data pengguna')

    const users = usersSnapshot.val()
    const foundUser = Object.values(users).find(
      (user) =>
        user.username === isiLogin.value.username && user.password === isiLogin.value.password,
    )

    if (foundUser) {
      localStorage.setItem('user', JSON.stringify(foundUser))
      if (rememberMe.value) {
        localStorage.setItem('rememberUsername', isiLogin.value.username)
        localStorage.setItem('rememberPassword', isiLogin.value.password)
      } else {
        localStorage.removeItem('rememberUsername')
        localStorage.removeItem('rememberPassword')
      }
      router.push('/user')
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
.h-screen {
  background-image: url('/src/assets/jongkler.jpg');
  background-size: cover;
}
</style>
