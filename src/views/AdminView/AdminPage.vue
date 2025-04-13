<template>
  <div class="flex min-h-screen w-full">
    <!-- Sidebar -->
    <AdminSidebar
      class="h-screen w-64 fixed z-40 md:static"
      :sidebarOpen="sidebarOpen"
      :closeSidebar="closeSidebar"
    />

    <!-- Overlay (mobile) -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
      @click="closeSidebar"
    ></div>

    <!-- Konten Utama -->
    <div class="flex flex-col flex-1 w-full min-h-screen ml-0">
      <!-- Tombol Toggle Mobile -->
      <button @click="toggleSidebar" class="btn btn-primary fixed top-4 left-4 z-30 md:hidden">
        ☰ Menu
      </button>

      <!-- Router View -->
      <div class="max-h-screen flex-1 overflow-y-auto mt-16 md:mt-0 p-4">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AdminSidebar from '@/components/AdminSidebar.vue'

const sidebarOpen = ref(false)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}
const closeSidebar = () => {
  sidebarOpen.value = false
}
</script>
