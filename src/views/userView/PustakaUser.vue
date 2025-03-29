<script setup>
import { ref, onMounted } from 'vue'
import { getDatabase, ref as dbRef, onValue } from 'firebase/database'

const db = getDatabase()
const username = 'admin' // Gantilah ini dengan username dari user yang sedang login
const pinjaman = ref([])

onMounted(() => {
  const pinjamanRef = dbRef(db, `pinjaman`)
  onValue(pinjamanRef, (snapshot) => {
    const data = snapshot.val()
    if (data) {
      pinjaman.value = Object.entries(data)
        // eslint-disable-next-line no-unused-vars
        .filter(([_, value]) => value.username === username)
        .map(([id, value]) => ({ id, ...value }))
    }
  })
})
</script>

<template>
  <div>
    <h2>Daftar Pinjaman</h2>
    <ul>
      <li v-for="buku in pinjaman" :key="buku.id">
        <strong>{{ buku.judul }}</strong> ({{ buku.kategori }}) <br />
        Dipinjam: {{ buku.WaktuPinjam }} | Kembali: {{ buku.WaktuKembali }} <br />
        <a :href="buku.Pdf" target="_blank">Baca PDF</a>
      </li>
    </ul>
  </div>
</template>
