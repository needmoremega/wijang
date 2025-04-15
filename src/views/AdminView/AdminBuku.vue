<template>
  <div class="p-4 sm:p-6 md:p-8 text-gray-900 dark:text-gray-200">
    <!-- Header -->
    <div class="flex justify-between items-center mb-4 flex-wrap gap-2">
      <h2 class="text-2xl font-bold">Daftar Buku</h2>
      <button @click="openModal" class="btn btn-success btn-sm flex items-center gap-2 h-">
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
            stroke-width="1.5"
            d="M12 4v16m8-8H4"
          />
        </svg>
        Tambah Buku
      </button>
    </div>

    <!-- Tampilan Loading/No Data -->
    <div v-if="isLoading" class="text-center text-lg"><LoadingPage /></div>
    <div v-else-if="NoData" class="text-center text-lg"><BukuGakAda /></div>

    <!-- Tabel Buku (Scrollable) -->
    <div class="w-full overflow-x-auto">
      <table v-if="!isLoading && books.length > 0" class="min-w-[800px] table table-zebra">
        <thead>
          <tr class="bg-gray-800 text-white text-center text-sm">
            <th>Judul</th>
            <th>Penulis</th>
            <th>Tanggal Terbit</th>
            <th>Kategori</th>
            <th>views</th>
            <th>direkomendasikan</th>
            <th>Cover</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody class="text-center bg-gray-900 text-sm">
          <tr v-for="book in paginatedBooks" :key="book.id">
            <td>{{ book.judul }}</td>
            <td>{{ book.author }}</td>
            <td>{{ book.TanggalTerbit }}</td>
            <td>{{ book.kategori }}</td>
            <td>{{ book.view }}</td>
            <td>{{ book.rekomendasi }}</td>
            <td>
              <img
                v-if="book.cover"
                :src="book.cover"
                alt="Cover Buku"
                class="w-16 mx-auto rounded-md shadow-md"
              />
            </td>
            <td class="flex justify-center items-center gap-2">
              <div class="flex gap-2">
                <!-- Tombol Lihat -->
                <button
                  @click="toggleRekomendasi(book.judul, book.kategori)"
                  class="btn btn-sm btn-outline btn-info tooltip"
                  :data-tip="book.rekomendasi ? 'Batalkan Rekomendasi' : 'Jadikan Rekomendasi'"
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
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.95-.69l1.519-4.674z"
                    />
                  </svg>
                </button>

                <!-- Tombol Edit -->
                <button
                  @click="editBuku(book)"
                  class="btn btn-sm btn-outline btn-warning tooltip"
                  data-tip="Edit"
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
                      d="M11 5h2m-1 0v14m4-10h4m-4 4h4m-4 4h4m-4-12h4"
                    />
                  </svg>
                </button>

                <!-- Tombol Hapus -->
                <button
                  @click="deleteBook(book.judul, book.kategori)"
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
      v-if="books.length > 0"
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

    <!-- Modal Tambah/Edit Buku -->
    <div
      v-if="showModal"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50 transition-opacity duration-300 ease-in-out"
    >
      <div
        class="modal-box w-full max-w-3xl p-6 rounded-lg bg-gray-100 dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out scale-100"
      >
        <h3 class="font-bold text-xl mb-4 text-center text-gray-900 dark:text-gray-200">
          {{ editMode ? 'Edit Buku' : 'Tambah Buku' }}
        </h3>
        <form @submit.prevent="editMode ? updateBuku() : saveBook()" class="space-y-4">
          <!-- Judul -->
          <div class="form-control">
            <label class="label text-gray-700 dark:text-gray-300">Judul</label>
            <input
              v-model="newBook.judul"
              type="text"
              placeholder="Masukkan judul buku"
              class="input input-bordered w-full dark:bg-gray-700 dark:text-gray-200"
              required
            />
          </div>

          <!-- Penulis -->
          <div class="form-control">
            <label class="label text-gray-700 dark:text-gray-300">Penulis</label>
            <input
              v-model="newBook.author"
              type="text"
              placeholder="Masukkan nama penulis"
              class="input input-bordered w-full dark:bg-gray-700 dark:text-gray-200"
              required
            />
          </div>

          <!-- Kategori -->
          <div class="form-control">
            <label class="label text-gray-700 dark:text-gray-300">Kategori</label>
            <input
              v-model="newBook.kategori"
              type="text"
              placeholder="Masukkan kategori buku"
              class="input input-bordered w-full dark:bg-gray-700 dark:text-gray-200"
              required
            />
          </div>

          <!-- Stock -->
          <div class="form-control">
            <label class="label text-gray-700 dark:text-gray-300">Stock</label>
            <input
              v-model.number="newBook.stock"
              type="number"
              placeholder="Masukkan jumlah stock"
              class="input input-bordered w-full dark:bg-gray-700 dark:text-gray-200"
              required
            />
          </div>

          <!-- Tanggal Terbit -->
          <div class="form-control">
            <label class="label text-gray-700 dark:text-gray-300">Tanggal Terbit</label>
            <input
              v-model="newBook.TanggalTerbit"
              type="date"
              class="input input-bordered w-full dark:bg-gray-700 dark:text-gray-200"
              required
            />
          </div>

          <!-- Cover -->
          <div class="form-control">
            <label class="label text-gray-700 dark:text-gray-300">Cover</label>
            <input
              type="file"
              @change="captureCoverEvent"
              class="file-input file-input-bordered w-full dark:bg-gray-700 dark:text-gray-200"
            />
          </div>

          <!-- PDF -->
          <div class="form-control">
            <label class="label text-gray-700 dark:text-gray-300">PDF</label>
            <input
              type="file"
              @change="capturePdfEvent"
              accept="application/pdf"
              class="file-input file-input-bordered w-full dark:bg-gray-700 dark:text-gray-200"
            />
          </div>

          <!-- Tombol Aksi -->
          <div class="modal-action flex justify-between mt-4">
            <button
              type="button"
              class="btn btn-outline hover:bg-gray-200 dark:hover:bg-gray-700"
              @click="closeModal"
            >
              Batal
            </button>
            <button type="submit" class="btn btn-primary hover:bg-blue-600 dark:hover:bg-blue-700">
              {{ editMode ? 'Update' : 'Simpan' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Konfirmasi -->
    <!-- Modal Konfirmasi -->
    <div
      v-if="showConfirmModal"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50 transition-opacity duration-300 ease-in-out"
    >
      <div
        class="modal-box w-full max-w-md p-6 rounded-lg bg-gray-100 dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out scale-100"
      >
        <p class="text-lg text-center text-gray-900 dark:text-gray-200">{{ confirmMessage }}</p>
        <div class="modal-action flex justify-between mt-4">
          <button
            class="btn btn-outline hover:bg-gray-200 dark:hover:bg-gray-700"
            @click="closeConfirmModal"
          >
            Batal
          </button>
          <button
            class="btn btn-error hover:bg-red-600 dark:hover:bg-red-700"
            @click="executeConfirmAction"
          >
            Ya
          </button>
        </div>
      </div>
    </div>

    <!-- Notifikasi Toast -->
    <div v-if="showNotif" class="toast toast-top toast-end z-50">
      <div class="alert" :class="notifikasi.tipe">
        <span>{{ notifikasi.pesan }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import BukuGakAda from '@/components/universal/BukuGakAda.vue'
import LoadingPage from '@/components/universal/LoadingPage.vue'

/* ---------------------------
   Variabel dan State
---------------------------- */
const books = ref([])
const isLoading = ref(true)
const NoData = ref(false)
const editMode = ref(false)
const currentPage = ref(1)
const itemsPerPage = 5
const paginatedBooks = ref([])
const showModal = ref(false)
const showConfirmModal = ref(false)
const confirmMessage = ref('')
let confirmAction = null
let pdfEventData = null // untuk menyimpan event file PDF
let coverEventData = null // untuk menyimpan event file cover
const newBook = ref({
  judul: '',
  author: '',
  TanggalTerbit: '',
  kategori: '',
  stock: 0,
  cover: '',
  pdf: '',
  view: 0,
  rekomendasi: false,
  ketersediaan: true,
})

const errorFields = ref({
  judul: false,
  author: false,
  kategori: false,
  stock: false,
  cover: false,
  pdf: false,
})

/* ---------------------------
   Helper Functions
---------------------------- */
const paginateBooks = () => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = currentPage.value * itemsPerPage
  paginatedBooks.value = books.value.slice(start, end)
}
const totalPages = computed(() => Math.ceil(books.value.length / itemsPerPage))
const changePage = (direction) => {
  if (direction === 'next' && currentPage.value < totalPages.value) {
    currentPage.value++
  } else if (direction === 'prev' && currentPage.value > 1) {
    currentPage.value--
  }
  paginateBooks()
}

/* ---------------------------
   Notifikasi
---------------------------- */
const showNotif = ref(false)
const notifikasi = ref({ pesan: '', tipe: '' })
const showNotifikasi = (pesan, tipe) => {
  notifikasi.value = { pesan, tipe }
  showNotif.value = true
  setTimeout(() => {
    showNotif.value = false
  }, 3000)
}

/* ---------------------------
   Modal Konfirmasi
---------------------------- */
const openConfirmModal = (message, action) => {
  confirmMessage.value = message
  confirmAction = action
  showConfirmModal.value = true
}
const closeConfirmModal = () => {
  showConfirmModal.value = false
  confirmMessage.value = ''
  confirmAction = null
}
const executeConfirmAction = () => {
  if (typeof confirmAction === 'function') {
    confirmAction()
  }
  closeConfirmModal()
}

/* ---------------------------
   CRUD API Calls ke Express
---------------------------- */
const toggleRekomendasi = async (judul, kategori) => {
  try {
    const url = `http://localhost:3001/buku/${kategori}/${encodeURIComponent(judul)}`
    const res = await axios.put(url, { rekomendasi: !books.value.rekomendasi }) // Toggle nilai rekomendasi
    showNotifikasi(res.data.message, 'alert-success')
    fetchBooks() // Perbarui daftar buku setelah nilai rekomendasi diubah
  } catch (error) {
    console.error('Error toggling rekomendasi:', error)
    showNotifikasi('Gagal mengubah status rekomendasi', 'alert-error')
  }
}
const fetchBooks = async () => {
  try {
    isLoading.value = true
    const res = await axios.get('http://localhost:3001/books')
    books.value = res.data
    NoData.value = books.value.length === 0
    paginateBooks()
  } catch (error) {
    console.error('Error fetching books:', error)
    NoData.value = true
  } finally {
    isLoading.value = false
  }
}

const saveBookAPI = async () => {
  try {
    const res = await axios.post('http://localhost:3001/books', newBook.value)
    showNotifikasi(res.data.message, 'alert-success')
    closeModal()
    fetchBooks()
  } catch (error) {
    console.error('Error adding book:', error)
    showNotifikasi('Gagal menambahkan buku', 'alert-error')
  }
}

const updateBookAPI = async () => {
  try {
    // Asumsi id buku di sini disimpan dalam newBook.judul (judul yang sudah disanitasi)
    const sanitizedTitle = newBook.value.judul.trim().replace(/[.#$/[\]]/g, '')
    const url = `http://localhost:3001/books/${newBook.value.kategori}/${sanitizedTitle}`
    const res = await axios.put(url, newBook.value)
    showNotifikasi(res.data.message, 'alert-success')
    closeModal()
    fetchBooks()
  } catch (error) {
    console.error('Error updating book:', error)
    showNotifikasi('Gagal memperbarui buku', 'alert-error')
  }
}

const deleteBook = (id, kategori) => {
  openConfirmModal('Apakah Anda yakin ingin menghapus buku ini?', async () => {
    try {
      const url = `http://localhost:3001/books/${kategori}/${id}`
      const res = await axios.delete(url)
      showNotifikasi(res.data.message, 'alert-success')
      fetchBooks()
    } catch (error) {
      console.error('Error deleting book:', error)
      showNotifikasi('Gagal menghapus buku', 'alert-error')
    }
  })
}

/* ---------------------------
   Fungsi Modal
---------------------------- */
const openModal = () => {
  resetForm()
  showModal.value = true
}
const closeModal = () => {
  showModal.value = false
  resetForm()
}
const resetForm = () => {
  editMode.value = false
  newBook.value = {
    judul: '',
    author: '',
    TanggalTerbit: '',
    kategori: '',
    stock: 0,
    cover: '',
    pdf: '',
    ketersediaan: true,
  }
  errorFields.value = {
    judul: false,
    author: false,
    kategori: false,
    stock: false,
    cover: false,
    pdf: false,
  }
}

// Fungsi untuk menangkap event file cover
const captureCoverEvent = (event) => {
  coverEventData = event
}
/* ---------------------------
   Fungsi File Upload
---------------------------- */
// Untuk cover (gambar)

// Fungsi upload cover ke backend (endpoint: /uploadCover)
const uploadCover = async (event) => {
  if (!event || !event.target.files[0]) return null
  const file = event.target.files[0]
  const formData = new FormData()
  formData.append('file', file)
  try {
    const res = await axios.post('http://localhost:3001/uploadCover', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data.coverUrl
  } catch (error) {
    console.error('Error uploading cover:', error)
    return null
  }
}

// Untuk PDF, simpan event agar bisa diproses saat saveBook
const capturePdfEvent = (event) => {
  pdfEventData = event
}

/* ---------------------------
   Fungsi Upload PDF & Save Buku
---------------------------- */
// Fungsi untuk mengupload PDF ke backend dan mendapatkan URL folder hasil konversi
const uploadPdf = async (event) => {
  if (!event || !event.target.files[0]) return null
  const file = event.target.files[0]
  const formData = new FormData()
  formData.append('file', file)
  formData.append('customName', newBook.value.judul)
  try {
    const res = await axios.post('http://localhost:3001/convert', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data.folderUrl
  } catch (error) {
    console.error('Error uploading PDF:', error)
    return null
  }
}

// Fungsi saveBook yang menunggu upload PDF selesai sebelum menyimpan buku
const saveBook = async () => {
  // Validasi sederhana
  if (
    !newBook.value.judul.trim() ||
    !newBook.value.author.trim() ||
    !newBook.value.kategori.trim() ||
    newBook.value.stock < 0
  ) {
    showNotifikasi('Harap lengkapi semua field yang diperlukan', 'alert-warning')
    return
  }
  // Konfirmasi simpan buku
  openConfirmModal('Apakah Anda yakin ingin menambahkan buku ini?', async () => {
    // Upload cover jika ada (tunggu proses upload cover)
    let coverUrl = ''
    if (coverEventData) {
      coverUrl = await uploadCover(coverEventData)
      if (!coverUrl) {
        showNotifikasi('Cover gagal diunggah, buku akan disimpan tanpa cover', 'alert-warning')
      }
    }

    // Upload PDF jika ada
    let pdfUrl = null
    if (pdfEventData) {
      console.log('Uploading PDF...')
      pdfUrl = await uploadPdf(pdfEventData)
      if (!pdfUrl) {
        showNotifikasi('PDF gagal diunggah, buku tetap akan disimpan tanpa PDF', 'alert-warning')
      }
    }
    newBook.value.ketersediaan = newBook.value.stock > 0

    newBook.value.cover = coverUrl || ''
    newBook.value.pdf = pdfUrl || ''

    // Simpan buku ke backend
    if (editMode.value) {
      console.log('Updating book...')
      await updateBookAPI()
    } else {
      console.log('Saving book...')
      await saveBookAPI()
    }
  })
}

/* ---------------------------
   Fungsi Edit Buku
---------------------------- */
const BukuAwal = ref(null)
const editBuku = (book) => {
  editMode.value = true
  newBook.value = { ...book }
  BukuAwal.value = { ...book } // Simpan salinan asli
  showModal.value = true
}

/* ---------------------------
   Fungsi Update Buku (dipanggil oleh form submit jika editMode true)
---------------------------- */
const updateBuku = async () => {
  if (
    !newBook.value.judul.trim() ||
    !newBook.value.author.trim() ||
    !newBook.value.kategori.trim() ||
    newBook.value.stock < 0 ||
    !newBook.value.cover
  ) {
    showNotifikasi('Harap lengkapi semua field yang diperlukan', 'alert-warning')
    return
  }

  // Cek apakah ada perubahan
  const isSame =
    newBook.value.judul === BukuAwal.value.judul &&
    newBook.value.author === BukuAwal.value.author &&
    newBook.value.kategori === BukuAwal.value.kategori &&
    newBook.value.stock === BukuAwal.value.stock &&
    newBook.value.cover === BukuAwal.value.cover &&
    newBook.value.pdf === BukuAwal.value.pdf

  if (isSame && !pdfEventData) {
    showNotifikasi('Tidak ada data yang diubah', 'alert-info')
    return
  }

  openConfirmModal('Apakah Anda yakin ingin memperbarui buku ini?', async () => {
    // Jika ada file PDF baru yang diupload, proses upload terlebih dahulu

    let pdfUrl = newBook.value.pdf
    if (pdfEventData) {
      pdfUrl = await uploadPdf(pdfEventData)
      if (!pdfUrl) {
        showNotifikasi('PDF gagal diunggah, buku tetap diperbarui tanpa PDF baru', 'alert-warning')
      }
    }
    newBook.value.ketersediaan = newBook.value.stock > 0
    newBook.value.pdf = pdfUrl || ''
    await updateBookAPI()
  })
}

/* ---------------------------
   Lifecycle Hooks
---------------------------- */
onMounted(() => {
  fetchBooks()
})
</script>

<style scoped>
/* Tambahkan style sesuai kebutuhan */
</style>
