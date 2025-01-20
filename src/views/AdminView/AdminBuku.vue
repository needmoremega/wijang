<template>
  <div class="p-4 sm:p-6 md:p-8">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-bold">Daftar Buku</h2>
      <button @click="showModal = true" class="btn btn-success">Tambah Buku</button>
    </div>

    <!-- Tabel Buku -->
    <table v-if="books.length > 0" class="table w-full table-auto">
      <thead>
        <tr>
          <th>Judul</th>
          <th>Penulis</th>
          <th>Tahun Rilis</th>
          <th>Kategori</th>
          <th>Stock</th>
          <th>Sedia</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="book in books" :key="book.id">
          <td>{{ book.title }}</td>
          <td>{{ book.author }}</td>
          <td>{{ book.releaseYear }}</td>
          <td>{{ book.category }}</td>
          <td>{{ book.stock }}</td>
          <td>{{ book.available ? 'Tersedia' : 'Tidak Tersedia' }}</td>
          <td>
            <button @click="editBuku(book)" class="btn btn-primary btn-sm">Edit</button>
            <button @click="deleteBook(book.id)" class="btn btn-danger btn-sm">Hapus</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal Tambah Buku -->
    <div v-if="showModal" class="modal modal-open">
      <div class="modal-box max-w-5xl">
        <h3 class="font-bold text-lg mb-4">{{ editKah ? 'Edit Buku' : 'Tambah Buku' }}</h3>
        <form @submit.prevent="editKah ? updateBuku() : saveBook()">
          <div class="form-control mb-4">
            <label class="label">
              <span class="label-text">Judul</span>
            </label>
            <input
              v-model="newBook.title"
              type="text"
              placeholder="Judul Buku"
              class="input input-bordered"
              :class="{ 'border-red-500': errorFields.title }"
            />
          </div>
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
          <div class="form-control mb-4">
            <label class="label">
              <span class="label-text">Tahun Rilis</span>
            </label>
            <input
              v-model="newBook.releaseYear"
              type="number"
              placeholder="Tahun Rilis"
              class="input input-bordered"
              :class="{ 'border-red-500': errorFields.releaseYear }"
            />
          </div>
          <div class="form-control mb-4">
            <label class="label">
              <span class="label-text">Kategori</span>
            </label>
            <input
              v-model="newBook.category"
              type="text"
              placeholder="Kategori Buku"
              class="input input-bordered"
              :class="{ 'border-red-500': errorFields.category }"
            />
          </div>
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
          <!-- <div class="form-control mb-4">
            <label class="label cursor-pointer">
              <span class="label-text">Tersedia</span>
              <input v-model="newBook.available" type="checkbox" class="toggle toggle-success" />
            </label>
          </div> -->
          <div class="modal-action">
            <button type="button" class="btn" @click="closeModal">Batal</button>
            <button type="submit" class="btn btn-primary">Simpan</button>
          </div>
        </form>
      </div>
    </div>

    <KonfirmasiPopup
      :isVisible="showConfirmModal"
      :message="confirmMessage"
      @confirm="executeConfirmAction"
      @cancel="closeConfirmModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { database } from '@/firebase'
import { ref as dbRef, onValue, remove, set, update } from 'firebase/database'

const books = ref([])
const dbRefBooks = dbRef(database, 'buku')

const isLoading = ref(true)
const NoData = ref(false)
const editKah = ref(false)
const idBukuEdit = ref(null)

onMounted(() => {
  onValue(dbRefBooks, (snapshot) => {
    const data = snapshot.val()
    if (data) {
      books.value = Object.keys(data).map((key) => {
        const book = data[key]
        return {
          id: key,
          title: book.title || 'Tanpa Judul',
          author: book.author || 'Tidak Diketahui',
          releaseYear: book.releaseYear || 'Tidak Diketahui',
          category: book.category || 'Tidak Dikategorikan',
          stock: book.stock || 0,
          available: book.available || false,
        }
      })
      NoData.value = false
    } else {
      NoData.value = true
    }
    isLoading.value = false
  })
})

const showModal = ref(false)
const newBook = ref({
  title: '',
  author: '',
  releaseYear: '',
  category: '',
  stock: 0,
  available: true,
})

//ini tempat untuk check inputan pengguna
const errorFields = ref({
  title: false,
  author: false,
  releaseYear: false,
  category: false,
  stock: false,
})

