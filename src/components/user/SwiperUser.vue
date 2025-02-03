<template>
  <div class="w-full max-w-4xl">
    <swiper
      :slides-per-view="1"
      :space-between="20"
      :loop="true"
      :navigation="{ clickable: true }"
      :pagination="{ clickable: true }"
      :autoplay="{ delay: 3000, disableOnInteraction: false }"
      class="mySwiper"
    >
      <swiper-slide v-for="(slide, index) in slides" :key="index">
        <div
          class="card relative w-full h-60 bg-cover bg-center rounded-lg overflow-hidden"
          :style="{ backgroundImage: `url(${slide.bgImage})` }"
        >
          <div class="absolute inset-0 bg-black bg-opacity-50"></div>
          <div class="flex items-center h-full px-6">
            <div class="w-2/3 text-white z-10">
              <h2 class="text-2xl font-bold">{{ slide.title }}</h2>
              <p class="mt-2">{{ slide.description }}</p>
            </div>
            <img
              :src="slide.image"
              class="w-32 h-32 object-cover transform rotate-6 shadow-lg border-4 border-white"
            />
          </div>
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script setup>
import { ref } from 'vue'
// Import Swiper and necessary modules
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

// You don't need to manually initialize Swiper here
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
