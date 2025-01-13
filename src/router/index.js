import AddBuku from '@/components/logikaAdmin/buku/AddBuku.vue'
import AdminBuku from '@/views/AdminBuku.vue'
import AdminDashboard from '@/views/AdminDashboard.vue'
import AdminPage from '@/views/AdminPage.vue'
import AdminUser from '@/views/AdminUser.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', redirect: '/admin' },
  {
    path: '/admin',
    component: AdminPage,
    children: [
      { path: '/admin', component: AdminDashboard },
      { path: 'dashboard', component: AdminDashboard },
      {
        path: 'buku',
        name: 'buku',
        component: AdminBuku,
        children: [{ path: 'tambah', name: 'tambah', component: AddBuku }],
      },
      { path: 'user', name: 'user0', component: AdminUser },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
