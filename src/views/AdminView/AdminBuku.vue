<template>
  <div class="p-4 sm:p-6 md:p-8">
    <!-- Header -->
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-bold">Daftar Buku</h2>
      <button @click="showModal = true" class="btn btn-success">Tambah Buku</button>
    </div>

    <!-- Tampilan Loading/No Data -->
    <div v-if="isLoading" class="text-center">Loading...</div>
    <div v-if="NoData" class="text-center">Tidak ada buku.</div>

    <!-- Tabel Buku -->
    <table v-if="paginatedBooks.length > 0" class="table w-full table-auto table-zebra">
      <thead>
        <tr class="bg-base-300 text-white text-center border border-gray-600">
          <th class="border-x border-gray-600">Judul</th>
          <th class="border-x border-gray-600">Penulis</th>
          <th class="border-x border-gray-600">Tahun Rilis</th>
          <th class="border-x border-gray-600">Kategori</th>
          <th class="border-x border-gray-600">Stock</th>
          <!-- <th class="border-x border-gray-600">Sedia</th> -->
          <th class="border-x border-gray-600">Gambar</th>
          <th class="border-x border-gray-600">Aksi</th>
        </tr>
      </thead>
      <tbody class="text-center bg-base-200 border border-gray-600">
        <tr v-for="book in paginatedBooks" :key="book.id">
          <td class="border-b border-gray-600">
            <p class="text-balance">{{ book.judul }}</p>
          </td>
          <td class="border border-gray-600">{{ book.author }}</td>
          <td class="border border-gray-600">{{ book.waktuRilis }}</td>
          <td class="border border-gray-600">{{ book.kategori }}</td>
          <td class="border border-gray-600">{{ book.stock }}</td>
          <!-- <td class="border border-gray-600">
            {{ book.ketersediaan ? 'Tersedia' : 'Tidak Tersedia' }}
          </td> -->
          <td class="border border-gray-600">
            <img
              v-if="book.cover"
              :src="book.cover"
              alt="Gambar Buku"
              class="w-16 aspect- mx-auto"
            />
          </td>
          <td class="border-y border-gray-600">
            <button @click="editBuku(book)" class="btn btn-primary btn-sm mx-1">Edit</button>
            <button @click="deleteBook(book.id, book.kategori)" class="btn btn-danger btn-sm">
              Hapus
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Bab bab an jir -->
    <div v-if="books.length > 0" class="flex justify-center mt-4">
      <button
        @click="changePage('prev')"
        :disabled="currentPage === 1"
        class="btn btn-sm btn-outline"
      >
        Previous
      </button>
      <span class="mx-2">Page {{ currentPage }} of {{ totalPages }}</span>
      <button
        @click="changePage('next')"
        :disabled="currentPage === totalPages"
        class="btn btn-sm btn-outline"
      >
        Next
      </button>
    </div>

    <!-- Komponen untuk memberi tahu -->
    <div v-if="showNotif" class="toast z-10 toast-top toast-end">
      <div role="alert" class="alert" :class="notifikasi.tipe">
        <span>{{ notifikasi.pesan }}.</span>
      </div>
    </div>
    <!-- Modal Tambah/Edit Buku -->
    <div v-if="showModal" class="modal modal-open -z-0">
      <div class="modal-box max-w-5xl">
        <h3 class="font-bold text-lg mb-4">{{ editKah ? 'Edit Buku' : 'Tambah Buku' }}</h3>
        <form @submit.prevent="editKah ? updateBuku() : saveBook()">
          <!-- Judul -->
          <div class="form-control mb-4">
            <label class="label">
              <span class="label-text">Judul</span>
            </label>
            <input
              v-model="newBook.judul"
              type="text"
              placeholder="Judul Buku"
              class="input input-bordered"
              :class="{ 'border-red-500': errorFields.judul }"
            />
          </div>
          <!-- Penulis -->
          <div class="form-control mb-4">
            <label class="label">
              <span class="label-text">Penulis</span>
            </label>
            <input
              v-model="newBook.author"
              type="text"
              placeholder="Nama Penulis"
              class="input input-bordered"
              :class="{ 'border-red-500': errorFields.author }"
            />
          </div>
          <!-- Kategori -->
          <div class="form-control mb-4">
            <label class="label">
              <span class="label-text">Kategori</span>
            </label>
            <input
              v-model="newBook.kategori"
              type="text"
              placeholder="Kategori Buku"
              class="input input-bordered"
              :class="{ 'border-red-500': errorFields.kategori }"
            />
          </div>
          <!-- Stock -->
          <div class="form-control mb-4">
            <label class="label">
              <span class="label-text">Stock</span>
            </label>
            <input
              v-model="newBook.stock"
              type="number"
              placeholder="Jumlah Stock"
              class="input input-bordered"
              :class="{ 'border-red-500': errorFields.stock }"
            />
          </div>
          <!-- Input Gambar -->
          <div class="form-control mb-4">
            <label class="label">
              <span class="label-text">Gambar</span>
            </label>
            <input
              type="file"
              @change="onFileChange"
              accept="image/*"
              class="file-input border-gray-700"
              :class="{ 'border-red-500': errorFields.cover }"
            />
          </div>
          <!-- Preview Gambar -->
          <div v-if="newBook.cover" class="mb-4">
            <img :src="newBook.cover" alt="Preview Gambar" class="w-32 h-auto" />
          </div>
          <!-- Tampilkan waktu rilis yang sudah diformat (read-only)
          <div class="form-control mb-4">
            <label class="label">
              <span class="label-text">Waktu Rilis</span>
            </label>
            <input type="text" :value="newBook.waktuRilis" class="input input-bordered" readonly />
          </div> -->
          <div class="modal-action">
            <button type="button" class="btn" @click="closeModal">Batal</button>
            <button type="submit" class="btn btn-primary">Simpan</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Komponen Konfirmasi Popup -->
    <KonfirmasiPopup
      :isVisible="showConfirmModal"
      :message="confirmMessage"
      @confirm="executeConfirmAction"
      @cancel="closeConfirmModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { database } from '@/firebase'
