<script setup>
import { ref, onMounted } from 'vue'
import { getDatabase, ref as dbRef, onValue, update } from 'firebase/database'
import DesainBuku from '@/components/user/pustaka/DesainBuku.vue'
import BookmarkPage from '@/components/user/pustaka/BookmarkPage.vue'
import router from '@/router'

const props = defineProps({ userId: String })
const db = getDatabase()

const pinjaman = ref([])
const loading = ref(true)
const activeTab = ref('pinjaman') // tab yang aktif

// variabel modal
const showModal = ref(false)
const selectedBook = ref(null)

onMounted(() => {
  if (!props.userId) {
    console.log('User belum login.')
    loading.value = false
    return
  }

  const pinjamanRef = dbRef(db, 'pinjaman')
  onValue(pinjamanRef, async (snapshot) => {
    const data = snapshot.val()
    if (data) {
      const updates = {}
      const now = new Date()

      Object.entries(data).forEach(([id, value]) => {
        if (value.DiPinjam && value.WaktuKembali) {
          const waktuKembali = new Date(value.WaktuKembali)

          if (now >= waktuKembali) {
            // Ubah DiPinjam jadi false karena sudah lewat waktu
            updates[`pinjaman/${id}/DiPinjam`] = false
            updates[`kategori/${value.kategori}/${value.judul}/stock`] = +1
          }
        }
      })

      // Kirim update sekaligus jika ada
      if (Object.keys(updates).length > 0) {
        await update(dbRef(db), updates)
        console.log('Pinjaman otomatis diperbarui karena lewat waktu.')
      }

      // Setelah update, filter seperti biasa
      pinjaman.value = Object.entries(data)
        // eslint-disable-next-line no-unused-vars
        .filter(([_, value]) => value.username === props.userId && value.DiPinjam == true)
        .map(([id, value]) => ({ id, ...value }))
    }

    loading.value = false
  })
})

function showToast(message, type = 'info') {
  const toast = document.createElement('div')
  toast.className = `alert alert-${type}`
  toast.innerHTML = `<span>${message}</span>`

  const container = document.getElementById('toast-container')
  container.appendChild(toast)

  // Hapus toast setelah 3 detik
  setTimeout(() => {
    toast.remove()
  }, 3000)
}
function konfirmasiKembalikan(buku) {
  selectedBook.value = buku
  showModal.value = true
}

// mengembalikan buku
async function lanjutkanPengembalian() {
  try {
    const pinjamanRef = dbRef(db, `pinjaman/${selectedBook.value.id}`)
    await update(pinjamanRef, { DiPinjam: false })

    showToast(`✅ Buku "${selectedBook.value.judul}" berhasil dikembalikan.`, 'success')
    showModal.value = false
    router.push('/pustaka')
  } catch (error) {
    console.error('Gagal mengembalikan buku:', error)
    showToast('❌ Gagal mengembalikan buku. Silakan coba lagi.', 'error')
    showModal.value = false
  }
}

function handleBaca(book) {
  router.push(`/buku/${book.kategori}/${book.judul}`)
}
</script>

<template>
  <div class="min-h-screen w-full px-6 sm:px-10 md:px-16 lg:px-20 py-10">
    <h2 class="text-3xl font-bold text-primary mb-6 text-center">
      📚 {{ userId ? `Pustaka Kamu (${userId})` : 'Silakan login untuk melihat pustaka' }}
    </h2>
    <div class="toast toast-top toast-end z-50" id="toast-container"></div>

    <div class="flex justify-center mb-6">
      <div class="tabs tabs-boxed">
        <button
          class="tab"
          :class="{ 'tab-active': activeTab === 'pinjaman' }"
          @click="activeTab = 'pinjaman'"
        >
          Pinjaman
        </button>
        <button
          class="tab"
          :class="{ 'tab-active': activeTab === 'bookmark' }"
          @click="activeTab = 'bookmark'"
        >
          Bookmark
        </button>
      </div>
    </div>

    <!-- Tab Content -->
    <div v-if="activeTab === 'pinjaman'">
      <DesainBuku
        :loading="loading"
        :listPinjaman="pinjaman"
        @kembalikan="konfirmasiKembalikan"
        @baca="handleBaca"
      />
      <div v-if="!loading && pinjaman.length === 0" class="text-center text-gray-500 mt-6">
        ❌ Tidak ada pinjaman aktif.
      </div>
    </div>

    <div v-else-if="activeTab === 'bookmark'">
      <BookmarkPage :user-id="userId" />
    </div>
  </div>

  <!-- modal konfirmasi -->
  <input type="checkbox" id="modal-konfirmasi" class="modal-toggle" v-model="showModal" />
  <div class="modal" v-if="showModal">
    <div class="modal-box">
      <h3 class="font-bold text-lg">Konfirmasi Pengembalian</h3>
      <p class="py-4">
        Yakin ingin mengembalikan buku <strong>"{{ selectedBook?.judul }}"</strong>?
      </p>
      <div class="modal-action">
        <button class="btn btn-error" @click="showModal = false">Batal</button>
        <button class="btn btn-success" @click="lanjutkanPengembalian">Ya, Kembalikan</button>
      </div>
    </div>
  </div>
</template>
