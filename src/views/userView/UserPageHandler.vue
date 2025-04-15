<template>
  <div class="flex flex-col min-h-screen w-full">
    <NavbarUser :profile="profile" :userRole="userRole" class="z-20" />
    <main class="flex-grow w-full px-4 sm:px-6 md:px-8">
      <RouterView :userId="userId" v-if="!loading" />
      <div v-else class="flex justify-center items-center h-screen">
        <span class="loading loading-infinity w-16 h-16 text-primary"></span>
      </div>
    </main>
    <FotterUser class="mt-auto w-full p-2 sm:p-4" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { database } from '@/firebase'
import { ref as dbRef, get } from 'firebase/database'
import FotterUser from '@/components/user/FotterUser.vue'
import NavbarUser from '@/components/user/NavbarUser.vue'

// State for user role, loading state, profile, and userId
const userRole = ref(null)
const loading = ref(true)
const profile = ref(null)

// Get user data from localStorage with null check and fallback value
const userData = JSON.parse(localStorage.getItem('user')) || {}
const userId = userData.username || null

// Fetch profile and role on component mount
onMounted(async () => {
  if (userId) {
    try {
      // Fetch user profile data
      const profileRef = dbRef(database, `user/${userId}/profile`)
      const snapshotprofile = await get(profileRef)
      if (snapshotprofile.exists()) {
        profile.value = snapshotprofile.val()
      } else {
        console.log('No profile data available')
      }

      // Fetch user role data
      const roleRef = dbRef(database, `user/${userId}/role`)
      const snapshot = await get(roleRef)
      if (snapshot.exists()) {
        userRole.value = snapshot.val()
      }
    } catch (error) {
      console.error('Error fetching profile or role:', error)
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