import { ref as dbRef, onValue, remove, set, update } from 'firebase/database'
const books = ref([])
const dbRefBooks = dbRef(database, 'kategori')

const isLoading = ref(true)
const NoData = ref(false)
const editKah = ref(false)

const idBukuEdit = ref(null)
//bab bab an biar keren
const paginatedBooks = ref([]) // Untuk menyimpan buku yang dipaginasi
const currentPage = ref(1) // Halaman saat ini
const itemsPerPage = 5 // Jumlah item per halaman

const paginateBooks = () => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = currentPage.value * itemsPerPage
  paginatedBooks.value = books.value.slice(start, end)
}
const totalPages = computed(() => {
  return Math.ceil(books.value.length / itemsPerPage)
})
const changePage = (direction) => {
  if (direction === 'next' && currentPage.value < totalPages.value) {
    currentPage.value++
  } else if (direction === 'prev' && currentPage.value > 1) {
    currentPage.value--
  }
  paginateBooks()
}

onMounted(() => {
  onValue(dbRefBooks, (snapshot) => {
    const data = snapshot.val()
    if (data) {
      let kumpulanBuku = []
      Object.keys(data).forEach((kategori) => {
        const buku = data[kategori]
        Object.keys(buku).forEach((idbuku) => {
          const book = buku[idbuku]
          kumpulanBuku.push({
            id: idbuku,
            judul: book.judul || 'tidak ada judul',
            author: book.author || 'tidak ada penulis',
            waktuRilis: book.waktuRilis || 'tidak ada tahun rilis',
            kategori: kategori,
            stock: book.stock || 0,
            ketersediaan: book.ketersediaan || false,
            cover: book.cover || '',
          })
        })
      })
      books.value = kumpulanBuku
      paginateBooks()
      NoData.value = false
    } else {
      NoData.value = true
    }
    isLoading.value = false
  })
})

const showModal = ref(false)
const newBook = ref({
  judul: '',
  author: '',
  waktuRilis: '',
  kategori: '',
  stock: 0,
  ketersediaan: true,
  cover: '',
})

// Tempat untuk validasi input pengguna
const errorFields = ref({
  judul: false,
  author: false,
  kategori: false,
  stock: false,
  cover: false,
})

// Modal konfirmasi
const showConfirmModal = ref(false)
const confirmMessage = ref('')
const confirmAction = ref(null)

const openConfirmModal = (message, action) => {
  confirmMessage.value = message
  confirmAction.value = action
  showConfirmModal.value = true
}

const closeConfirmModal = () => {
  showConfirmModal.value = false
  confirmMessage.value = ''
  confirmAction.value = null
}

const executeConfirmAction = () => {
  if (typeof confirmAction.value === 'function') {
    confirmAction.value() // Jalankan aksi yang sudah diset
  }
  closeConfirmModal()
}

// Fungsi untuk menutup modal tambah/edit
const closeModal = () => {
  showModal.value = false
  resetForm()
}

// Fungsi untuk mereset form
const resetForm = () => {
  editKah.value = false
  idBukuEdit.value = null
  newBook.value = {
    judul: '',
    author: '',
    waktuRilis: '',
    kategori: '',
    stock: 0,
    ketersediaan: true,
    cover: '',
  }
  errorFields.value = {
    judul: false,
    author: false,
    kategori: false,
    stock: false,
    cover: false,
  }
}

