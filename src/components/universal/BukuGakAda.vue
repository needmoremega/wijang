<template>
  <div class="flex flex-col items-center min-w-screen min-h-screen text-center">
    <img src="/src/assets/billyNangis.png" alt="Billy Kidman" class="w-72 h-72" />
    <h1>{{ isiTeks }}</h1>
  </div>
</template>
<script setup>
defineProps({
  isiTeks: {
    type: String,
    default: 'Bukunya lagi gak ada nih atau server sedang berkendala.',
  },
})
</script>
