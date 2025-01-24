<template>
  <NavbarUser />
  <div>
    <h1>Welcome to the Home Page</h1>
    <p>Ini di Homepage view.</p>
    <button @click="logout" class="btn btn-active btn-secondary">logout</button>
  </div>
</template>
<script setup>
import NavbarUser from '@/components/user/NavbarUser.vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const logout = () => {
  localStorage.clear()
  router.push('/logreg')
}
// Ambil data 'user' dari localStorage
const user = JSON.parse(localStorage.getItem('user'))

// Periksa apakah user ada dan ambil nilai 'role'
const role = user ? user.role : null

console.log(role) // Menampilkan nilai role di konsol
</script>
