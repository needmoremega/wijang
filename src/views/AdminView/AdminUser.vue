<template>
  <div class="p-4 sm:p-6 md:p-8 text-gray-900 dark:text-gray-200">
    <!-- Header -->
    <div class="flex justify-between items-center mb-4 flex-wrap gap-2">
      <h2 class="text-2xl font-bold">Daftar Pinjaman Buku</h2>
      <!-- Filter dan Pencarian -->
      <div class="flex flex-col sm:flex-row gap-2 mt-2 sm:mt-0 w-full sm:items-center">
        <!-- Search Judul Buku -->
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari berdasarkan judul buku..."
          class="input input-bordered w-full sm:w-1/2"
        />

        <!-- Filter Status Pinjaman -->
        <select v-model="statusFilter" class="select select-bordered w-full sm:w-1/3">
          <option value="">Semua Status</option>
          <option value="true">Dipinjam</option>
          <option value="false">Kembali</option>
        </select>
      </div>
    </div>

    <!-- Tampilan Loading/No Data -->
    <div v-if="isLoading" class="text-center text-lg"><LoadingPage /></div>
    <div v-else-if="filteredPinjamans.length === 0" class="text-center text-lg"><BukuGakAda /></div>

    <!-- Tabel Pinjaman (Scrollable) -->
    <div class="w-full overflow-x-auto">
      <table
        v-if="!isLoading && filteredPinjamans.length > 0"
        class="min-w-[800px] table table-zebra"
      >
        <thead>
          <tr class="bg-gray-800 text-white text-center text-sm">
            <th>Judul</th>
            <th>Penulis</th>
            <th>User</th>
            <th>Waktu Pinjam</th>
            <th>Waktu Kembali</th>
            <th>Status Pinjaman</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody class="text-center bg-gray-900 text-sm">
          <tr v-for="item in paginatedPinjamans" :key="item.id">
            <td>{{ item.isiBuku.judul }}</td>
            <td>{{ item.isiBuku.author }}</td>
            <td>{{ item.username }}</td>
            <td>{{ item.WaktuPinjam }}</td>
            <td>{{ item.WaktuKembali }}</td>
            <td>
              <span :class="item.DiPinjam ? 'text-green-500' : 'text-red-500'">
                {{ item.DiPinjam ? 'Dipinjam' : 'Kembali' }}
              </span>
            </td>
            <td class="flex justify-center items-center gap-2">
              <div class="flex gap-2">
                <!-- Tombol Hapus -->
                <button
                  @click="deletePinjaman(item.id)"
                  class="btn btn-sm btn-outline btn-error tooltip"
                  data-tip="Hapus"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div
      v-if="filteredPinjamans.length > 0"
      class="flex flex-wrap justify-center items-center mt-4 space-y-2 sm:space-y-0 sm:space-x-4"
    >
      <button @click="changePage('prev')" :disabled="currentPage === 1" class="btn btn-outline">
        Previous
      </button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button
        @click="changePage('next')"
        :disabled="currentPage === totalPages"
        class="btn btn-outline"
      >
        Next
      </button>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { ref as dbRef, onValue, remove } from 'firebase/database'
import { database } from '@/firebase'

const pinjamans = ref([])
const isLoading = ref(true)
const currentPage = ref(1)
const itemsPerPage = 10
const searchQuery = ref('') // Untuk pencarian judul buku
const statusFilter = ref('') // Untuk filter status pinjaman

// Mengambil data pinjaman dari Firebase
onMounted(() => {
  const pinjamanRef = dbRef(database, 'pinjaman')

  onValue(pinjamanRef, (snapshot) => {
    const data = snapshot.val()
    const result = []

    if (data) {
      Object.entries(data).forEach(([id, item]) => {
        result.push({ id, ...item, DiPinjam: item.DiPinjam })
      })
    }

    pinjamans.value = result
    isLoading.value = false
  })
})

// Filter Pinjamans berdasarkan search query dan status
const filteredPinjamans = computed(() => {
  const query = searchQuery.value.toLowerCase()
  const status = statusFilter.value

  return pinjamans.value.filter((item) => {
    const matchesQuery = item.isiBuku.judul.toLowerCase().includes(query)
    const matchesStatus = status === '' || item.DiPinjam.toString() === status
    return matchesQuery && matchesStatus
  })
})

// Pagination
const totalPages = computed(() => Math.ceil(filteredPinjamans.value.length / itemsPerPage))
const paginatedPinjamans = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredPinjamans.value.slice(start, start + itemsPerPage)
})

function changePage(dir) {
  if (dir === 'prev' && currentPage.value > 1) currentPage.value--
  else if (dir === 'next' && currentPage.value < totalPages.value) currentPage.value++
}

// Fungsi untuk menghapus pinjaman
function deletePinjaman(id) {
  const pinjamanRef = dbRef(database, 'pinjaman/' + id)
  remove(pinjamanRef)
    .then(() => {
      const index = pinjamans.value.findIndex((item) => item.id === id)
      if (index !== -1) {
        pinjamans.value.splice(index, 1) // Menghapus dari array lokal
      }
      alert('Pinjaman berhasil dihapus!')
    })
    .catch((error) => {
      console.error('Error deleting pinjaman: ', error)
      alert('Gagal menghapus pinjaman.')
    })
}
</script>
