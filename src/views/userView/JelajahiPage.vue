<template>
  <div class="container mx-auto p-4">
    <!-- Tombol Filter untuk Mobile -->

    <div class="md:hidden flex justify-between items-center mb-4">
      <h2 class="text-lg font-semibold">Book List</h2>
      <button @click="showFilters = !showFilters" class="btn btn-sm btn-outline">
        {{ showFilters ? 'Hide Filters' : 'Show Filters' }}
      </button>
    </div>

    <div class="flex flex-col md:grid md:grid-cols-4 gap-4">
      <!-- Filter Section (Kiri) -->
      <aside
        :class="[
          '-ms-[1.3rem] bg-base-200 p-4 rounded-lg shadow transition-all duration-300 opacity-100 md:opacity-100',
          showFilters ? 'block' : 'hidden md:block',
        ]"
      >
        <h3 class="font-semibold mb-2 text-lg">Search</h3>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search by title..."
          class="input input-bordered w-full mb-4"
        />

        <h3 class="font-semibold mb-2 text-lg">Categories</h3>

        <!-- Skeleton Loader Saat Loading -->
        <div v-if="isLoading" class="space-y-2">
          <div v-for="n in 5" :key="n" class="h-4 w-3/4 bg-gray-700 rounded animate-pulse"></div>
        </div>

        <div v-else>
          <div v-for="category in categories" :key="category">
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                v-model="selectedCategories"
                :value="category"
                class="checkbox checkbox-primary"
              />
              {{ category }}
            </label>
          </div>
        </div>

        <h3 class="font-semibold mt-4 mb-2 text-lg">Availability</h3>

        <!-- Skeleton Loader untuk Availability Checkbox -->
        <div v-if="isLoading" class="h-4 w-1/2 bg-gray-700 rounded animate-pulse"></div>

        <label v-else class="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" v-model="isAvailable" class="checkbox checkbox-success" />
          Available
        </label>
      </aside>

      <main class="md:col-span-3">
        <!-- Skeleton Loader Saat Loading -->
        <div v-show="isLoading" class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            v-for="n in 8"
            :key="n"
            class="card card-compact border border-gray-800 overflow-hidden animate-pulse"
          >
            <figure class="relative w-full aspect-[3/4] bg-gray-700"></figure>
            <div class="card-body p-3 flex flex-col items-center justify-center gap-3">
              <div class="h-4 w-3/4 bg-gray-600 rounded"></div>
              <div class="h-3 w-1/2 bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>

        <div
          v-if="filteredBooks.length"
          class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[auto]"
        >
          <router-link
            v-for="book in filteredBooks"
            :key="book.judul"
            :to="`/buku/${book.category}/${book.judul}`"
            class="card card-compact border border-gray-800 overflow-hidden hover:shadow-lg transition duration-300"
          >
            <figure
              class="relative w-full aspect-[3/4] min-h-[180px] sm:min-h-[220px] md:min-h-[260px] lg:min-h-[300px]"
            >
              <img
                :src="book.cover"
                alt="book image"
                class="absolute inset-0 w-full h-full object-fill"
              />
            </figure>
            <div class="card-body p-3 flex flex-col items-center justify-center gap-6">
              <p class="font-medium text-l truncate">{{ book.judul }}</p>
              <p class="text-s text-gray-300 truncate">{{ book.author }}</p>
            </div>
          </router-link>
        </div>

        <div v-else class="text-center text-gray-500 mt-4">Gak ada Buku nih Ges.</div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { database } from '@/firebase'
import { ref as dbRef, get } from 'firebase/database'

// State
const books = ref([])
const categories = ref([])
const searchQuery = ref('')
const selectedCategories = ref([])
const isAvailable = ref(false)
const showFilters = ref(false)
const isLoading = ref(true)

// Fetch Data dari Firebase
onMounted(async () => {
  try {
    const databaseBuku = dbRef(database, 'kategori')
    const snapshot = await get(databaseBuku)
    const data = snapshot.val()

    if (data) {
      books.value = []
      categories.value = Object.keys(data)

      Object.keys(data).forEach((category) => {
        const categoryBooks = data[category]
        const booksInCategory = Object.entries(categoryBooks).map(([id, book]) => ({
          ...book,
          id,
          category,
          isAvailable: book.ketersediaan || false,
        }))
        books.value.push(...booksInCategory)
      })
    } else {
      console.log('Data tidak ditemukan')
    }
  } catch (error) {
    console.error('Error fetching books:', error)
  } finally {
    isLoading.value = false
  }
})

// Filtering Data
const filteredBooks = computed(() => {
  return books.value.filter((book) => {
    const matchesSearch = book.judul?.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory =
      selectedCategories.value.length === 0 || selectedCategories.value.includes(book.category)
    const matchesAvailability = !isAvailable.value || book.isAvailable

    return matchesSearch && matchesCategory && matchesAvailability
  })
})
</script>

<style scoped>
/* Hover effect for smooth transitions */
.card:hover {
  transform: translateY(-2px);
}
</style>
