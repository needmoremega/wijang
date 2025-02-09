<template>
  <div class="w-full flex flex-col">
    <NavbarUser class="z-20" />
    <SwiperUser class="w-2/4 self-center" />
    <div>
      <h1 class="text-2xl font-bold">Welcome to the Home Page</h1>
      <p>Ini di Homepage view.</p>
      <button @click="logout" class="btn btn-active btn-secondary">logout</button>

      <div class="card-body">
        <h2>Populer</h2>
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
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import SwiperUser from '@/components/user/SwiperUser.vue'
import NavbarUser from '@/components/user/NavbarUser.vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const logout = () => {
  localStorage.clear()
  router.push('/logreg')
}
// Ambil data 'user' dari localStorage
const user = JSON.parse(localStorage.getItem('user'))

// Periksa apakah user ada dan ambil nilai 'role'
const role = user ? user.role : null

console.log(role) // Menampilkan nilai role di konsol
</script>
