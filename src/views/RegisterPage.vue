<template>
  <div class="flex justify-center items-center h-screen max-w-full min-w-32">
    <div class="card bg-blue-500 w-1/3 p-5">
      <h3 class="text-center text-2xl font-bold text-white my-4">Register</h3>
      <form @submit.prevent="register">
        <!-- Username -->
        <div class="form-control my-2">
          <label class="input input-bordered flex items-center gap-2">
            <input v-model="newUser.username" type="text" class="grow" placeholder="Username" />
          </label>
        </div>

        <!-- Password -->
        <div class="form-control my-1">
          <label class="input input-bordered flex items-center gap-2">
            <input v-model="newUser.password" type="password" class="grow" placeholder="Password" />
          </label>
        </div>

        <!-- Confirm Password -->
        <div class="form-control my-1">
          <label class="input input-bordered flex items-center gap-2">
            <input
              v-model="newUser.confirmPassword"
              type="password"
              class="grow"
              placeholder="Confirm Password"
            />
          </label>
        </div>

        <!-- Register Button -->
        <div class="form-control my-2 flex items-center">
          <button class="btn btn-primary w-full">Register</button>
        </div>
      </form>

      <!-- Error Message Toast -->
      <div v-if="showToast" class="toast">
        <div class="alert alert-info">
          <span>{{ errorMessage }}</span>
        </div>
      </div>
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
const router = useRouter()

// Fungsi untuk menampilkan toast error
const showError = (message) => {
  errorMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

// Fungsi untuk mendaftar pengguna
const register = async () => {
  // Validasi password dan confirm password
  if (newUser.value.password !== newUser.value.confirmPassword) {
    showError('Password dan konfirmasi password tidak cocok')
    return
  }

  try {
    // Cek apakah username sudah ada
    const usersSnapshot = await get(dbRef(database, 'user'))
    const users = usersSnapshot.exists() ? usersSnapshot.val() : {}

    const usernameExists = Object.values(users).some(
      (user) => user.username === newUser.value.username,
    )

    if (usernameExists) {
      showError('Username sudah terdaftar')
      return
    }

    // Simpan pengguna baru ke RTDB
    const newUserData = {
      username: newUser.value.username,
      password: newUser.value.password,
    }

    const userId = newUser.value.username // Gunakan username sebagai ID
    await set(dbRef(database, 'users/' + userId), newUserData)

    // Arahkan pengguna ke halaman login setelah sukses
    router.push('/login')
    showError('Registrasi berhasil! Silakan login')
  } catch (error) {
    showError('Terjadi kesalahan: ' + error.message)
  }
}
</script>
<style>
.toast {
  position: fixed;
  bottom: 20px;
  right: 20px;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  opacity: 1;
  transition: opacity 0.5s ease-in-out;
}

.toast[hidden] {
  opacity: 0;
}
</style>
