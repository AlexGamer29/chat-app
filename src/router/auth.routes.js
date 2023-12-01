import { Layout, LoginView, SignUpView } from '../views/account'

export default {
  path: '/auth',
  component: Layout,
  children: [
    { path: '', redirect: 'login' },
    { path: 'login', component: LoginView },
    { path: 'sign-up', component: SignUpView }
  ]
}
