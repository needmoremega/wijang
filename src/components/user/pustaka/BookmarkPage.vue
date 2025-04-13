<template>
  <div class="container mx-auto mt-8 px-4">
    <!-- <h1 class="text-3xl font-bold text-center mb-8">📚 Daftar Bookmark</h1> -->

    <div v-if="bookmarkList.length === 0" class="text-center text-gray-500">
      <p>🔖 Tidak ada bookmark yang ditemukan.</p>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div
        v-for="(bookmark, index) in bookmarkList"
        :key="index"
        @click="keBukuYangDiBookmark([bookmark.kategori], [bookmark.judul])"
        class="cursor-pointer transition-transform transform"
        :class="{ 'pointer-events-none opacity-50': isNavigating }"
      >
        <div class="bg-gray shadow-lg rounded-2xl overflow-hidden hover:shadow-xl">
          <img :src="bookmark.cover" alt="cover buku" class="w-full h-72 object-cover" />
          <div class="p-4">
            <h2 class="text-lg font-semibold mb-1 truncate">{{ bookmark.judul }}</h2>
            <p class="text-sm text-gray-600">Kategori: {{ bookmark.kategori }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { database } from '@/firebase'
import router from '@/router'
import { ref as dbRef, get } from 'firebase/database'
import { ref, onMounted } from 'vue'

const user = JSON.parse(localStorage.getItem('user'))
const usernameUser = user?.username

const bookmarkList = ref([])
const isNavigating = ref(false) // 🆕 Tambahan: flag untuk klik ganda

onMounted(async () => {
  const bookmarkRef = dbRef(database, `user/${usernameUser}/bookmark`)
  const snapshot = await get(bookmarkRef)
  if (snapshot.exists()) {
    const bookmarks = snapshot.val()
    bookmarkList.value = Object.values(bookmarks)
    console.log('Bookmarks:', bookmarkList.value)
  } else {
    console.log('No bookmarks found.')
  }
})

const keBukuYangDiBookmark = (kategori, judul) => {
  if (isNavigating.value) return // 🔒 Jangan lanjut kalau sedang loading
  isNavigating.value = true

  // Pastikan path valid
  router
    .push(`/buku/${kategori}/${judul}`)
    .catch((err) => {
      console.error('Navigation error:', err)
    })
    .finally(() => {
      // Buka kembali navigasi setelah beberapa detik (atau selesai route)
      isNavigating.value = false
    })
}
</script>