// Fungsi ketika modal di tutup
const closeModal = () => {
  showModal.value = false
  resetForm()
}

// Fungsi untuk mereset form
const resetForm = () => {
  editKah.value = false
  idBukuEdit.value = null
  newBook.value = {
    title: '',
    author: '',
    releaseYear: '',
    category: '',
    stock: 0,
    available: true,
  }
  errorFields.value = {
    title: false,
    author: false,
    releaseYear: false,
    category: false,
    stock: false,
  }
}

// Fungsi validasi data
const validateBook = () => {
  let hasError = false
  errorFields.value = {
    title: false,
    author: false,
    releaseYear: false,
    category: false,
    stock: false,
  }

  if (!newBook.value.title.trim()) {
    errorFields.value.title = true
    hasError = true
  }
  if (!newBook.value.author.trim()) {
    errorFields.value.author = true
    hasError = true
  }
  if (!newBook.value.releaseYear || isNaN(newBook.value.releaseYear)) {
    errorFields.value.releaseYear = true
    hasError = true
  }
  if (!newBook.value.category.trim()) {
    errorFields.value.category = true
    hasError = true
  }
  if (isNaN(newBook.value.stock) || newBook.value.stock < 0) {
    errorFields.value.stock = true
    hasError = true
  }
  return hasError
}

// Fungsi untuk menyimpan buku baru
const saveBook = () => {
  const hasError = validateBook()
  if (hasError) {
    alert('Harap lengkapi semua field yang diperlukan.')
    return
  }

  const sanitizedTitle = newBook.value.title.trim().replace(/[.#$/[\]]/g, '')
  if (!sanitizedTitle) {
    alert('Judul buku tidak boleh kosong atau tidak valid.')
    return
  }
  openConfirmModal('Apakah Anda yakin ingin menambahkan buku ini?', () => {
    newBook.value.available = newBook.value.stock > 0
    const newBookRef = dbRef(database, `buku/${sanitizedTitle}`)
    set(newBookRef, newBook.value)
      .then(() => {
        closeModal()
        console.log('Buku berhasil ditambahkan')
      })
      .catch((error) => {
        alert(`Gagal menambahkan buku: ${error.message}`)
        console.error(error)
      })
  })
}

//fungsi sebelum buku di edit/update
const editBuku = (idbuku) => {
  editKah.value = true
  idBukuEdit.value = idbuku.id
  newBook.value = { ...idbuku }
  showModal.value = true
}

// Fungsi untuk memperbarui buku
const updateBuku = () => {
  const hasError = validateBook()
  if (hasError) {
    alert('Harap lengkapi semua field yang diperlukan.')
    return
  }

  // Jika ID buku tidak ditemukan
  if (!idBukuEdit.value) {
    alert('ID buku tidak ditemukan')
    return
  }
  openConfirmModal('Apakah Anda yakin ingin memperbarui buku ini?', () => {
    newBook.value.available = newBook.value.stock > 0

    // Jika ID buku ditemukan
    const bookref = dbRef(database, `buku/${idBukuEdit.value}`)
    update(bookref, newBook.value)
      .then(() => {
        closeModal()
        console.log('Buku berhasil diperbarui')
      })
      .catch((error) => {
        alert(`Gagal memperbarui buku: ${error.message}`)
        console.error(error)
      })
  })
}

// Fungsi untuk menghapus buku
const deleteBook = (bookId) => {
  openConfirmModal('Apakah Anda yakin ingin menghapus buku ini?', () => {
    removeBook(bookId)
  })
  const removeBook = (bookId) => {
    const bookRef = dbRef(database, `buku/${bookId}`)
    remove(bookRef)
      .then(() => {
        console.log('Buku berhasil dihapus')
        books.value = books.value.filter((book) => book.id !== bookId)
      })
      .catch((error) => {
        console.error('Gagal menghapus buku:', error)
      })
  }
}
const showConfirmModal = ref(false) // Untuk menampilkan modal konfirmasi
const confirmMessage = ref('') // Pesan konfirmasi
const confirmAction = ref(null) // Aksi yang akan dijalankan setelah konfirmasi

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
    confirmAction.value() // Jalankan aksi
  }
  closeConfirmModal()
}
</script>
