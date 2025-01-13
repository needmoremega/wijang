<template>
  <div class="bg-base-200 w-64 p-4 fixed inset-0 md:relative">
    <h1 class="text-xl text-center font-bold mb-4">Wijang Admin</h1>

    <!-- Sidebar Menu -->
    <ul class="menu gap-1">
      <li v-for="item in Menu" :key="item.name">
        <RouterLink :to="item.path" class="block p-2 hover:bg-base-300 rounded-md">
          {{ item.name }}
        </RouterLink>
      </li>
    </ul>
  </div>

  <!-- Optional: Mobile Toggle Button -->
  <div class="md:hidden p-4">
    <button @click="toggleSidebar" class="btn btn-primary">☰ Menu</button>
  </div>

  <!-- Optional: Sidebar Mobile View -->
  <div
    v-if="sidebarOpen"
    class="fixed inset-0 bg-opacity-50 bg-black z-10 md:hidden"
    @click="toggleSidebar"
  ></div>
</template>

<script setup>
import { ref } from 'vue'

const Menu = [
  { name: 'Dashboard', path: '/admin/dashboard' },
  { name: 'Buku', path: '/admin/buku' },
  { name: 'User', path: '/admin/user' },
]

const sidebarOpen = ref(false)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}
</script>

<style scoped>
/* Styling untuk tampilan sidebar di mobile */
@media (max-width: 768px) {
  .bg-base-200 {
    position: absolute;
    top: 0;
    left: 0;
    width: 80%;
    height: 100%;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  .bg-base-200.open {
    transform: translateX(0);
  }
}
</style>
