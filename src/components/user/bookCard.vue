<template>
  <div
    @click="router.push(`buku/${book.kategori}/${book.judul}`)"
    class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-colors duration-300"
  >
    <!-- Cover Image -->
    <div class="relative h-48 sm:h-64 md:h-72 lg:h-80">
      <img
        :src="book.cover || '/fallback.jpg'"
        alt="Book Cover"
        class="w-full h-full object-cover"
      />
      <div
        v-if="book.kategori"
        class="absolute top-2 left-2 px-2 py-1 text-xs font-semibold bg-primary text-white rounded sm:text-sm"
      >
        {{ book.kategori }}
      </div>
    </div>

    <!-- Book Details -->
    <div class="p-4 sm:p-5">
      <h3 class="text-base font-bold line-clamp-1 dark:text-white sm:text-lg md:text-xl">
        {{ book.judul }}
      </h3>
      <p class="text-xs text-gray-600 line-clamp-1 mt-2 dark:text-gray-400 sm:text-sm md:text-base">
        {{ book.deskripsi || 'Deskripsi tidak tersedia.' }}
      </p>
      <div class="mt-3 flex items-center justify-between">
        <span class="text-[10px] text-gray-500 dark:text-gray-400 sm:text-xs md:text-sm">
          {{ book.TanggalTerbit ? formatDate(book.TanggalTerbit) : 'Tidak diketahui' }}
        </span>
        <span
          v-if="book.view"
          class="text-[10px] text-gray-500 dark:text-gray-400 flex items-center sm:text-xs md:text-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-3 w-3 inline-block mr-1 sm:h-4 sm:w-4 text-gray-500 dark:text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01"
            />
          </svg>
          {{ book.view }} view
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import router from '@/router'

defineProps({
  book: {
    type: Object,
    required: true,
  },
})

function formatDate(tanggalStr) {
  if (!tanggalStr) return 'Tidak diketahui' // Handle null atau undefined
  const date = new Date(tanggalStr) // Parse ISO date
  const options = { day: 'numeric', month: 'short', year: 'numeric' }
  return date.toLocaleDateString('id-ID', options) // Format tanggal dalam bahasa Indonesia
}
</script>

<style scoped>
/* Optional styling for smooth transitions */
.card {
  border: 1px solid #e5e7eb; /* Light theme border */
}

.card img {
  transition: opacity 0.3s ease;
}

.card img:hover {
  opacity: 0.9; /* Slight fade effect on hover */
}

/* Dark Mode Styling */
.dark .card {
  border-color: #4b5563; /* Border color for dark mode */
}

.dark .card img:hover {
  opacity: 0.8; /* Adjust hover effect for dark mode */
}
</style>
