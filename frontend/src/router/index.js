import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

import authRoutes from './auth.routes'
import usersRoutes from './users.routes'

import { useAuthStore, useAlertStore } from '../stores'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: 'active',
  routes: [
    { path: '/', component: Home },
    { ...authRoutes },
    { ...usersRoutes }
    // // catch all redirect to home page
    // { path: '/:pathMatch(.*)*', redirect: '/' }
  ]
})

router.beforeEach(async (to) => {
  // clear alert on route change
  const alertStore = useAlertStore()
  alertStore.clear()

  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/auth/login', '/auth/sign-up']
  const authRequired = !publicPages.includes(to.path)
  const authStore = useAuthStore()

  if (authRequired && !authStore.user) {
    authStore.returnUrl = to.fullPath
    return '/auth/login'
  }
})
