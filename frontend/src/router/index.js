import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/account/LoginView.vue'
import SignUpView from '../views/account/SignUpView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/sign-up',
      name: 'sign-up',
      component: SignUpView
    }
  ]
})

export default router
