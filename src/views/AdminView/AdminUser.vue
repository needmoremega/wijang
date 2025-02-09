<template>
  <div class="p-4 sm:p-6 md:p-8">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-bold">Daftar Akun</h2>
      <button @click="showModal = true" class="btn btn-success">Tambah User</button>
    </div>
    <!-- notifikasi -->
    <div v-if="showNotif" class="toast z-10 toast-top toast-center">
      <div role="alert" class="alert" :class="notifikasi.tipe">
        <span>{{ notifikasi.pesan }}.</span>
      </div>
    </div>

    <!-- Tabel user -->
    <table v-if="paginatedBooks.length > 0" class="table w-full table-auto">
      <thead class="bg-primary text-white text-center">
        <tr>
          <th>Nama</th>
          <th>password</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody class="text-center bg-base-200">
        <tr v-for="user in paginatedBooks" :key="user.id">
          <td>{{ user.name }}</td>
          <td>{{ user.password }}</td>
          <td>
            <button @click="editUser(user)" class="btn btn-primary btn-sm">Edit</button>
            <button @click="deleteUser(user.id)" class="btn btn-danger btn-sm">Hapus</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Bab bab an jir -->
    <div v-if="paginatedBooks.length > 0" class="flex justify-center mt-4">
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

    <!-- Modal Tambah/Edit User -->
    <div v-if="showModal" class="modal modal-open z-0">
      <div class="modal-box max-w-5xl">
        <h3 class="font-bold text-lg mb-4">{{ editMode ? 'Edit User' : 'Tambah User' }}</h3>
        <form @submit.prevent="editMode ? updateUser() : saveUser()">
          <div class="form-control mb-4">
            <label class="label">
              <span class="label-text">Nama</span>
            </label>
            <input
              v-model="newUser.name"
              type="text"
              placeholder="Nama User"
              class="input input-bordered"
              :class="{ 'border-red-500': errorFields.name }"
            />
          </div>
          <div class="form-control mb-4">
            <label class="label">
              <span class="label-text">Email</span>
            </label>
            <input
              v-model="newUser.password"
              type="password"
              placeholder="Email User"
              class="input input-bordered"
              :class="{ 'border-red-500': errorFields.password }"
            />
          </div>
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
import { ref, onMounted, computed } from 'vue'
import { database } from '@/firebase'
import { ref as dbRef, onValue, remove, set, update } from 'firebase/database'

const user = ref([])
const dbRefuser = dbRef(database, 'user')

const isLoading = ref(true)
const noData = ref(false)
const editMode = ref(false)
const idUserEdit = ref(null)

onMounted(() => {
  onValue(dbRefuser, (snapshot) => {
    const data = snapshot.val()
    if (data) {
      user.value = Object.keys(data).map((key) => {
        const user = data[key]
        return {
          id: key,
          name: user.username || 'Tanpa Nama',
          password: user.password || 'Tidak Diketahui',
        }
      })
      paginationUser()
      noData.value = false
    } else {
      noData.value = true
    }
    isLoading.value = false
  })
})

const showModal = ref(false)
const newUser = ref({
  name: '',
  password: '',
})

//ini tempat untuk check inputan pengguna
const errorFields = ref({
  name: false,
  password: false,
})

// Fungsi ketika modal di tutup
const closeModal = () => {
  showModal.value = false
  resetForm()
}

// Fungsi untuk mereset form
const resetForm = () => {
  editMode.value = false
  idUserEdit.value = null
  newUser.value = {
    name: '',
    password: '',
  }
  errorFields.value = {
    name: false,
    password: false,
  }
}

// Fungsi validasi data
const validateUser = () => {
  let hasError = false
  errorFields.value = {
    name: false,
    password: false,
  }

  if (!newUser.value.name.trim()) {
    errorFields.value.name = true
    hasError = true
  }
  if (!newUser.value.password.trim()) {
    errorFields.value.password = true
    hasError = true
  }
  return hasError
}

// Fungsi untuk menyimpan user baru
const saveUser = () => {
  const hasError = validateUser()
  if (hasError) {
    showNotifikasi('Harap lengkapi semua field yang diperlukan', 'alert-error')
    return
  }

  const sanitizedname = newUser.value.name.trim().replace(/[.#$/[\]]/g, '')
  if (!sanitizedname) {
    showNotifikasi(' username tidak valid', 'alert-error')
    return
  }

  openConfirmModal('Apakah Anda yakin ingin menambahkan user ini?', () => {
    const newUserRef = dbRef(database, `user/${sanitizedname}`)
    set(newUserRef, newUser.value)
      .then(() => {
        closeModal()
        showNotifikasi('User berhasil ditambahkan', 'alert-success')
      })
      .catch((error) => {
        alert(`Gagal menambahkan user: ${error.message}`)
        console.error(error)
      })
  })
}

// Fungsi untuk mengedit user
const editUser = (user) => {
  editMode.value = true
  idUserEdit.value = user.id
  newUser.value = { ...user }
  showModal.value = true
}

// Fungsi untuk memperbarui user
const updateUser = () => {
  const hasError = validateUser()
  if (hasError) {
    alert('Harap lengkapi semua field yang diperlukan.')
    return
  }

  if (!idUserEdit.value) return
  openConfirmModal('Apakah Anda yakin ingin memperbarui user ini?', () => {
    const userRef = dbRef(database, `user/${idUserEdit.value}`)
    update(userRef, newUser.value)
      .then(() => {
        closeModal()
        showNotifikasi('User berhasil diperbarui', 'alert-success')
      })
      .catch((error) => {
        alert(`Gagal memperbarui user: ${error.message}`)
        console.error(error)
      })
  })
}

// Fungsi untuk menghapus user
const deleteUser = (userId) => {
  const userRef = dbRef(database, `user/${userId}`)
  remove(userRef)
    .then(() => {
      cekPageKetikaUserDiHapus()
      showNotifikasi('User berhasil dihapus', 'alert-success')
      user.value = user.value.filter((user) => user.id !== userId)
    })
    .catch((error) => {
      console.error('Gagal menghapus user:', error)
    })
}

// bagian untuk Mengurus popup konfirmasi
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

//bab bab an biar keren
const paginatedBooks = ref([]) // Untuk menyimpan buku yang dipaginasi
const currentPage = ref(1) // Halaman saat ini
const itemsPerPage = 5 // Jumlah item per halaman

const paginationUser = () => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = currentPage.value * itemsPerPage
  paginatedBooks.value = user.value.slice(start, end)
}
const totalPages = computed(() => {
  return Math.ceil(user.value.length / itemsPerPage)
})
const changePage = (direction) => {
  if (direction === 'next' && currentPage.value < totalPages.value) {
    currentPage.value++
  } else if (direction === 'prev' && currentPage.value > 1) {
    currentPage.value--
  }
  paginationUser()
}

// Fungsi untuk menghapus user atau akun
const cekPageKetikaUserDiHapus = () => {
  const bukuYangTersisaDidalamPage = paginatedBooks.value
  if (bukuYangTersisaDidalamPage.length === 0 && currentPage.value > 1) {
    currentPage.value--
    paginationUser()
  }
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
