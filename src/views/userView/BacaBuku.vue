<template>
  <div class="relative min-h-screen bg-black text-white">
    <!-- 🔙 Header -->
    <!-- Header Atas -->
    <div
      class="fixed top-0 left-0 w-full z-50 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between px-4 py-3 backdrop-blur-sm transition-all duration-300"
      :class="{
        'opacity-0 pointer-events-none': fullscreenIndex !== null,
        'opacity-100': fullscreenIndex === null,
      }"
    >
      <button class="btn btn-sm btn-neutral flex items-center gap-2" @click="goBack">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Kembali
      </button>

      <div class="text-sm text-white/70 truncate">{{ pinjamanData?.judul }}</div>
    </div>

    <!-- 📖 Gambar Buku -->
    <div class="pt-20 pb-24 flex flex-col items-center gap-4">
      <img
        v-for="(img, index) in images"
        :key="index"
        :src="img"
        alt="Halaman"
        class="w-full max-w-4xl object-contain rounded shadow-md cursor-pointer transition-all duration-200 hover:scale-[1.01]"
        @click="toggleFullscreen(index)"
        :class="{ 'fullscreen-img': fullscreenIndex === index }"
      />
    </div>

    <!-- 🔽🔼 Tombol Scroll -->
    <div
      class="fixed right-4 bottom-24 z-50 flex flex-col gap-2 items-end transition-opacity duration-3000"
      :class="{
        'opacity-0 pointer-events-none': fullscreenIndex !== null,
        'opacity-100': fullscreenIndex === null,
      }"
    >
      <button class="btn btn-lg flex items-center gap-2" @click="scrollToTop">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
        </svg>
      </button>
      <button class="btn btn-lg btn-secondary flex items-center gap-2" @click="scrollToBottom">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
    </div>

    <!-- 📊 Progress Bar -->
    <div
      class="fixed bottom-0 left-0 w-full z-50 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between px-4 py-3 backdrop-blur-sm transition-all duration-300"
      :class="{
        'opacity-0 pointer-events-none': fullscreenIndex !== null,
        'opacity-100': fullscreenIndex === null,
      }"
    >
      <progress class="progress progress-primary w-full h-1" :value="scrollProgress" max="100" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storage, database, ref as dbRef, get } from '@/firebase'
import { ref as storageRef, listAll, getDownloadURL } from 'firebase/storage'

const route = useRoute()
const router = useRouter()
const bookId = route.params.id
const pinjamanData = ref(null)
const images = ref([])
const fullscreenIndex = ref(null)
const scrollProgress = ref(0)

const user = JSON.parse(localStorage.getItem('user'))
const usernameUser = user?.username

function goBack() {
  router.back()
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
function scrollToBottom() {
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
}

function toggleFullscreen(index) {
  fullscreenIndex.value = fullscreenIndex.value === index ? null : index
}

function updateScrollProgress() {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  scrollProgress.value = (scrollTop / docHeight) * 100
  localStorage.setItem(`progress-${bookId}`, scrollTop)
}

async function loadBookImages() {
  const pinjamanRef = dbRef(database, 'pinjaman')
  try {
    const snapshot = await get(pinjamanRef)
    if (snapshot.exists()) {
      const data = snapshot.val()
      const found = Object.values(data).find(
        (item) => item.judul === bookId && item.username === usernameUser && item.DiPinjam,
      )
      if (found) {
        pinjamanData.value = found
        const parts = found.Pdf.split('/o/')
        if (parts.length > 1) {
          const pathPart = parts[1].split('?')[0]
          const folderPath = decodeURIComponent(pathPart)
          const folderRef = storageRef(storage, folderPath)
          const result = await listAll(folderRef)
          const urls = await Promise.all(result.items.map((item) => getDownloadURL(item)))
          images.value = urls
        }
      }
    }
  } catch (error) {
    console.error('Gagal memuat data:', error)
  }
}

onMounted(async () => {
  await loadBookImages()
  const lastScroll = parseInt(localStorage.getItem(`progress-${bookId}`)) || 0
  setTimeout(() => {
    window.scrollTo({ top: lastScroll, behavior: 'smooth' })
  }, 400)
  window.addEventListener('scroll', updateScrollProgress)
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateScrollProgress)
})
</script>

<style scoped></style>
