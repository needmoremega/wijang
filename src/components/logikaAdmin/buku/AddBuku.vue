<template>
  <div class="p-6 max-w-lg mx-auto">
    <h2 class="text-2xl font-bold mb-4">Tambah Buku</h2>
    <form @submit.prevent="addBook" class="space-y-4">
      <div class="form-control">
        <label class="label">
          <span class="label-text">Judul</span>
        </label>
        <input
          v-model="book.title"
          type="text"
          placeholder="Masukkan Judul"
          class="input input-bordered"
          required
        />
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Author</span>
        </label>
        <input
          v-model="book.author"
          type="text"
          placeholder="Masukkan Nama Author"
          class="input input-bordered"
          required
        />
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Kategori</span>
        </label>
        <input
          v-model="book.category"
          type="text"
          placeholder="Masukkan Kategori"
          class="input input-bordered"
          required
        />
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Stock</span>
        </label>
        <input
          v-model.number="book.stock"
          type="number"
          min="0"
          placeholder="Masukkan Jumlah Stock"
          class="input input-bordered"
          required
        />
      </div>

      <div class="form-control mt-6">
        <button type="submit" class="btn btn-primary w-full">Tambah Buku</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { database } from '@/firebase'
import { ref as dbRef, set } from 'firebase/database'

const router = useRouter()
const book = reactive({
  title: '',
  author: '',
  category: '',
  stock: 0,
})

const addBook = async () => {
  if (book.title) {
    try {
      const bookRef = dbRef(database, `books/${book.title}`)
      await set(bookRef, {
        author: book.author,
        category: book.category,
        stock: book.stock,
        available: book.stock > 0,
      })

      alert('Buku berhasil ditambahkan!')
      router.back() // Redirect ke halaman sebelumnya
    } catch (error) {
      console.error('Gagal menambahkan buku:', error)
      alert('Terjadi kesalahan saat menambahkan buku.')
    }
  } else {
    alert('Judul tidak boleh kosong.')
  }
}
</script>

<style scoped>
/* Tambahkan gaya tambahan jika diperlukan */
</style>
