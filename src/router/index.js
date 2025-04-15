import ErorPage from '@/components/universal/ErorPage.vue'
import AdminBuku from '@/views/AdminView/AdminBuku.vue'
import AdminDashboard from '@/views/AdminView/AdminDashboard.vue'
import AdminPage from '@/views/AdminView/AdminPage.vue'
import AdminUser from '@/views/AdminView/AdminUser.vue'
import LRPAge from '@/views/LoginRegis.vue'
import HomePage from '@/views/userView/HomePage.vue'
import JelajahiPage from '@/views/userView/JelajahiPage.vue'
import UserPageHandler from '@/views/userView/UserPageHandler.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  // 404 not found path
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: ErorPage }, // ⛔ Route 404

  {
    // common non non
    path: '/',
    component: UserPageHandler,
    meta: { requiresAuth: true },
    children: [
      // halaman utama

      { path: '/', name: 'Home', component: HomePage },

      // halaman explore
      {
        path: '/jelajahi',
        name: 'Jelajahi',
        component: JelajahiPage,
      },

      // Halaman berisi buku yang sudah di pinjam
      {
        path: '/pustaka',
        name: 'Pustaka',
        component: () => import('@/views/userView/PustakaUser.vue'),
      },
      {
        path: '/profile',
        name: 'Profile',
        component: () => import('@/views/userView/ProfilePage.vue'),
      },
    ],
  },

  // path untuk login dan register
  { path: '/logreg', name: 'LoginRegister', component: LRPAge },

  // path untuk baca buku
  { path: '/baca/:id', component: () => import('@/views/userView/BacaBuku.vue') },

  // path untuk detail buku
  {
    path: '/buku/:kategori/:id',
    name: 'Buku',
    component: () => import('@/views/userView/DetailBuku.vue'),
  },

  // admin router
  {
    path: '/admin',
    name: 'Admin',
    component: AdminPage,
    meta: { requiresAuth: true },
    children: [
      { path: '/admin', component: AdminDashboard },
      { path: 'dashboard', component: AdminDashboard },
      { path: 'buku', name: 'buku', component: AdminBuku },
      { path: 'pinjaman', name: 'user', component: AdminUser },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

//cek apa user sudah login
router.beforeEach((to, from, next) => {
  const checkLogin = localStorage.getItem('user')
  return to.meta.requiresAuth && !checkLogin ? next('/logreg') : next()
})

export default router
