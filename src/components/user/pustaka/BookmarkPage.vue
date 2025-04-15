<template>
  <div class="container mx-auto mt-8 px-4">
    <!-- No Data -->
    <div v-if="bookmarkList.length === 0" class="text-center text-gray-500">
      <p>🔖 Tidak ada bookmark yang ditemukan.</p>
    </div>

    <!-- Grid of Bookmarks -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div
        v-for="(bookmark, index) in bookmarkList"
        :key="index"
        @click="keBukuYangDiBookmark(bookmark.kategori, bookmark.judul)"
        class="cursor-pointer transition-transform transform hover:scale-105"
        :class="{ 'pointer-events-none opacity-50': isNavigating }"
      >
        <div class="bg-white dark:bg-gray-800 shadow-lg overflow-hidden rounded-lg hover:shadow-xl">
          <!-- Cover Image -->
          <img
            :src="bookmark.cover || '/fallback.jpg'"
            alt="Cover Buku"
            class="w-full h-72 object-cover"
            loading="lazy"
          />
          <!-- Book Details -->
          <div class="p-4">
            <h2 class="text-lg font-semibold mb-1 truncate">{{ bookmark.judul }}</h2>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Kategori: {{ bookmark.kategori }}
            </p>
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
const isNavigating = ref(false) // Flag untuk menghindari klik ganda

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

// Navigasi ke halaman buku
const keBukuYangDiBookmark = (kategori, judul) => {
  if (isNavigating.value) return // Jangan lanjut kalau sedang loading
  isNavigating.value = true

  // Encode judul untuk URL yang aman
  const encodedJudul = encodeURIComponent(judul)

  // Navigasi ke halaman buku
  router
    .push(`/buku/${kategori}/${encodedJudul}`)
    .catch((err) => {
      console.error('Navigation error:', err)
    })
    .finally(() => {
      // Reset flag setelah navigasi selesai
      isNavigating.value = false
    })
}
</script>

<style scoped>
/* Styling untuk efek hover */
.grid > div {
  transition: transform 0.3s ease;
}

.grid > div:hover {
  transform: scale(1.05);
}

/* Responsive Design */
@media (max-width: 640px) {
  .grid {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}

@media (min-width: 640px) and (max-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 768px) and (max-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

/* Fallback Image */
img[lazy='loading'] {
  filter: blur(5px);
}
</style>
