<template>
  <div class="p-6 min-h-screen">
    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <h2 class="text-3xl font-bold">Dashboard</h2>
    </div>

    <!-- Welcome Messzage -->
    <p class="text-lg mb-8">Selamat datang di Wijang, Admin!</p>

    <!-- Statistik -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Total Buku -->
      <div class="card bg-base-300 shadow-md rounded-lg p-6 transition-transform hover:scale-105">
        <h3 class="text-lg font-semibold">Total Buku</h3>
        <p class="text-3xl font-bold text-blue-600">{{ totalBooks }}</p>
      </div>

      <!-- Buku Tersedia -->
      <div class="card bg-base-300 shadow-md rounded-lg p-6 transition-transform hover:scale-105">
        <h3 class="text-lg font-semibold">Buku Tersedia</h3>
        <p class="text-3xl font-bold text-green-600">{{ availableBooks }}</p>
      </div>

      <!-- Buku Dipinjam -->
      <div class="card bg-base-300 shadow-md rounded-lg p-6 transition-transform hover:scale-105">
        <h3 class="text-lg font-semibold">Buku Dipinjam</h3>
        <p class="text-3xl font-bold text-red-600">{{ borrowedBooks }}</p>
      </div>

      <!-- Total Pengguna -->
      <div class="card bg-base-300 shadow-md rounded-lg p-6 transition-transform hover:scale-105">
        <h3 class="text-lg font-semibold">Total Pengguna</h3>
        <p class="text-3xl font-bold text-purple-600">{{ totalUsers }}</p>
      </div>
    </div>

    <!-- Kategori Buku -->
    <div class="shadow-md rounded-lg p-6">
      <h3 class="text-xl font-semibold mb-4">Statistik Kategori Buku</h3>
      <ul class="space-y-2">
        <li
          v-for="(count, category) in bookCategories"
          :key="category"
          class="flex justify-between items-center"
        >
          <span class="">{{ category }}</span>
          <span class="badge bg-blue-100 text-blue-600 px-3 py-1 rounded-full">{{ count }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { database } from '@/firebase'
import { ref as dbRef, get } from 'firebase/database'

export default {
  setup() {
    const kategori = ref({})
    const pinjaman = ref([])
    const users = ref([])

    // Statistik
    const totalBooks = ref(0)
    const availableBooks = ref(0)
    const borrowedBooks = ref(0)
    const totalUsers = ref(0)
    const bookCategories = ref({})

    // Mengambil data dari RTDB
    const fetchData = async () => {
      // Ambil data kategori
      const kategoriSnapshot = await get(dbRef(database, 'kategori'))
      if (kategoriSnapshot.exists()) {
        kategori.value = kategoriSnapshot.val()

        // Hitung total buku
        totalBooks.value = Object.values(kategori.value).reduce((total, category) => {
          return total + Object.keys(category).length
        }, 0)

        // Hitung kategori buku
        bookCategories.value = Object.keys(kategori.value).reduce((acc, category) => {
          acc[category] = Object.keys(kategori.value[category]).length
          return acc
        }, {})

        // Hitung buku tersedia dan dipinjam
        availableBooks.value = Object.values(kategori.value).reduce((total, category) => {
          return total + Object.values(category).filter((book) => book.stock > 0).length
        }, 0)

        borrowedBooks.value = totalBooks.value - availableBooks.value
      }

      // Ambil data pinjaman
      const pinjamanSnapshot = await get(dbRef(database, 'pinjaman'))
      if (pinjamanSnapshot.exists()) {
        pinjaman.value = Object.values(pinjamanSnapshot.val())
      }

      // Ambil data pengguna
      const usersSnapshot = await get(dbRef(database, 'user'))
      if (usersSnapshot.exists()) {
        users.value = Object.values(usersSnapshot.val())
        totalUsers.value = users.value.length
      } else {
        // Jika tidak ada tabel users, hitung unik username dari pinjaman
        const uniqueUsers = new Set(pinjaman.value.map((item) => item.username))
        totalUsers.value = uniqueUsers.size
      }
    }

    onMounted(() => {
      fetchData()
    })

    return {
      totalBooks,
      availableBooks,
      borrowedBooks,
      totalUsers,
      bookCategories,
    }
  },
}
</script>
