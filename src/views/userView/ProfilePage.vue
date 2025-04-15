<template>
  <div class="container px-4 py-8 max-w-full">
    <div>
      <figure class="flex flex-col items-center justify-center gap-4">
        <img
          :src="user.profile || defaultAvatar"
          alt="Profile"
          class="w-32 h-32 mx-auto rounded-full object-cover"
        />

        <label class="btn border-gray-600 bg-opacity-0 cursor-pointer">
          <input type="file" class="hidden" @change="handleFileUpload" accept="image/*" />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            class="w-5 h-5"
          >
            <path
              fill-rule="evenodd"
              d="M3 16.5a.75.75 0 0 1 .75.75V18A2.25 2.25 0 0 0 6 20.25h12A2.25 2.25 0 0 0 20.25 18v-.75a.75.75 0 0 1 1.5 0V18A3.75 3.75 0 0 1 18 21.75H6A3.75 3.75 0 0 1 2.25 18v-.75a.75.75 0 0 1 .75-.75Zm9-12a.75.75 0 0 1 .75.75v9.19l2.47-2.47a.75.75 0 0 1 1.06 1.06l-3.75 3.75a.75.75 0 0 1-1.06 0l-3.75-3.75a.75.75 0 1 1 1.06-1.06l2.47 2.47V5.25a.75.75 0 0 1 .75-.75Z"
              clip-rule="evenodd"
            />
          </svg>
          Upload foto profil
        </label>

        <!-- Upload dan Crop Modal -->
        <div
          v-if="showCropper"
          class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div class="bg-white p-4 rounded-lg max-w-lg w-full relative">
            <cropper
              class="w-full h-96"
              :src="imageSrc"
              :stencil-props="{ aspectRatio: 1, handlers: {}, movable: true, scalable: true }"
              :stencil-component="CircleStencil"
              ref="cropperRef"
            />
            <div class="flex justify-end mt-4 gap-2">
              <button
                class="px-4 py-1 bg-gray-300 rounded"
                @click="cancelCrop"
                :disabled="isUploading"
              >
                Cancel
              </button>
              <button
                class="px-4 py-1 bg-blue-500 text-white rounded flex items-center gap-2"
                @click="applyCrop"
                :disabled="isUploading"
              >
                <svg
                  v-if="isUploading"
                  class="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  />
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                <span>{{ isUploading ? 'Menyimpan...' : 'Simpan' }}</span>
              </button>
            </div>
          </div>
        </div>
      </figure>

      <hgroup class="mt-4 space-y-6">
        <!-- NAMA -->
        <section class="border-b pb-4">
          <div class="flex justify-between items-center">
            <h1 class="text-2xl font-bold">
              Nama
              <p class="text-gray-500 text-sm">{{ user.username }}</p>
            </h1>
            <button class="underline" @click="toggleEdit('username')">
              {{ editField === 'username' ? 'Cancel' : 'Edit' }}
            </button>
          </div>

          <Transition name="slide-fade">
            <div v-if="editField === 'username'" class="mt-4">
              <input v-model="editUsername" class="w-full p-2 border rounded-lg" type="text" />
              <button class="mt-2 bg-blue-500 text-white px-4 py-1 rounded" @click="saveUsername">
                Simpan
              </button>
            </div>
          </Transition>
        </section>

        <!-- PASSWORD -->
        <section class="border-b pb-4">
          <div class="flex justify-between items-center">
            <h2 class="text-2xl font-bold">
              Password
              <p class="text-gray-500 text-sm">********</p>
            </h2>
            <button class="underline" @click="toggleEdit('password')">
              {{ editField === 'password' ? 'Cancel' : 'Edit' }}
            </button>
          </div>

          <Transition name="slide-fade">
            <div v-if="editField === 'password'" class="mt-4">
              <input v-model="editPassword" class="w-full p-2 border rounded-lg" type="password" />
              <button class="mt-2 bg-blue-500 text-white px-4 py-1 rounded" @click="savePassword">
                Simpan
              </button>
            </div>
          </Transition>
        </section>
      </hgroup>
    </div>
  </div>
  <!-- Konfirmasi Modal -->
  <div
    v-if="showConfirmModal"
    class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
  >
    <div class="bg-base-300 rounded-lg p-6 w-full max-w-sm shadow-lg">
      <h2 class="text-lg font-semibold mb-4">Konfirmasi</h2>
      <p class="mb-6">
        Apakah kamu yakin ingin menyimpan perubahan
        {{ pendingAction === 'username' ? 'username' : 'password' }}?
      </p>
      <div class="flex justify-end gap-2">
        <button @click="cancelAction" class="btn btn-outline">Batal</button>
        <button @click="confirmAction" class="btn btn-success">Ya, Simpan</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Cropper, CircleStencil } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'
