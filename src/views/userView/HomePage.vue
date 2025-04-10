<template>
  <div class="w-full flex flex-col">
    <SwiperUser class="z-10 w-2/4 self-center" />
    <div class="p-7">
      <h1 class="text-2xl font-bold">Welcome to the Home Page</h1>
      <p>Ini di Homepage view.</p>
      <button @click="logout" class="btn btn-active btn-secondary">logout</button>
      <div class="card mt-10">
        <h2 class="text-2xl text-center">Kategori</h2>
        <section>kerne</section>
      </div>
      <div class="my-5">
        <h2 class="text-2xl p-2">{{}}</h2>
        <div class="flex flex-row gap-5">
          <div class="card bg-base-100 image-full w-64 shadow-xl">
            <figure>
              <img src="/src/assets/gibrna.jpg" alt="Shoes" />
            </figure>
            <div class="card-body">
              <h2 class="card-title">Shoes!</h2>
              <p>If a dog chews shoes whose shoes does he choose?</p>
              <div class="card-actions justify-end">
                <button class="btn btn-primary">Buy Now</button>
              </div>
            </div>
          </div>
          <div class="card image-full w-64 shadow-xl">
            <figure>
              <img src="/src/assets/gibrna.jpg" alt="Shoes" />
            </figure>
            <div class="card-body">
              <h2 class="card-title">Shoes!</h2>
              <p>If a dog chews shoes whose shoes does he choose?</p>
              <div class="card-actions justify-end">
                <button class="btn btn-primary">Buy Now</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card mt-10">
        <h2 class="text-2xl">Terbaru</h2>
        <section>kerne</section>
      </div>
    </div>
  </div>
</template>
<script setup>
import SwiperUser from '@/components/user/SwiperUser.vue'
import { useRouter } from 'vue-router'
const router = useRouter()
console.log(import.meta.env.VITE_FIREBASE_API_KEY)


const logout = () => {
  localStorage.clear()
  router.push('/logreg')
}
</script>
