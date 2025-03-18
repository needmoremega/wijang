<template>
  <NavbarUser :userRole="userRole" class="z-20" />
  <RouterView />
  <FotterUser />
</template>

<script setup>
import FotterUser from '@/components/user/FotterUser.vue'
import NavbarUser from '@/components/user/NavbarUser.vue'
import { ref, onMounted } from 'vue'
import { database } from '@/firebase'
import { ref as dbRef, get } from 'firebase/database'

// State untuk menyimpan role user
const userRole = ref(null) // Default ke 'admin'

// Ambil user ID dari localStorage
const userData = JSON.parse(localStorage.getItem('user'))
const userId = userData.username || null // Ambil ID user
console.log(userId)
onMounted(async () => {
  if (userId) {
    const roleRef = dbRef(database, `user/${userId}/role`)
    const snapshot = await get(roleRef)
    if (snapshot.exists()) {
      userRole.value = snapshot.val() // Set role dari database
    }
  }
})
</script>
