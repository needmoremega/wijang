<template>
  <div class="p-4 sm:p-6 md:p-8">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-bold">user</h2>
      <button @click="showModal = true" class="btn btn-success">Tambah User</button>
    </div>

    <!-- Tabel user -->
    <table v-if="user.length > 0" class="table w-full table-auto">
      <thead>
        <tr>
          <th>Nama</th>
          <th>Email</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in user" :key="user.id">
          <td>{{ user.name }}</td>
          <td>{{ user.password }}</td>
          <td>
            <button @click="editUser(user)" class="btn btn-primary btn-sm">Edit</button>
            <button @click="deleteUser(user.id)" class="btn btn-danger btn-sm">Hapus</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal Tambah/Edit User -->
    <div v-if="showModal" class="modal modal-open">
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
              type="email"
              placeholder="Email User"
              class="input input-bordered"
              :class="{ 'border-red-500': errorFields.email }"
            />
            
          </div>
          <div class="modal-action">
            <button type="button" class="btn" @click="closeModal">Batal</button>
            <button type="submit" class="btn btn-primary">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
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
          name: user.name || 'Tanpa Nama',
          password: user.email || 'Tidak Diketahui',
        }
      })
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
  email: '',
})

//ini tempat untuk check inputan pengguna
const errorFields = ref({
  name: false,
  email: false,
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
    email: '',
  }
  errorFields.value = {
    name: false,
    email: false,
  }
}

// Fungsi validasi data
const validateUser = () => {
  let hasError = false
  errorFields.value = {
    name: false,
    email: false,
  }

  if (!newUser.value.name.trim()) {
    errorFields.value.name = true
    hasError = true
  }
  if (!newUser.value.email.trim()) {
    errorFields.value.email = true
    hasError = true
  }
  return hasError
}

// Fungsi untuk menyimpan user baru
const saveUser = () => {
  const hasError = validateUser()
  if (hasError) {
    alert('Harap lengkapi semua field yang diperlukan.')
    return
  }

  const sanitizedEmail = newUser.value.email.trim().replace(/[.#$/[\]]/g, '')
  if (!sanitizedEmail) {
    alert('Email user tidak boleh kosong atau tidak valid.')
    return
  }

  const newUserRef = dbRef(database, `user/${sanitizedEmail}`)
  set(newUserRef, newUser.value)
    .then(() => {
      closeModal()
      console.log('User berhasil ditambahkan')
    })
    .catch((error) => {
      alert(`Gagal menambahkan user: ${error.message}`)
      console.error(error)
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
  const userRef = dbRef(database, `user/${idUserEdit.value}`)
  update(userRef, newUser.value)
    .then(() => {
      closeModal()
      console.log('User berhasil diperbarui')
    })
    .catch((error) => {
      alert(`Gagal memperbarui user: ${error.message}`)
      console.error(error)
    })
}

// Fungsi untuk menghapus user
const deleteUser = (userId) => {
  const userRef = dbRef(database, `user/${userId}`)
  remove(userRef)
    .then(() => {
      console.log('User berhasil dihapus')
      user.value = user.value.filter((user) => user.id !== userId)
    })
    .catch((error) => {
      console.error('Gagal menghapus user:', error)
    })
}
</script>
