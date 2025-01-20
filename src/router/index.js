import AdminBuku from '@/views/AdminView/AdminBuku.vue'
import AdminDashboard from '@/views/AdminView/AdminDashboard.vue'
import AdminPage from '@/views/AdminView/AdminPage.vue'
import AdminUser from '@/views/AdminView/AdminUser.vue'
import LoginPage from '@/views/LoginPage.vue'
import HomePage from '@/views/userView/HomePage.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', redirect: '/user' },
  { path: '/login', component: LoginPage },
  { path: '/user', component: HomePage },
  {
    path: '/admin',
    component: AdminPage,
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

export default router
