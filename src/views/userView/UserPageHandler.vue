<template>
  <div class="flex flex-col min-h-screen w-full">
    <NavbarUser :userRole="userRole" class="z-20" />
    <main class="flex-grow w-full px-4 sm:px-6 md:px-8">
      <RouterView v-if="!loading" />
      <div v-else class="flex justify-center items-center h-screen">
        <span class="loading loading-spinner text-primary"></span>
      </div>
    </main>
    <FotterUser class="mt-auto w-full p-2 sm:p-4" />
  </div>
</template>

<script setup>
import FotterUser from '@/components/user/FotterUser.vue'
import NavbarUser from '@/components/user/NavbarUser.vue'
import { ref, onMounted } from 'vue'
import { database } from '@/firebase'
import { ref as dbRef, get } from 'firebase/database'

// State untuk menyimpan role user dan loading state
const userRole = ref(null)
const loading = ref(true)

// Ambil user ID dari localStorage dengan pengecekan null
const userData = JSON.parse(localStorage.getItem('user')) || {}
const userId = userData.username || null

onMounted(async () => {
  if (userId) {
    try {
      const roleRef = dbRef(database, `user/${userId}/role`)
      const snapshot = await get(roleRef)
      if (snapshot.exists()) {
        userRole.value = snapshot.val()
      }
    } catch (error) {
      console.error('Error fetching role:', error)
    }
  }
  loading.value = false
})
</script>

<style scoped>
/* Pastikan responsivitas untuk layar kecil */
@media (max-width: 500px) {
  main {
    padding: 8px;
  }
  .loading {
    width: 40px;
    height: 40px;
  }
}
</style>
