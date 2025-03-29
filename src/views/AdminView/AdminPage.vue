<template>
  <div class="flex h-screen overflow-hidden">
    <!-- Sidebar -->
    <AdminSidebar
      :class="{ 'hidden md:block': !isSidebarOpen }"
      class="fixed md:static h-screen overflow-hidden"
    />

    <div
      class="flex-1 flex flex-col h-screen overflow-hidden transition-all duration-300"
      :class="{ 'ml-12': isSidebarOpen, 'ml-0': !isSidebarOpen }"
    >
      <!-- Toggle Button -->
      <button @click="toggleSidebar" class="btn btn-primary md:hidden ml-4 mt-4">
        {{ isSidebarOpen ? 'Tutup Menu' : 'Buka Menu' }}
      </button>

      <!-- Main Content -->
      <div class="flex-1 overflow-auto">
        <router-view class="bg-base-300 rounded-lg mx-2 my-4 min-h-full" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AdminSidebar from '@/components/AdminSidebar.vue'

const isSidebarOpen = ref(false)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}
</script>

<style>
/* Pastikan sidebar tidak menimpa konten di layar kecil */
@media (max-width: 768px) {
  .fixed {
    position: absolute;
    width: 12rem; /* Sesuaikan dengan lebar sidebar */
    height: 100vh;
    background: var(--fallback-b1, #1e293b); /* Warna base dari DaisyUI */
    z-index: 50;
  }
}
</style>
