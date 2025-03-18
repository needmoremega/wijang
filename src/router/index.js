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
  {
    path: '/',
    component: UserPageHandler,
    meta: { requiresAuth: true },
    children: [
      { path: '/', name: 'Home', component: HomePage },
      {
        path: '/jelajahi',
        name: 'Jelajahi',
        component: JelajahiPage,
      },
    ],
  },
  { path: '/logreg', name: 'LoginRegister', component: LRPAge },
  { path: '/baca/', component: () => import('@/views/userView/BacaBuku.vue') },
  {
    path: '/buku/:kategori/:id',
    name: 'Buku',
    component: () => import('@/views/userView/DetailBuku.vue'),
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminPage,
    meta: { requiresAuth: true },
    children: [
      { path: '/admin', component: AdminDashboard },
      { path: 'dashboard', component: AdminDashboard },
      { path: 'buku', name: 'buku', component: AdminBuku },
      { path: 'user', name: 'user', component: AdminUser },
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
