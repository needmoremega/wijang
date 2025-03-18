<template>
  <div class="container mx-auto p-4">
    <div class="grid grid-cols-4 gap-4">
      <!-- Filter Section (Kiri) -->
      <div class="col-span-1 bg-base-300 p-4 rounded-lg shadow">
        <h3 class="font-semibold mb-2">Search</h3>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search by title..."
          class="input input-bordered w-full mb-4"
        />

        <h3 class="font-semibold mb-2">Categories</h3>
        <div v-for="category in categories" :key="category">
          <label class="flex items-center">
            <input
              type="checkbox"
              v-model="selectedCategories"
              :value="category"
              class="checkbox checkbox-sm mr-2"
            />
            {{ category }}
          </label>
        </div>

        <h3 class="font-semibold mt-4 mb-2">Availability</h3>
        <label class="flex items-center">
          <input type="checkbox" v-model="isAvailable" class="checkbox checkbox-sm mr-2" />
          Available
        </label>
      </div>

      <!-- Book List (Kanan) -->
      <div class="col-span-3">
        <div class="grid grid-cols-5 gap-2 auto-rows-[320px]">
          <router-link
            v-for="book in filteredBooks"
            :key="book.judul"
            :to="`/buku/${book.category}/${book.judul}`"
            class="card card-compact overflow-hidden"
          >
            <figure class="px-4 mt-2 self-center">
              <img :src="book.cover" alt="book image" class="object-contain aspect-[3/4]" />
            </figure>
            <div class="card-body">
              <div class="flex flex-col gap-1">
                <p class="text-xs font-thin">{{ book.author }}</p>
                <p class="font-normal">{{ book.judul }}</p>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { database } from '@/firebase'
import { ref as dbRef, get } from 'firebase/database'

const databaseBuku = dbRef(database, 'kategori')
const books = ref([])
const categories = ref([]) // Kategori diambil dari Firebase

onMounted(async () => {
  const snapshot = await get(databaseBuku)
  const data = snapshot.val()

  if (data) {
    books.value = []
    categories.value = Object.keys(data) // Ambil kategori dari database

    Object.keys(data).forEach((category) => {
      const categoryBooks = data[category]
      const booksInCategory = Object.entries(categoryBooks).map(([id, book]) => ({
        ...book,
        id, // Simpan ID buku jika diperlukan
        category,
        isAvailable: book.ketersediaan || false,
      }))
      books.value.push(...booksInCategory)
    })
  } else {
    console.log('Data tidak ditemukan')
  }
})

// State untuk filter
const searchQuery = ref('')
const selectedCategories = ref([])
const isAvailable = ref(false)

// Filter buku berdasarkan pencarian, kategori, dan ketersediaan
const filteredBooks = computed(() => {
  return books.value.filter((book) => {
    const matchesSearch = book.judul.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory =
      selectedCategories.value.length === 0 || selectedCategories.value.includes(book.category)
    const matchesAvailability = !isAvailable.value || book.isAvailable

    return matchesSearch && matchesCategory && matchesAvailability
  })
})
</script>
