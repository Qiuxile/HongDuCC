import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/Login.vue'),
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/auth/Register.vue'),
  },
  {
    path: '/news',
    name: 'News',
    component: () => import('@/views/News.vue'),
  },
  {
    path: '/news/:id',
    name: 'NewsDetail',
    component: () => import('@/views/NewsDetail.vue'),
  },
  {
    path: '/forum',
    name: 'Forum',
    component: () => import('@/views/Forum.vue'),
  },
  {
    path: '/forum/:id',
    name: 'ForumDetail',
    component: () => import('@/views/ForumDetail.vue'),
  },
  {
    path: '/resources',
    name: 'Resources',
    component: () => import('@/views/Resources.vue'),
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/About.vue'),
  },
  {
    path: '/clubs',
    name: 'Clubs',
    component: () => import('@/views/Clubs.vue'),
  },
  {
    path: '/clubs/:id',
    name: 'ClubDetail',
    component: () => import('@/views/Clubs.vue'),
  },
  {
    path: '/profile',
    name: 'Profile',
    meta: { requiresAuth: true },
    component: () => import('@/views/Profile.vue'),
  },
  {
    path: '/notifications',
    name: 'Notifications',
    meta: { requiresAuth: true },
    component: () => import('@/views/Notifications.vue'),
  },
  {
    path: '/admin',
    name: 'Admin',
    meta: { requiresAuth: true, requiresAdmin: true },
    component: () => import('@/views/Admin.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Auth guard
router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('token')
  const userStr = localStorage.getItem('user')
  let isAdmin = false
  if (userStr) {
    try { isAdmin = JSON.parse(userStr).role === 'admin' } catch {}
  }

  if (to.meta.requiresAuth && !token) {
    return next({ path: '/login', query: { redirect: to.fullPath } })
  }
  if (to.meta.requiresAdmin && !isAdmin) {
    return next('/')
  }
  // Redirect logged-in users away from auth pages
  if (token && (to.path === '/login' || to.path === '/register')) {
    return next('/')
  }
  next()
})

export default router
