import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  { path: '/', name: 'landing', component: () => import('../views/Landing.vue') },
  { path: '/login', name: 'login', component: () => import('../views/Login.vue'), meta: { guest: true } },
  { path: '/register', name: 'register', component: () => import('../views/Register.vue'), meta: { guest: true } },
  {
    path: '/', component: () => import('../layouts/DashboardLayout.vue'), meta: { requiresAuth: true },
    children: [
      { path: 'dashboard', name: 'dashboard', component: () => import('../views/Dashboard.vue') },
      { path: 'courses', name: 'courses', component: () => import('../views/Courses.vue') },
      { path: 'courses/:id', name: 'course-detail', component: () => import('../views/CourseDetail.vue'), props: true },
    ]
  },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) return '/login'
  if (to.meta.guest && auth.isAuthenticated) return '/dashboard'
})

export default router
