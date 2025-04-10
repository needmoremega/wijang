<script setup>
import { ref, onMounted } from 'vue'
import { getDatabase, ref as dbRef, onValue } from 'firebase/database'
import DesainBuku from '@/components/user/pustaka/DesainBuku.vue'

const db = getDatabase()
const props = defineProps({ userId: String })

const pinjaman = ref([])
const loading = ref(true)

onMounted(() => {
  if (!props.userId) {
    console.log('User belum login.')
    loading.value = false
    return
  }

  const pinjamanRef = dbRef(db, `pinjaman`)
  onValue(pinjamanRef, (snapshot) => {
    const data = snapshot.val()
    if (data) {
      pinjaman.value = Object.entries(data)
        // eslint-disable-next-line no-unused-vars
        .filter(([_, value]) => value.username === props.userId)
        .map(([id, value]) => ({ id, ...value }))
    }
    loading.value = false
    console.log('Data pinjaman:', pinjaman.value) // Debugging
  })
})
</script>

<template>
  <div class="min-h-screen w-full px-6 sm:px-10 md:px-16 lg:px-20 py-10">
    <h2 class="text-3xl font-bold text-primary mb-6 text-center">
      📚 {{ userId ? `Pinjaman ${userId}` : 'Silakan login untuk melihat pinjaman' }}
    </h2>

    <div class="flex justify-center">
      <div v-if="loading" class="loading loading-lg text-primary"></div>
    </div>

    <DesainBuku v-if="!loading" :listPinjaman="pinjaman" />

    <div v-if="!loading && pinjaman.length === 0" class="text-center text-gray-500 mt-6">
      ❌ Tidak ada pinjaman aktif.
    </div>
  </div>
</template>
