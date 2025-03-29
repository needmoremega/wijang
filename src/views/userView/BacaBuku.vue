<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold text-center mb-4">
      Baca Buku: {{ pinjamanData?.judul || bookId }}
    </h1>
    <h1 class="text-2xl font-bold text-center">Peminjam Buku: {{ pinjamanData?.username }}</h1>
    <div v-if="images.length" class="flex flex-col items-center">
      <img
        v-for="(img, index) in images"
        :key="index"
        :src="img"
        alt="Halaman Buku"
        class="w-full max-w-2xl my-2"
      />
    </div>
    <p v-else class="text-center text-gray-500">Memuat halaman buku...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { storage, database, ref as dbRef, get } from '@/firebase'
import { ref as storageRef, listAll, getDownloadURL } from 'firebase/storage'

// Ambil parameter buku dari URL
const route = useRoute()
const bookId = route.params.id

// Ambil data pinjaman dan array untuk gambar
const pinjamanData = ref(null)
const images = ref([])

// Ambil data user dari localStorage
const user = JSON.parse(localStorage.getItem('user'))
const usernameUser = user?.username

onMounted(async () => {
  // Mengambil data pinjaman dari Realtime Database
  const pinjamanRef = dbRef(database, 'pinjaman')
  try {
    const snapshot = await get(pinjamanRef)
    if (snapshot.exists()) {
      const data = snapshot.val()
      // Filter data pinjaman berdasarkan judul, username, dan status DiPinjam true
      const found = Object.values(data).find(
        (item) => item.judul === bookId && item.username === usernameUser && item.DiPinjam,
      )
      if (found) {
        pinjamanData.value = found
        let folderLink = found.Pdf
        const parts = folderLink.split('/o/')
        if (parts.length > 1) {
          const pathPart = parts[1].split('?')[0] // "pdf-images%2FMIE%20AYAM%2F"
          const folderPath = decodeURIComponent(pathPart) // "pdf-images/MIE AYAM/"
          // Buat reference ke folder di Firebase Storage
          const folderRef = storageRef(storage, folderPath)
          try {
            const result = await listAll(folderRef)
            // Ambil URL masing-masing file gambar di folder tersebut
            const urls = await Promise.all(result.items.map((item) => getDownloadURL(item)))
            images.value = urls
          } catch (error) {
            console.error('Error retrieving images:', error)
          }
        } else {
          console.error('Format URL folder tidak valid.')
        }
      } else {
        console.error('Data pinjaman tidak ditemukan untuk pengguna ini atau buku belum dipinjam.')
      }
    } else {
      console.error('Tidak ada data pinjaman.')
    }
  } catch (error) {
    console.error('Error fetching pinjaman data:', error)
  }
})
</script>

<style scoped>
/* Tambahkan style jika diperlukan */
</style>
