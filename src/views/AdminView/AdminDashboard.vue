<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-4">Dashboard</h2>
    <p class="mb-6">Selamat datang di Wijang, Admin!</p>

    <!-- Statistik -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="card bg-base-100 shadow-md p-4">
        <h3 class="text-lg font-semibold">Total Buku</h3>
        <p class="text-2xl font-bold">120</p>
      </div>
      <div class="card bg-base-100 shadow-md p-4">
        <h3 class="text-lg font-semibold">Buku Tersedia</h3>
        <p class="text-2xl font-bold">95</p>
      </div>
      
      <div class="card bg-base-100 shadow-md p-4">
        <h3 class="text-lg font-semibold">Buku Dipinjam</h3>
        <p class="text-2xl font-bold">25</p>
      </div>
      <div class="card bg-base-100 shadow-md p-4">
        <h3 class="text-lg font-semibold">Total Pengguna</h3>
        <p class="text-2xl font-bold">50</p>
      </div>
    </div>

    <!-- Navigasi Cepat -->
    <div class="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
      <button class="btn btn-primary w-full">Kelola Buku</button>
      <button class="btn btn-secondary w-full">Daftar Peminjaman</button>
      <button class="btn btn-accent w-full">Kelola Pengguna</button>
    </div>
  </div>
</template>
