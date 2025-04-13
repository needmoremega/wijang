<template>
  <div class="flex flex-col items-center min-w-screen min-h-screen text-center">
    <img src="/src/assets/eousLari.png" alt="Eous" class="w-72 h-72" />
    <h1>{{ isiTeks }}</h1>
  </div>
</template>
<script setup>
defineProps({
  isiTeks: {
    type: String,
    default: 'Bentar ya, lagi loading...',
  },
})
</script>
