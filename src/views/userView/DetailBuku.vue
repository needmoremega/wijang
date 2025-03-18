<template>
  <div class="container min-h-screen mx-auto p-4">
    <!-- background  -->
    <div v-if="book" class="flex flex-col">
      <div class="relative w-full h-60">
        <img
          v-if="book"
          :src="book.cover"
          alt="Book Cover"
          class="absolute inset-0 w-full h-full object-cover blur-lg brightness-50"
        />
      </div>
      <div class="-mt-60 z-10">
        <!-- navigasi -->
        <div class="flex flex-1 justify-between p-4">
          <!-- pinjam buku dan baca buku -->
          <button class="btn btn-circle btn-soft">
            <svg
              width="900px"
              height="900px"
              viewBox="50 0 1024 1024"
              fill="#ffffffff"
              class="size-[2rem]"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M669.6 849.6c8.8 8 22.4 7.2 30.4-1.6s7.2-22.4-1.6-30.4l-309.6-280c-8-7.2-8-17.6 0-24.8l309.6-270.4c8.8-8 9.6-21.6 2.4-30.4-8-8.8-21.6-9.6-30.4-2.4L360.8 480.8c-27.2 24-28 64-0.8 88.8l309.6 280z"
                fill=""
              />
            </svg>
          </button>
          <!-- wishlist -->
          <button class="btn btn-circle btn-soft">
            <svg
              width="800px"
              height="800px"
              viewBox="0 0 16 16"
              class="size-[2rem]"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
            >
              <path
                fill="#ffffff"
                d="M8 1.4l-2 1.3v-1.7h-2v3l-4 2.6 0.6 0.8 7.4-4.8 7.4 4.8 0.6-0.8z"
              ></path>
              <path fill="#ffffff" d="M8 4l-6 4v7h5v-3h2v3h5v-7z"></path>
            </svg>
          </button>
        </div>

        <!-- content buku -->
        <div class="relative container mx-auto flex flex-col lg:flex-row gap-6 p-4">
          <div class="flex flex-col lg:flex-col gap-10 p-4">
            <div class="flex flex-col lg:flex-row gap-6">
              <!-- Cover Buku -->
              <div class="w-full lg:w-1/4 flex justify-center">
                <img
                  v-if="book"
                  :src="book.cover"
                  alt="Book Cover"
                  class="w-48 h-72 rounded-lg shadow-lg"
                />
              </div>

              <!-- Judul Buku dan Tombol Aksion -->
              <div class="lg:w-3/4 space-y-4">
                <!-- judul -->
                <h1 class="text-5xl font-bold">{{ book?.judul }}</h1>
                <h3 class="text-gray-400">{{ book?.judul }}</h3>

                <!-- Tombol Action -->
                <div class="flex flex-col lg:flex-row gap-6">
                  <button
                    @click="teksBtnPinjamBaca === 'Baca Buku' ? BacaBuku : PinjamBuku"
                    class="btn btn-lg btn-primary"
                  >
                    <svg
                      width="24px"
                      height="24px"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1.5 0C1.22386 0 1 0.223858 1 0.5V13.5C1 13.7761 1.22386 14 1.5 14H3V0H1.5Z"
                        fill="#000000"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M4 15H5V14H11.5C12.8807 14 14 12.8807 14 11.5V2.5C14 1.11929 12.8807 0 11.5 0H4V15ZM11 5H7V4H11V5Z"
                        fill="#000000"
                      />
                    </svg>
                    {{ teksBtnPinjamBaca ? 'Pinjam Buku' : 'Baca Buku' }}
                  </button>
                  <button class="btn btn-lg btn-outline">Bookmark</button>
                  <!-- <button class="btn btn-outline">Tambah ke Readlist</button> -->
                </div>

                <!-- Statistik -->
                <div class="flex items-center gap-4 text-gray-500">
                  <div class="flex items-center gap-2">
                    ⭐ <span class="text-lg font-semibold">{{ book?.rating || '9.2' }}</span>
                  </div>
                  <div class="h-5 w-px bg-gray-400"></div>
                  <div class="flex items-center gap-2">
                    👁️ <span class="text-lg font-semibold">{{ book?.views || '1.2M' }}</span>
                  </div>
                  <div class="h-5 w-px bg-gray-400"></div>
                  <div class="flex items-center gap-2">
                    📌 <span class="text-lg font-semibold">{{ book?.bookmark || '14,640' }}</span>
                  </div>
                </div>
              </div>
            </div>
            <!-- deskripsi Buku -->
            <div class="flex flex-col gap-4">
              <p class="text-gray-300 line-clamp-3" :class="{ 'line-clamp-none': showMore }">
                {{
                  book?.deskripsi ||
                  'Ini merupakan deskripsi dari suatu buku di atas, deskripsi ini muncul karena buku ini masih belum memiliki deskripsinya sendiri. Kami akan segera menambahkan deskripsi buku ini.'
                }}
              </p>
              <button @click="showMore = !showMore" class="text-blue-400">
                {{ showMore ? 'Read Less' : 'Read More' }}
              </button>

              <!-- Informasi Buku -->
              <div class="flex flex-col gap-3 lg:grid grid-cols-3 text-gray-300">
                <div class="flex gap-5 flex-row lg:flex-col">
                  <h4 class="font-semibold">Stock</h4>
                  <span class="badge badge-outline">
                    {{ book?.stock }}
                  </span>

                  <!-- aktifkan jika mau pakai genre -->
                  <!-- <h4 class="font-semibold">Genre</h4>
                  <div class="flex gap-2 flex-wrap">
                    <span v-for="genre in book?.genre" :key="genre" class="badge badge-outline">
                      {{ genre }}
                    </span>
                  </div> -->
                </div>
                <div class="flex gap-3 flex-row lg:flex-col">
                  <h4 class="font-semibold">Author</h4>
                  <p>{{ book?.author }}</p>
                </div>
                <div class="flex gap-3 flex-row lg:flex-col">
                  <h4 class="font-semibold">Waktu Terbit</h4>
                  <p>{{ book?.TanggalTerbit || '30 Desember 9999' }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <p class="text-center">Memuat data buku...</p>
    </div>
  </div>
  <FotterUser class="" />
</template>

<script setup>
import FotterUser from '@/components/user/FotterUser.vue'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { database } from '@/firebase'
import { ref as dbRef, get, push } from 'firebase/database'

const route = useRoute()
const book = ref(null)
const teksBtnPinjamBaca = ref(true)
const showMore = ref(false)

const category = ref(route.params.kategori) // Ambil kategori dari URL
console.log(category.value)
// Ambil detail buku berdasarkan kategori & ID dari URL
onMounted(async () => {
  const bookId = route.params.id
  const booksRef = dbRef(database, `kategori/${category.value}/${bookId}`) // Path Firebase

  console.log(booksRef)
  const snapshot = await get(booksRef)
  if (snapshot.exists()) {
    book.value = snapshot.val()
  } else {
    console.error('Buku tidak ditemukan')
  }
})

// Ambil data user dari localStorage
const user = JSON.parse(localStorage.getItem('user'))
const usernameUser = user.username
// Fungsi untuk meminjam buku (bisa dikembangkan ke sistem peminjaman)
const PinjamBuku = () => {
  alert('Fitur pinjam buku belum tersedia!' + usernameUser)
  // Data yang akan diSImpan ke database
  const DataPinjaman = {
    username: usernameUser,
    judul: book.value.judul,
    kategori: book.value.kategori,
    WaktuPinjam: new Date().toLocaleString(),
    WaktuKembali: new Date().toLocaleString(),
    Status: 'Dipinjam',
    Pdf: book.value.pdf || 'https://www.google.com/', // Ganti dengan link PDF
  }
  // proses menyimpan data ke database
  const SimpanKeDatabase = dbRef(database, `pinjaman/`)
  push(SimpanKeDatabase, DataPinjaman)
    .then(() => {
      teksBtnPinjamBaca.value = 'Baca Buku'
      console.log('Data berhasil disimpan!')
    })
    .catch((error) => {
      console.error('Error menyimpan data: ', error)
    })
}

// Fungsi untuk Membaca
const BacaBuku = () => {
  alert('Fitur baca buku belum tersedia!')
  window.open
}
</script>
<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-none {
  display: block;
}
</style>
