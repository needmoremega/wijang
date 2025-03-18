<template>
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
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { database, ref as dbRef, get } from '@/firebase'

// variabel untuk fungsi login
console.log(localStorage.getItem('user'))
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

  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

// Load Remember Me
onMounted(() => {
  //buat menjadi ketika sudah login maka akan ke Homepage
  // const checklogin = localStorage.getItem('user')
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
    const userRef = dbRef(database, `user/${isiLogin.value.username}`)
    const userSnapshot = await get(userRef)

    if (!userSnapshot.exists()) {
      showError('Username atau password salah')
      return
    }

    const userData = userSnapshot.val()

    if (userData.password === isiLogin.value.password) {
      localStorage.setItem('user', JSON.stringify(userData))
      
      router.push('/')
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