// Fungsi validasi data input
const validateBook = () => {
  let hasError = false
  errorFields.value = {
    judul: false,
    author: false,
    kategori: false,
    stock: false,
    cover: false,
  }
  if (!newBook.value.judul.trim()) {
    errorFields.value.judul = true
    hasError = true
  }
  if (!newBook.value.author.trim()) {
    errorFields.value.author = true
    hasError = true
  }
  if (!newBook.value.kategori.trim()) {
    errorFields.value.kategori = true
    hasError = true
  }
  if (isNaN(newBook.value.stock) || newBook.value.stock < 0) {
    errorFields.value.stock = true
    hasError = true
  }
  if (!newBook.value.cover) {
    errorFields.value.cover = true
    hasError = true
  }
  return hasError
}

//ini fungsi untuk mengubah file gambar menjadi base64
const onFileChange = (event) => {
  const file = event.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => {
    newBook.value.cover = reader.result
  }
  reader.onerror = (error) => {
    console.error('Error reading file:', error)
  }
}

// Fungsi untuk menyimpan buku baru
const saveBook = () => {
  const hasError = validateBook()
  if (hasError) {
    showNotifikasi('Harap lengkapi semua field yang diperlukan', 'alert-warning')
    return
  }
  const kategoribuku = newBook.value.kategori
  const sanitizedTitle = newBook.value.judul.trim().replace(/[.#$/[\]]/g, '')
  if (!sanitizedTitle) {
    alert('Judul buku tidak boleh kosong atau tidak valid.')
    return
  }
  openConfirmModal('Apakah Anda yakin ingin menambahkan buku ini?', () => {
    newBook.value.ketersediaan = newBook.value.stock > 0
    const newBookRef = dbRef(database, `kategori/${kategoribuku}/${sanitizedTitle}`)
    set(newBookRef, newBook.value)
      .then(() => {
        closeModal()
        showNotifikasi('Buku berhasil ditambahkan', 'alert-success')
      })
      .catch((error) => {
        alert(`Gagal menambahkan buku: ${error.message}`)
        showNotifikasi('Gagal menambahkan buku', 'alert-error')
        console.error(error)
      })
  })
}

// Fungsi untuk mengedit buku (siapkan data untuk diubah)
const editBuku = (book) => {
  editKah.value = true
  idBukuEdit.value = book.id
  newBook.value = { ...book }
  showModal.value = true
}

// Fungsi untuk memperbarui buku
const updateBuku = () => {
  const hasError = validateBook()
  if (hasError) {
    showNotifikasi('Harap lengkapi semua field yang diperlukan', ' alert-warning')
    return
  }
  if (!idBukuEdit.value) {
    alert('ID buku tidak ditemukan')
    return
  }
  openConfirmModal('Apakah Anda yakin ingin memperbarui buku ini?', () => {
    newBook.value.ketersediaan = newBook.value.stock > 0
    const kategori = newBook.value.kategori
    const bookref = dbRef(database, `kategori/${kategori}/${idBukuEdit.value}`)
    update(bookref, newBook.value)
      .then(() => {
        closeModal()
        console.log('Buku berhasil diperbarui')
        showNotifikasi('buku Berhasil Diperbarui', 'alert-success')
      })
      .catch((error) => {
        alert(`Gagal memperbarui buku: ${error.message}`)
        console.error(error)
      })
  })
}

// Fungsi untuk menghapus buku
const cekPageKetikaBukuDiHapus = () => {
  const bukuYangTersisaDidalamPage = paginatedBooks.value
  if (bukuYangTersisaDidalamPage.length === 0 && currentPage.value > 1) {
    currentPage.value--
    paginateBooks()
  }
}
const deleteBook = (bookId, kategori) => {
  openConfirmModal('Apakah Anda yakin ingin menghapus buku ini?', () => {
    removeBook(bookId, kategori)
  })
}
const removeBook = (bookId, kategori) => {
  const bookRef = dbRef(database, `kategori/${kategori}/${bookId}`)
  remove(bookRef)
    .then(() => {
      showNotifikasi('Buku berhasil dihapus', 'alert-success')
      books.value = books.value.filter((book) => book.id !== bookId)
      paginateBooks()
      cekPageKetikaBukuDiHapus()
    })
    .catch((error) => {
      console.error('Gagal menghapus buku:', error)
    })
}

// Notifikasi handler ni Bossss
const showNotif = ref(false)
const notifikasi = ref({
  pesan: '',
  tipe: '',
})
const showNotifikasi = (pesan, tipe) => {
  notifikasi.value = {
    pesan: pesan,
    tipe: tipe,
  }
  showNotif.value = true
  setTimeout(() => {
    notifikasi.value = ''
    showNotif.value = false
  }, 3000)
}
</script>
