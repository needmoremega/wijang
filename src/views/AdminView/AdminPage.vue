<template>
  <div class="flex h-full">
    <AdminSidebar class="fixed" />
    <div class="ml-12 flex-1 pt-4">
      <router-view class="bg-base-300 rounded-lg mx-2 my-4 min-h-screen" />
    </div>
  </div>
</template>

<script setup>
import AdminSidebar from '@/components/AdminSidebar.vue'
</script>
