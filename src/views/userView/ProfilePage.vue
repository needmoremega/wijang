<template>
  <div class="container mx-auto px-4 py-8 max-w-md">
    <div class="bg-white rounded-2xl shadow-lg p-6 text-center">
      <img
        :src="user.profile || defaultAvatar"
        alt="Profile"
        class="w-32 h-32 mx-auto rounded-full object-cover border-4 border-indigo-200"
      />
      <h2 class="text-2xl font-bold mt-4">{{ user.username }}</h2>
      <p class="text-gray-500">{{ user.email }}</p>
      <p class="text-sm text-indigo-600 mt-2">Role: {{ user.role || 'User' }}</p>

      <div class="mt-6 space-y-3">
        <button
          class="bg-indigo-500 text-white px-4 py-2 rounded-full hover:bg-indigo-600 transition"
          @click="goToEdit"
        >
          ✏️ Edit Profil
        </button>
        <button
          class="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition"
          @click="logout"
        >
          🚪 Logout
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const router = useRouter()
const defaultAvatar = 'https://i.pravatar.cc/150?img=3'

const user = ref(JSON.parse(localStorage.getItem('user')) || {})

const goToEdit = () => {
  router.push('/edit-profile')
}

const logout = () => {
  localStorage.removeItem('user')
  router.push('/login')
}
</script>
