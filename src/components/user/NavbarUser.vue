<template>
  <nav
    class="navbar bg-base-300 p-5 border-gray-600 border-b-2 flex items-center justify-between shadow-md"
  >
    <div class="navbar-start flex items-center gap-4">
      <button class="md:hidden btn btn-ghost btn-circle" @click="isMenuOpen = !isMenuOpen">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16m-7 6h7"
          />
        </svg>
      </button>
      <a href="#" class="text-xl font-bold text-primary">Nama Website</a>
    </div>

    <!-- Menu utama -->
    <div
      :class="{ hidden: !isMenuOpen, flex: isMenuOpen }"
      class="navbar-center md:flex md:items-center w-full md:w-auto md:static absolute top-16 left-0 bg-base-300 md:bg-transparent p-4 md:p-0 shadow-md md:shadow-none z-50"
    >
      <ul class="flex flex-col md:flex-row gap-4 md:gap-12 font-medium">
        <li>
          <router-link
            :to="{ name: 'Home' }"
            class="hover:text-primary transition-colors duration-300"
            exact-active-class="text-blue-500 font-bold"
          >
            Home
          </router-link>
        </li>
        <li>
          <router-link
            :to="{ name: 'Jelajahi' }"
            class="hover:text-primary transition-colors duration-300"
            exact-active-class="text-blue-500 font-bold"
          >
            Buku
          </router-link>
        </li>
        <li v-if="userRole && userRole.toLowerCase() === 'admin'">
          <router-link
            :to="'/admin'"
            class="hover:text-primary transition-colors duration-300"
            exact-active-class="text-blue-500 font-bold"
          >
            Admin
          </router-link>
        </li>
      </ul>
    </div>

    <div class="navbar-end flex gap-6 w-auto">
      <button class="btn btn-ghost btn-circle" @click="isSearchOpen = true">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M11 19a8 8 0 110-16 8 8 0 010 16zm-2-2l4-4m0 0l-4-4m4 4H3"
          />
        </svg>
      </button>
      <div class="dropdown dropdown-end">
        <div
          tabindex="0"
          role="button"
          class="btn btn-ghost btn-circle avatar hover:bg-gray-200 transition"
        >
          <div class="w-10 rounded-full border border-gray-300">
            <img
              alt="Profile Picture"
              src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
            />
          </div>
        </div>
        <ul
          tabindex="0"
          class="menu menu-lg dropdown-content bg-base-100 rounded-box z-20 mt-3 w-52 p-2 shadow-md border border-gray-300"
        >
          <li><a class="justify-between hover:bg-gray-100 transition">Profile</a></li>
          <li>
            <a class="text-error font-bold hover:bg-red-100 transition" @click="logout">Logout</a>
          </li>
        </ul>
      </div>
    </div>

    <!-- Search Popup -->
    <div
      v-if="isSearchOpen"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg w-80 md:w-96">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold">Search</h2>
          <button class="text-gray-600 hover:text-gray-900" @click="isSearchOpen = false">
            &times;
          </button>
        </div>
        <input type="text" placeholder="Search..." class="input input-bordered w-full" />
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

defineProps({
  userRole: String,
})

const router = useRouter()
const isMenuOpen = ref(false)
const isSearchOpen = ref(false)

const logout = () => {
  localStorage.clear()
  router.push('/logreg')
}
</script>
