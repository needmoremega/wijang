<template>
  <form @submit.prevent="register">
    <!-- Username -->
    <div class="form-control my-2">
      <label class="input input-bordered flex items-center gap-2">
        <input
          v-model="newUser.username"
          type="text"
          class="grow"
          placeholder="Username"
          required
        />
      </label>
    </div>

    <!-- Password -->
    <div class="form-control my-1">
      <label class="input input-bordered flex items-center gap-2">
        <input
          v-model="newUser.password"
          type="password"
          class="grow"
          placeholder="Password"
          required
        />
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
          required
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
const Pesan = (isiPesan) => {
  errorMessage.value = isiPesan
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

// Fungsi untuk mendaftar pengguna
const register = async () => {
  const { username, password, confirmPassword } = newUser.value

  if (password !== confirmPassword) {
    Pesan('Password dan konfirmasi password tidak cocok')
    return
  }

  try {
    const userRef = dbRef(database, `user/${username}`)

    // Cek apakah username sudah ada
    const snapshot = await get(userRef)
    if (snapshot.exists()) {
      Pesan('Username sudah terdaftar')
      return
    }

    // Simpan pengguna baru ke Firebase RTDB
    const newUserData = { username, password, role: 'user' }
    await set(userRef, newUserData)

    // Arahkan pengguna ke halaman login setelah sukses
    Pesan('Registrasi berhasil! Silakan login')
    setTimeout(() => {
      router.push('/')
    }, 1000)
  } catch (error) {
    Pesan('Terjadi kesalahan: ' + error.message)
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
