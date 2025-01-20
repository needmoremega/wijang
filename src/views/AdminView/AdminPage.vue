<template>
  <div class="flex h-screen">
    <AdminSidebar />
    <div class="ml-12 flex-1 pt-4">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import AdminSidebar from '@/components/AdminSidebar.vue'
</script>
