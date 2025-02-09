<template>
  <div class="w-full mt-2">
    <swiper
      :modules="[Navigation, Pagination, Autoplay]"
      :slides-per-view="1"
      :space-between="20"
      :loop="true"
      :navigation="{ clickable: true }"
      :pagination="{ clickable: true }"
      :autoplay="{ delay: 3000, disableOnInteraction: false }"
    >
      <swiper-slide v-for="(slide, index) in slides" :key="index">
        <!-- ini adalah isi slider -->
        <figure
          class="card relative w-full h-60 bg-cover bg-center rounded-lg overflow-hidden"
          :style="{ backgroundImage: `url(${slide.bgImage})` }"
        >
          <!-- overlay -->
          <div class="absolute inset-0 bg-black bg-opacity-50"></div>
          <!-- Deskripsi slider -->
          <div class="flex items-center h-full px-6">
            <div class="w-2/3 mx-10 text-white z-10">
              <h2 class="text-2xl font-bold">{{ slide.title }}</h2>
              <p class="mt-2">{{ slide.description }}</p>
            </div>
            <!-- image slider -->
            <img
              :src="slide.image"
              class="w-32 h-32 object-cover transform rotate-6 shadow-lg border-4 border-white"
            />
          </div>
        </figure>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const slides = ref([
  {
    title: 'Judul Slide 1',
    description: 'Deskripsi slide pertama.',
    bgImage: 'https://source.unsplash.com/600x400/?nature',
    image: 'https://source.unsplash.com/200x200/?nature',
  },
  {
    title: 'Judul Slide 2',
    description: 'Deskripsi slide kedua.',
    bgImage: 'https://source.unsplash.com/600x400/?forest',
    image: 'https://source.unsplash.com/200x200/?forest',
  },
])
</script>

<style>
.swiper-button-next,
.swiper-button-prev {
  color: white;
}
</style>