import { storage, database } from '@/firebase'
import { ref as storageRef, uploadString, getDownloadURL } from 'firebase/storage'
import { ref as dbRef, set, update } from 'firebase/database'
import { inject } from 'vue'

const toast = inject('toast') // Inject toast

const isUploading = ref(false)
const defaultAvatar = 'https://i.pravatar.cc/150?img=3'
const showCropper = ref(false)
const imageSrc = ref(null)
const cropperRef = ref(null)

const user = ref(JSON.parse(localStorage.getItem('user')) || {})
const editField = ref('')
const editUsername = ref(user.value.username)
const editPassword = ref(user.value.password)

const handleFileUpload = (e) => {
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      imageSrc.value = e.target.result
      showCropper.value = true
    }
    reader.readAsDataURL(file)
  }
}

const applyCrop = async () => {
  const canvas = cropperRef.value.getResult().canvas
  const croppedDataUrl = canvas.toDataURL()
  isUploading.value = true

  try {
    const filePath = `profile/${user.value.username}.jpg`
    const storageReference = storageRef(storage, filePath)
    await uploadString(storageReference, croppedDataUrl, 'data_url')
    const downloadURL = await getDownloadURL(storageReference)

    user.value.profile = downloadURL
    localStorage.setItem('user', JSON.stringify(user.value))

    const userDbRef = dbRef(database, `user/${user.value.username}`)
    await update(userDbRef, { profile: downloadURL })

    toast.value?.showToast('Foto profil berhasil diperbarui!', 'success')
    showCropper.value = false
  } catch (error) {
    console.error('Gagal upload atau update profile:', error)
    toast.value?.showToast('Gagal mengunggah foto profil.', 'error')
  } finally {
    isUploading.value = false
    window.location.reload()
  }
}

const cancelCrop = () => {
  showCropper.value = false
}

const toggleEdit = (field) => {
  editField.value = editField.value === field ? '' : field
}

const showConfirmModal = ref(false)
const pendingAction = ref(null)

const confirmAction = () => {
  showConfirmModal.value = false
  if (pendingAction.value === 'username') {
    performSaveUsername()
  } else if (pendingAction.value === 'password') {
    performSavePassword()
    editPassword.value = ''
  }
  pendingAction.value = null
}
const cancelAction = () => {
  showConfirmModal.value = false
  pendingAction.value = null
  editPassword.value = ''
}

const saveUsername = () => {
  pendingAction.value = 'username'
  showConfirmModal.value = true
}

const savePassword = () => {
  if (!editPassword.value) {
    toast.value?.showToast('Password tidak boleh kosong.', 'error')
    return
  }
  pendingAction.value = 'password'
  showConfirmModal.value = true
}

const performSaveUsername = async () => {
  try {
    const oldUsername = user.value.username
    const newUsername = editUsername.value
    if (!newUsername) return

    const oldRef = dbRef(database, `user/${oldUsername}`)
    const newRef = dbRef(database, `user/${newUsername}`)

    await set(newRef, {
      ...user.value,
      username: newUsername,
    })
    await set(oldRef, null)

    user.value.username = newUsername
    localStorage.setItem('user', JSON.stringify(user.value))
    editField.value = ''

    toast.value?.showToast('Username berhasil diperbarui!', 'success')
  } catch (error) {
    console.error('Gagal update username:', error)
    toast.value?.showToast('Gagal memperbarui username.', 'error')
  }
}

const hashPassword = async (password) => {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}

const performSavePassword = async () => {
  try {
    const hashedPassword = await hashPassword(editPassword.value)
    const userDbRef = dbRef(database, `user/${user.value.username}`)

    user.value.password = hashedPassword
    await update(userDbRef, { password: hashedPassword })
    localStorage.setItem('user', JSON.stringify(user.value))

    editField.value = ''
    toast.value?.showToast('Password berhasil diperbarui!', 'success')
  } catch (error) {
    console.error('Gagal update password:', error)
    toast.value?.showToast('Gagal memperbarui password.', 'error')
  }
}

</script>

<style scoped>
.custom-overlay {
  background-color: rgba(0, 0, 0, 0.7); /* area luar lingkaran jadi hitam transparan */
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  max-height: 0;
  opacity: 0;
}
.slide-fade-enter-to,
.slide-fade-leave-from {
  max-height: 500px;
  opacity: 1;
}
</style>
