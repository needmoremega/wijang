<template>
  <aside
    :class="[
      'bg-base-200 w-64 p-4 flex flex-col justify-between transition-transform duration-300 z-40',
      'md:relative md:translate-x-0 md:block fixed inset-y-0 left-0',
      sidebarOpen ? 'translate-x-0' : '-translate-x-full',
    ]"
  >
    <!-- Header + Menu -->
    <div>
      <!-- Header -->
      <div class="mb-6 flex items-center justify-between">
        <RouterLink
          to="/"
          class="btn btn-ghost p-1 rounded-full"
          @click="closeSidebar"
          title="Kembali ke Home"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </RouterLink>
        <h1 class="text-xl font-bold text-center flex-1">
          <img src="/public/PeronRiduNavFot.png" alt="" />
        </h1>
      </div>

      <!-- Menu List -->
      <ul class="menu gap-2">
        <li v-for="item in Menu" :key="item.name">
          <RouterLink
            :to="item.path"
            class="block p-2 hover:bg-base-300 rounded-md"
            @click="closeSidebar"
          >
            {{ item.name }}
          </RouterLink>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script setup>
defineProps({
  sidebarOpen: Boolean,
  closeSidebar: Function,
})

const Menu = [
  { name: 'Dashboard', path: '/admin/dashboard' },
  { name: 'Buku', path: '/admin/buku' },
  { name: 'Pinjaman', path: '/admin/pinjaman' },
]
</script>
