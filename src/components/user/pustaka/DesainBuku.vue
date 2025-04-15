<template>
  <div class="w-full">
    <!-- Skeleton Loading -->
    <div
      v-if="loading"
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 2xl:grid-cols-6"
    >
      <div
        v-for="n in 6"
        :key="n"
        class="card border border-gray-800 overflow-hidden animate-pulse"
      >
        <figure class="aspect-[3/4] bg-gray-700 w-full"></figure>
        <div class="card-body p-3 flex flex-col items-center justify-center gap-3">
          <div class="h-4 w-3/4 bg-gray-600 rounded"></div>
          <div class="h-3 w-1/2 bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>

    <!-- Daftar Pinjaman -->
    <section
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-4 gap-6"
      v-if="listPinjaman.length"
    >
      <div
        v-for="book in listPinjaman"
        :key="book.judul"
        class="card bg-base-100 shadow-md hover:shadow-lg transition duration-300 rounded-lg border border-gray-700"
      >
        <!-- Cover -->
        <figure class="aspect-[3/4] w-full overflow-hidden rounded-t-lg relative">
          <img
            :src="book.isiBuku.cover"
            alt="Cover buku"
            class="absolute inset-0 w-full h-full object-cover"
          />
        </figure>

        <!-- Info -->
        <div class="card-body p-4 flex flex-col justify-between">
          <div>
            <h2 class="text-base font-bold line-clamp-2 break-words mb-1">
              {{ book.judul }}
            </h2>
            <p class="text-sm text-gray-400">
              {{ book.isiBuku.author }}<br />
              <span class="text-xs italic">{{ book.kategori }}</span>
            </p>
            <p class="text-xs text-gray-400 mt-2 line-clamp-4 h-[64px]">
              {{ book.isiBuku.deskripsi || 'Deskripsi belum tersedia.' }}
            </p>
          </div>

          <!-- Aksi -->
          <div class="flex flex-col gap-2 mt-4">
            <a
              :href="`baca/${book.kategori}/${book.judul}`"
              class="btn btn-sm btn-primary w-full"
              @click.stop
            >
              📖 Baca Buku
            </a>
            <button class="btn btn-sm btn-error w-full" @click.stop="$emit('kembalikan', book)">
              🔄 Kembalikan
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Tidak Ada Pinjaman -->
    <div v-else class="text-center text-gray-500 mt-6">📭 Belum ada buku yang dipinjam.</div>
  </div>
</template>

<script setup>
defineProps({
  listPinjaman: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: true,
  },
})
defineEmits(['kembalikan', 'baca'])
</script>
