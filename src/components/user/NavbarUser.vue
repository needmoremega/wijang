<template>
  <nav class="navbar bg-base-300 p-5 border-gray-600 border-b-2">
    <div class="navbar-start">
      <a href="#" class="text-lg font-bold">Nama Website</a>
    </div>
    <div class="navbar-center">
      <ul class="flex space-x-10 font-medium">
        <li>
          <router-link
            :to="{ name: 'Home' }"
            class="transition-colors duration-300"
            exact-active-class="text-blue-500 font-bold"
          >
            Home
          </router-link>
        </li>
        <li>
          <router-link
            :to="{ name: 'Jelajahi' }"
            class="transition-colors duration-300"
            exact-active-class="text-blue-500 font-bold"
          >
            Buku
          </router-link>
        </li>

        <!-- Hanya tampil jika userRole === 'admin' -->
        <li v-if="userRole && userRole.toLowerCase() === 'admin'">
          <router-link
            :to="'/admin'"
            class="transition-colors duration-300"
            exact-active-class="text-blue-500 font-bold"
          >
            Admin
          </router-link>
        </li>
      </ul>
    </div>
    <div class="navbar-end gap-6">
      <div class="form-control flex flex-row">
        <input type="text" placeholder="Search" class="input input-bordered w-24 md:w-auto" />
      </div>
      <div class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
          <div class="w-10 rounded-full">
            <img
              alt="Profile Picture"
              src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
            />
          </div>
        </div>
        <ul
          tabindex="0"
          class="menu menu-lg dropdown-content bg-base-100 rounded-box z-20 mt-3 w-52 p-2 shadow"
        >
          <li><a class="justify-between">Profile</a></li>

          <li><a class="text-error font-bold" @click="logout">Logout</a></li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

// Props dari parent component
defineProps({
  userRole: String,
})

const logout = () => {
  localStorage.clear()
  router.push('/logreg')
}
</script>
