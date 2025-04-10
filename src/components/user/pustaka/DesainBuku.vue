<template>
  <div class="w-full">
    <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      <!-- Skeleton Loader -->
      <div
        v-for="n in 6"
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

    <section v-if="listPinjaman.length" class="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <router-link
        v-for="book in listPinjaman"
        :key="book.judul"
        :to="`/buku/${book.kategori}/${book.judul}`"
        class="card card-side bg-base-100 shadow-md hover:shadow-lg transition duration-300 p-3 rounded-lg border border-gray-700"
      >
        <figure
          class="relative w-36 lg:w-48 min-h-[180px] sm:min-h-[220px] md:min-h-[260px] lg:min-h-[280px] flex-shrink-0 overflow-hidden rounded-lg"
        >
          <img
            :src="book.isiBuku.cover"
            alt="book image"
            class="absolute inset-0 w-full h-full object-cover"
          />
        </figure>

        <div class="flex flex-col justify-between flex-1 p-3">
          <article>
            <p class="card-title text-lg font-semibold truncate">{{ book.judul }}</p>
            <p class="text-sm text-gray-400">{{ book.kategori }} <br />{{ book.isiBuku.author }}</p>
          </article>
          <p class="text-xs text-gray-300 line-clamp-3 max-h-[60px] overflow-hidden">
            {{
              book.isiBuku.deskripsi ||
              'Lorem ipsum dolor sit amet, koding masih panjang, deadline makin dekat!'
            }}
          </p>

          <div class="flex justify-end mt-4 gap-3">
            <a
              :href="book.Pdf"
              target="_blank"
              class="btn self-end btn-primary btn-sm px-4"
              @click.stop
            >
              📖 Baca PDF
            </a>
            <a
              :href="book.Pdf"
              target="_blank"
              class="btn self-end btn-primary btn-sm px-4"
              @click.stop
            >
              📖 Baca PDF
            </a>
          </div>
        </div>
      </router-link>
    </section>

    <div v-else class="text-center text-gray-500 mt-4">📭 Belum ada buku yang dipinjam.</div>
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
</script>
