<template>
  <div class="w-full">
    <!-- Swiper Carousel Hero -->
    <swiper
      :modules="modules"
      :slides-per-view="1.1"
      :space-between="10"
      :centered-slides="true"
      :grab-cursor="true"
      :loop="true"
      :autoplay="{ delay: 1500 }"
      :pagination="{ clickable: true }"
      class="px-4 md:px-16 overflow-visible mb-10 rounded-xl card"
    >
      <swiper-slide
        v-for="(item, index) in heroSlider"
        :key="index"
        class="rounded-xl card overflow-hidden shadow-lg"
      >
        <div class="relative h-64 md:h-[400px] rounded-xl overflow-hidden">
          <img
            :src="item.cover || '/fallback.jpg'"
            alt="Hero Banner"
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent z-10" />
          <div class="absolute bottom-0 left-0 z-20 p-6 text-white max-w-xl flex flex-col gap-2">
            <h2 class="text-2xl md:text-3xl font-bold">{{ item.judul }}</h2>
            <p class="text-sm md:text-base line-clamp-3">
              {{ item.deskripsi || 'Deskripsi tidak tersedia.' }}
            </p>
            <div class="flex gap-2 mt-2">
              <span v-if="item.kategori" class="text-xs bg-primary px-2 py-1 rounded">{{
                item.kategori
              }}</span>
            </div>
          </div>
        </div>
      </swiper-slide>
      <div class="swiper-pagination !bottom-2" />
    </swiper>

    <!-- Section: Terbaru -->
    <section class="p-4 sm:p-6">
      <h2 class="text-2xl font-semibold mb-4">📚 Terbaru</h2>
      <swiper
        :modules="modules"
        :slides-per-view="3"
        :space-between="16"
        :free-mode="true"
        :grab-cursor="true"
        :breakpoints="swiperBreakpoints"
        class="swiper-container"
      >
        <swiper-slide v-for="(book, i) in latestBooks" :key="'new-' + i" class="w-64 flex-shrink-0">
          <BookCard :book="book" />
        </swiper-slide>
      </swiper>
    </section>

    <!-- Section: Populer -->
    <section class="p-4 sm:p-6">
      <h2 class="text-2xl font-semibold mb-4">🔥 Populer</h2>
      <swiper
        :modules="modules"
        :slides-per-view="3"
        :space-between="16"
        :free-mode="true"
        :grab-cursor="true"
        :breakpoints="swiperBreakpoints"
        class="swiper-container"
      >
        <swiper-slide
          v-for="(book, i) in popularBooks"
          :key="'pop-' + i"
          class="w-64 flex-shrink-0"
        >
          <BookCard :book="book" />
        </swiper-slide>
      </swiper>
    </section>

    <!-- Section: Rekomendasi -->
    <section class="p-4 sm:p-6">
      <h2 class="text-2xl font-semibold mb-4">🎯 Rekomendasi</h2>
      <swiper
        :modules="modules"
        :slides-per-view="3"
        :space-between="16"
        :free-mode="true"
        :grab-cursor="true"
        :breakpoints="swiperBreakpoints"
        class="swiper-container"
      >
        <swiper-slide
          v-for="(book, i) in recommendedBooks"
          :key="'rec-' + i"
          class="w-64 flex-shrink-0"
        >
          <BookCard :book="book" />
        </swiper-slide>
      </swiper>
    </section>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { database } from '@/firebase'
import BookCard from '@/components/user/bookCard.vue'
import { get, child, ref as dbRef } from 'firebase/database'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

const modules = [Autoplay, Pagination]
const heroSlider = ref([])

function shuffleArray(array) {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
}

const latestBooks = ref([])
const popularBooks = ref([])
const recommendedBooks = ref([])

function parseTanggal(tanggalStr) {
  if (!tanggalStr) return new Date(0) // Default jika tanggal kosong
  return new Date(tanggalStr) // Parse langsung dari format ISO
}

onMounted(async () => {
  const snapshot = await get(child(dbRef(database), 'kategori'))
  if (snapshot.exists()) {
    const kategoriData = snapshot.val()
    const allBooks = []

    Object.keys(kategoriData).forEach((subKategori) => {
      const bukuDiKategori = kategoriData[subKategori]
      Object.values(bukuDiKategori).forEach((buku) => {
        allBooks.push({ ...buku, kategori: subKategori })
      })
    })

    // Hero Slider: Acak 3 buku
    heroSlider.value = shuffleArray(allBooks).slice(0, 5)

    // Terbaru: urut dari TanggalTerbit terbaru
    latestBooks.value = allBooks
      .filter((b) => b.TanggalTerbit)
      .sort((a, b) => parseTanggal(b.TanggalTerbit) - parseTanggal(a.TanggalTerbit))
      .slice(0, 6)

    // Populer: berdasarkan views
    popularBooks.value = allBooks
      .map((b) => ({ ...b, view: b.view || b.view || 0 }))
      .sort((a, b) => b.view - a.view)
      .slice(0, 6)

    // Rekomendasi: yang diberi flag true
    recommendedBooks.value = allBooks.filter((b) => b.rekomendasi === true).slice(0, 6)
  }
})

// Responsive Breakpoints for Swiper
const swiperBreakpoints = {
  320: { slidesPerView: 1.5, spaceBetween: 10 }, // Small screens (≤400px)
  640: { slidesPerView: 2.5, spaceBetween: 16 }, // Medium screens (400px–768px)
  1024: { slidesPerView: 3.5, spaceBetween: 20 }, // Large screens (768px–1200px)
  1280: { slidesPerView: 4, spaceBetween: 24 }, // Extra large screens (≥1200px)
}
</script>

<style scoped>
/* Optional tweak: position pagination nicely */
.swiper-pagination-bullet {
  background: white;
  opacity: 0.7;
}
.swiper-pagination-bullet-active {
  background: #2563eb; /* btn-primary color (e.g., Tailwind blue-600) */
}
</style>
